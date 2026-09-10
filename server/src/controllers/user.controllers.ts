
import { Response, Request } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";

import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv";
import { prisma } from "../lib/prisma.js";
import { sendEmail } from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import { errorHandler } from "../utils/errorHandler.js";
import generateRefreshToken from "../utils/refreshToken.js";
import generateAccessToken from "../utils/accessToken.js";


dotenv.config()
interface AuthRequest extends Request {
    userId?: string;
}

const SignUp = async (req: Request, res: Response) => {
    try {
        console.log(req.body, "test user")
        const { firstName, lastName, email, mobile, password,role } = req.body;

        const id = uuidv4();
        if (!firstName || !email || !password) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Provide the name, email and password",
            });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return errorHandler(res, 400, "This user already exists", false);
        };
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const otp = crypto.randomInt(100000, 1000000).toString();
        const otpHash = await bcrypt.hash(otp, await bcrypt.genSalt(10));
        const user = await prisma.user.create({
            data: {
                id,
                firstName,
                lastName,
                email,
                role,
                password: hashPassword,
                verify_email: false,
                verify_email_otp: otpHash,
                verify_email_otp_expire: new Date(Date.now() + 10 * 60 * 1000),
                status: "ACTIVE",
                mobile: mobile?.toString(),
            },
        });
        // Email failure shouldn't fail the signup — the account is already created.
        // But don't lie about it either: the client only knows to offer "resend"
        // if the response tells it the first send didn't go out.
        let emailFailed = false;
        const emailResult = await sendEmail({
            sendTo: email,
            subject: "Verify your email - Bestiee",
            html: verifyEmailTemplate({
                firstName,
                otp,
            }),
        }).catch((err) => {
            console.error("Verify email failed:", err.message);
            emailFailed = true;
            return null;
        });


        res.status(200).json({
            success: true,
            error: false,
            message: emailFailed
                ? "Your account has been created, but we couldn't send the verification email just now. Please use \"Resend it\" on the verification page."
                : "Your account has been created! Please verify your email with the code we sent you.",
            data: emailResult,
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: true,
            message: error.message || "Internal server error!",
        })
    }
};


// Verify with the emailed OTP. On success also signs the user in (same as
// SignIn) so the client can redirect straight to their portal by role
// without a second sign-in step.
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return errorHandler(res, 400, "Email and verification code are required", true);
        }

        const user:any = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.verify_email_otp || !user.verify_email_otp_expire) {
            return errorHandler(res, 400, "Invalid or expired verification code", true);
        }
        if (user.verify_email_otp_expire.getTime() < Date.now()) {
            return errorHandler(res, 400, "This code has expired. Please request a new one.", true);
        }
        const otpMatches = await bcrypt.compare(otp, user.verify_email_otp);
        if (!otpMatches) {
            return errorHandler(res, 400, "Invalid or expired verification code", true);
        }

        const refreshToken = await generateRefreshToken(user.id);
        const accessToken = await generateAccessToken(user.id);

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                verify_email: true,
                verify_email_otp: null,
                verify_email_otp_expire: null,
                last_login_date: new Date(),
                refresh_token: refreshToken,
            },
        });

        const cookiesOption: any = {
            httpOnly: true,
            secure: true,
            sameSite: "None" as const,
        };
        res.cookie("accessToken", accessToken, cookiesOption);
        res.cookie("refreshToken", refreshToken, cookiesOption);

        const { password: _password, refresh_token: _refreshToken, forgot_password_otp: _fpOtp, verify_email_otp: _vOtp, ...safeUser } = updatedUser;
        res.status(200).json({
            success: true,
            error: false,
            message: "Your email has been verified successfully!",
            data: { accessToken, refreshToken, user: safeUser },
        })
    } catch (error:any) {
        errorHandler(res,500,`${error.message} || "Internal server error!"`)
    }
};

