import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";
import { prisma } from "../lib/prisma.js";

export interface AuthRequest extends Request {
    userId?: string;
}

const getAccessToken = (req: Request): string | undefined => {
    return req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
};

// Populates req.userId from a valid access token (cookie or `Authorization:
// Bearer <token>`). Every "logged-in user" and "admin only" route needs this
// first — none of them can trust req.userId without it.
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = getAccessToken(req);
    if (!token) {
        return errorHandler(res, 401, "Unauthorized: no access token provided", true);
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN as string) as { id: string };
        req.userId = decoded.id;
        next();
    } catch {
        return errorHandler(res, 401, "Unauthorized: invalid or expired access token", true);
    }
};

const ADMIN_ROLES = ["ADMIN", "OWNER"];

// Must run after verifyToken. Checks the user's current role in the
// database rather than trusting a role claim baked into the token, since
// access tokens are only 1 day (accessToken.ts) but a role change (e.g. a
// demotion via updateUserByAdmin) should take effect immediately, not after
// the old token expires.
export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.userId) {
            return errorHandler(res, 401, "Unauthorized", true);
        }
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { role: true },
        });
        if (!user || !ADMIN_ROLES.includes(user.role || "")) {
            return errorHandler(res, 403, "Forbidden: admin access required", true);
        }
        next();
    } catch (error: any) {
        errorHandler(res, 500, error.message || "Internal server error!", true);
    }
};
