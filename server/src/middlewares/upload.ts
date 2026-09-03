import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/errorHandler.js";

// Memory storage — uploadImageCloudinary (config/cloudinary.ts) reads the
// buffer directly and streams it to Cloudinary, so nothing needs to touch disk.
const storage = multer.memoryStorage();

const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
};

const avatarUpload = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// multer's own errors (bad file type, too large, ...) surface via a callback,
// not a thrown exception, so a plain `.single(...)` in the route would fall
// through to Express's default HTML error page instead of this API's usual
// JSON error shape. Wrap it so upload failures look like every other error here.
export const uploadAvatarImage = (req: Request, res: Response, next: NextFunction) => {
    avatarUpload.single("avatar")(req, res, (err: unknown) => {
        if (err instanceof multer.MulterError) {
            return errorHandler(res, 400, err.message, true);
        }
        if (err instanceof Error) {
            return errorHandler(res, 400, err.message, true);
        }
        next();
    });
};