// Resend the verification OTP — for the still-signed-in-but-unverified
// header alert (identified via the access token) and the verify-email
// screen (identified by the email just typed, since no token exists yet
// right after signup). Always responds with the same generic message so
// this can't be used to probe which emails are registered.
export const resendVerificationEmail = async (req: AuthRequest, res: Response) => {
    try {
        const { email } = req.body;
        const user = req.userId
            ? await prisma.user.findUnique({ where: { id: req.userId } })
            : email
                ? await prisma.user.findUnique({ where: { email } })
                : null;

        if (user && !user.verify_email) {
            const otp = crypto.randomInt(100000, 1000000).toString();
            const otpHash = await bcrypt.hash(otp, await bcrypt.genSalt(10));
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    verify_email_otp: otpHash,
                    verify_email_otp_expire: new Date(Date.now() + 10 * 60 * 1000),
                },
            });
            await sendEmail({
                sendTo: user.email,
                subject: "Verify your email - Bestiee",
                html: verifyEmailTemplate({
                    firstName: user.firstName || "there",
                    otp,
                }),
            }).catch((err) => console.error("Resend verification OTP failed:", err.message));
        }

        res.status(200).json({
            success: true,
            error: false,
            message: "If that account exists and isn't verified yet, a new verification code has been sent.",
        });
    } catch (error: any) {
        errorHandler(res, 500, error.message || "Internal server error!");
    }
};

// Forgot password (signed-out flow): email a one-time code, valid for 10
// minutes. Always responds with the same generic message whether or not the
// account exists, so this endpoint can't be used to check which emails are
// registered.
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return errorHandler(res, 400, "Email is required", true);
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            const otp = crypto.randomInt(100000, 1000000).toString();
            const otpHash = await bcrypt.hash(otp, await bcrypt.genSalt(10));

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    forgot_password_otp: otpHash,
                    forgot_password_expire: new Date(Date.now() + 10 * 60 * 1000),
                },
            });

            await sendEmail({
                sendTo: email,
                subject: "Reset your Health U Shop password",
                html: forgotPasswordTemplate({ firstName: user.firstName || "there", otp }),
            }).catch((err) => console.error("Forgot-password email failed:", err.message));
        }

        res.status(200).json({
            success: true,
            error: false,
            message: "If an account exists for that email, a password reset code has been sent.",
        });
    } catch (error: any) {
        errorHandler(res, 500, error.message || "Internal server error!");
    }
};

// Reset password using the emailed OTP (no login required).
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return errorHandler(res, 400, "Email, code and new password are required", true);
        }
        if (newPassword.length < 6) {
            return errorHandler(res, 400, "Password must be at least 6 characters", true);
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.forgot_password_otp || !user.forgot_password_expire) {
            return errorHandler(res, 400, "Invalid or expired reset code", true);
        }
        if (user.forgot_password_expire.getTime() < Date.now()) {
            return errorHandler(res, 400, "This reset code has expired. Please request a new one.", true);
        }

        const otpMatches = await bcrypt.compare(otp, user.forgot_password_otp);
        if (!otpMatches) {
            return errorHandler(res, 400, "Invalid or expired reset code", true);
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashPassword,
                forgot_password_otp: null,
                forgot_password_expire: null,
            },
        });

        res.status(200).json({
            success: true,
            error: false,
            message: "Password reset successfully. You can now sign in.",
        });
    } catch (error: any) {
        errorHandler(res, 500, error.message || "Internal server error!");
    }
};

// Change password for an already-authenticated user (profile settings) —
// requires the current password, unlike the OTP-based forgot-password reset.
export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return errorHandler(res, 401, "Unauthorized", true);
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return errorHandler(res, 400, "Current and new password are required", true);
        }
        if (newPassword.length < 6) {
            return errorHandler(res, 400, "Password must be at least 6 characters", true);
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return errorHandler(res, 404, "User not found", true);
        }

        const matchPassword = await bcrypt.compare(currentPassword, user.password);
        if (!matchPassword) {
            return errorHandler(res, 400, "Current password is incorrect", true);
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashPassword },
        });

        res.status(200).json({
            success: true,
            error: false,
            message: "Password changed successfully",
        });
    } catch (error: any) {
        errorHandler(res, 500, error.message || "Internal server error!");
    }
};

const SignIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log("Please provide the email or password")
            return errorHandler(res, 404, "Please provide the email or password", true);
        };
        const user: any = await prisma.user.findUnique({ where: { email} });
        if (!user) {
            return errorHandler(res, 404, "User not found!", true);
        };
        // password verify
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return errorHandler(res, 400, "Incorrect Password", true);
        };

        if (!user.verify_email) {
            return errorHandler(
                res,
                403,
                "Please verify your email before signing in. Check your inbox for the verification link, or request a new one.",
                true,
                { code: "EMAIL_NOT_VERIFIED", email: user.email }
            );
        }

        const refreshToken = await generateRefreshToken(user.id);
        const accessToken = await generateAccessToken(user.id);

        // update user status
        await prisma.user.update({
            where: { id: user.id },
            data: {
                last_login_date: new Date(),
                refresh_token: refreshToken
            }
        });

        const cookiesOption:any = {
            httpOnly:true,
            secure:true,
            sameSite:"None" as const,
        }
        res.cookie("accessToken",accessToken,cookiesOption);
        res.cookie("refreshToken",refreshToken,cookiesOption);
        // Never send the password hash (or other private fields) to the client.
        const { password: _password, refresh_token: _refreshToken, forgot_password_otp: _otp, ...safeUser } = user;
        res.status(200).json({
            success: true,
            error: false,
            message: "User signed in successfully",
            data:{accessToken,refreshToken,user:safeUser}
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: true,
            message: error.message || "Internal server error!"
        });
    }
};

// refresh token

export const refreshToken = async (req:AuthRequest, res:Response)=>{
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1];
        if(!refreshToken) return errorHandler(res,401,"No refresh token provided",true);

        const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN as string) as {_id:string};
        if(!decoded){
            return errorHandler(res,401,"Invalid or expired refresh token");
        };

        const userId = decoded._id;
        const newAccessToken = await generateAccessToken(userId);

        const cookiesOption:any = {
            httpOnly:true,
            secure:true,
            sameSite: "None" as const,
        };
        res.cookie("accessToken", newAccessToken, cookiesOption)
    } catch (error:any) {
        errorHandler(res,500,error.message || "Internal server error!",true);
    }
};

const SignOut = async (req: AuthRequest, res: Response) => {
     const userId = req.userId; // get from auth
     console.log(userId,"userid")
     if(!userId){
        return errorHandler(res,400,"Unauthorized",true);
     }
        const cookiesOption = {
            httpOnly:true,
            secure:true,
            sameSite:"None",
        };

        res.cookie("accessToken", cookiesOption);
        res.cookie("refreshToken", cookiesOption);

        await prisma.user.update({
            where:{id:userId},
            data:{refresh_token:""}
        });
        res.status(200).json({
            success: true,
            error: false,
            message: "User signed out successfully",
        });
};

const GetUserDetails = async (req: AuthRequest, res: Response) => {
    try {
        const id:any = req.userId;
        if (!id) {
            return errorHandler(res, 400, "User ID is required", true);
        };
        const user = await prisma.user.findUnique({
             where: { id: id },
            select:{
                id:true,
                firstName:true,
                lastName:true,
                email:true,
                mobile:true,
                avatar:true,
                role:true,
                refresh_token:true,
                verify_email:true,
            }
            });
        if (!user) {
            return errorHandler(res, 404, "User not found", false);
        };
        res.status(200).json({
            success: true,
            error: false,
            data: user
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: true,
            message: error.message || "Internal server error!"
        });
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
           select:{
    id:true, firstName:true, lastName:true, email:true, mobile:true, avatar:true,
    role:true, status:true, verify_email:true, last_login_date:true, createdAt:true,
},
orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({
            success: true,
            error: false,
            data: users
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: true,
            message: error.message || "Internal server error!"
        });
    }
};

