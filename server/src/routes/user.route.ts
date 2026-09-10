import express from "express";
import { changePassword, deleteUser, forgotPassword, getAllUsers, GetUserDetails, refreshToken, resendVerificationEmail, resetPassword, SignIn, SignOut, SignUp, updateUserByAdmin, updateUserDetails, uploadAvatar, verifyEmail } from "../controllers/user.controllers.js";
import { uploadAvatarImage } from "../middlewares/upload.js";
import { auth } from "../middlewares/auth.js";
import { admin } from "../middlewares/admin.js";



const router = express.Router()

router.post("/signup",SignUp);
router.post("/signin", SignIn);
router.get("/signout", auth, SignOut);
router.post("/verify-email",verifyEmail);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-verification-email", resendVerificationEmail)


// Logged-in user
router.get("/get-user-details", auth, GetUserDetails);
router.put("/update-user", auth, updateUserDetails);
router.put("/change-password", auth, changePassword);
router.post("/upload-avatar", auth, uploadAvatarImage, uploadAvatar);

// Admin only
router.get("/all-users", auth, admin, getAllUsers);
router.put("/update-user-by-admin", auth, admin, updateUserByAdmin);
router.delete("/delete-user", auth, admin, deleteUser);









export default router;