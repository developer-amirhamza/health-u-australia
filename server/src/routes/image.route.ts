import express from "express";
import { auth } from "../middlewares/auth.js";
import { admin } from "../middlewares/admin.js";
import { uploadContentImage } from "../middlewares/upload.js";
import { uploadImage } from "../controllers/uploadImage.controllers.js";

const router = express.Router();

// General CMS image upload.
// Only authenticated ADMIN / OWNER users can upload website content images.
router.post(
    "/upload",
    auth,
    admin,
    uploadContentImage,
    uploadImage
);

export default router;