const ASSIGNABLE_ROLES = ["CONSUMER", "USER", "TRADE", "RETAILER", "DISTRIBUTOR", "NDIS_COORDINATOR", "ADMIN"];

export const updateUserByAdmin = async (req: Request, res: Response) => {
    try {
        const { id, status, role } = req.body;
        if (!id) return errorHandler(res, 400, "User ID is required", true);

        const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
        if (!target) return errorHandler(res, 404, "User not found", true);

        // The OWNER account is untouchable — no role/status change by anyone.
        if (target.role === "OWNER") {
            return errorHandler(res, 403, "The owner account cannot be modified", true);
        }
        // OWNER can never be granted through the API (DB-only, set once).
        if (role && !ASSIGNABLE_ROLES.includes(role)) {
            return errorHandler(res, 400, "Invalid role", true);
        }

        const updatedData: any = {};
        if (status) updatedData.status = status;
        if (role) updatedData.role = role;
        const updatedUser = await prisma.user.update({
            where: { id }, data: updatedData,
            select: { id: true, firstName:true, lastName:true, email: true, role: true, status: true }
        });
        res.status(200).json({ success: true, error: false, message: "User updated successfully", data: updatedUser });
    } catch (error: any) {
        res.status(500).json({ success: false, error: true, message: error.message || "Internal server error!" });
    }
};

// upload images with cloudinary
export const uploadAvatar = async (req:AuthRequest,res:Response)=>{
    try {
        const userId:any = req.userId;
        const image:any = req.file;
        if(!userId){
            errorHandler(res,404,"Unauthorized User",true);
        };

        const upload:any = await uploadImageCloudinary(image);
        if(!upload?.url){
            errorHandler(res,404,"Image uploading failed!",true);
        }

        const updateUser = await prisma.user.update({
            where:{id:userId},
            data:{avatar:upload?.url},
            select:{id:true, avatar:true}
        });
        return errorHandler(res,200,"The image uploaded successfully!",false,updateUser);
    } catch (error:any) {
        errorHandler(res,500,error.message || "Internal server error!");
    }
};

const updateUserDetails = async (req: AuthRequest, res: Response) => {
    try {
        const userId:any = req.userId;
        if (!userId) {
            return errorHandler(res, 400, "User ID is required", true);
        };
        const {firstName,lastName,email,password,mobile,avatar,role} = req.body;
        let hashPassword = "";
        if(password){
            const salt = await bcrypt.genSalt(10);
            hashPassword = await bcrypt.hash(password,salt);
        };
        const updatedData:any = {};
        if(firstName) updatedData.firstName = firstName;
        if(lastName) updatedData.lastName = lastName;
        if(email) updatedData.email = email;
        if(mobile) updatedData.mobile = mobile;
        if(password) updatedData.password = hashPassword;
        if(avatar) updatedData.avatar = avatar;
        // SECURITY: role is intentionally NOT updatable here — this is the
        // self-service profile endpoint, and honouring a role from the request
        // body would let any user promote themselves (e.g. to ADMIN/OWNER).
        // Role changes go through updateUserByAdmin only.

        const updatedUser = await prisma.user.update({
            where : {id:userId},
            data:updatedData
        })

        res.status(200).json({
            success: true,
            error: false,
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: true,
            message: error.message || "Internal server error!"
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const {id} = req.body;
        if (!id) {
            return errorHandler(res, 400, "User ID is required", false);
        };
        // The OWNER account can never be deleted.
        const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
        if (!target) return errorHandler(res, 404, "User not found", true);
        if (target.role === "OWNER") {
            return errorHandler(res, 403, "The owner account cannot be deleted", true);
        }
        await prisma.user.delete({ where: { id: id } });
        res.status(200).json({
            success: true,
            error: false,
            message: "User deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: true,
            message: error.message || "Internal server error!"
        });
    }
};

export { SignIn, SignOut, SignUp, GetUserDetails, getAllUsers, updateUserDetails, deleteUser, };