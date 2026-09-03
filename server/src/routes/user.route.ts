import express from "express";
import { changePassword, deleteUser, forgotPassword, getAllUsers, GetUserDetails, refreshToken, resetPassword, SignIn, SignOut, SignUp, updateUserByAdmin, updateUserDetails, uploadAvatar, verifyEmail } from "../controllers/user.controllers.js";
import { uploadAvatarImage } from "../middlewares/upload.js";
import { requireAdmin, verifyToken } from "../middlewares/auth.js";



const router = express.Router()

router.post("/signup",SignUp);
router.post("/signin", SignIn);
router.get("/signout", verifyToken, SignOut);
router.post("/verify-email",verifyEmail);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


// Logged-in user
router.get("/get-user-details", verifyToken, GetUserDetails);
router.put("/update-user", verifyToken, updateUserDetails);
router.put("/change-password", verifyToken, changePassword);
router.post("/upload-avatar", verifyToken, uploadAvatarImage, uploadAvatar);

// Admin only
router.get("/all-users", verifyToken, requireAdmin, getAllUsers);
router.put("/update-user-by-admin", verifyToken, requireAdmin, updateUserByAdmin);
router.delete("/delete-user", verifyToken, requireAdmin, deleteUser);









export default router;