import express from "express";
import { changePassword, deleteUser, forgotPassword, getAllUsers, GetUserDetails, refreshToken, resetPassword, SignIn, SignOut, SignUp, updateUserByAdmin, updateUserDetails, uploadAvatar, verifyEmail } from "../controllers/user.controllers.js";
import { uploadAvatarImage } from "../middlewares/upload.js";



const router = express.Router()

router.post("/signup",SignUp);
router.post("/signin", SignIn);
router.get("/signout", SignOut);
router.post("/verify-email",verifyEmail);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


// Logged-in user
router.get("/get-user-details", GetUserDetails);
router.put("/update-user", updateUserDetails);
router.put("/change-password", changePassword);
router.post("/upload-avatar", uploadAvatarImage, uploadAvatar);

// Admin only
router.get("/all-users",  getAllUsers);
router.put("/update-user-by-admin", updateUserByAdmin);
router.delete("/delete-user",  deleteUser);









export default router;