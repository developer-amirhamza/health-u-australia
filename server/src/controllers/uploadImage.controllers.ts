import { Response } from "express";
import { errorHandler } from "../utils/errorHandler.js";
import { uploadImageCloudinary } from "../config/cloudinary.js";

// Uploads a general website/CMS image to Cloudinary.
// The image has already been validated by the uploadContentImage middleware.
export const uploadImage = async (req: any, res: Response) => {
    try {
        const file = req.file;

        if (!file) {
            return errorHandler(
                res,
                400,
                "No image was uploaded",
                true
            );
        }

        const uploadedImage = await uploadImageCloudinary(file);

        return errorHandler(
            res,
            200,
            "The image uploaded successfully!",
            false,
            uploadedImage
        );
    } catch (error: any) {
        return errorHandler(
            res,
            500,
            error.message || "Internal server error!",
            true
        );
    }
};