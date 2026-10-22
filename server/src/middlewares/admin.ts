import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { PANEL_ROLES, canAccessSection, isFullAdmin, type AdminSection } from "../utils/permissions.js";


interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  userPermissions?: string[];
}

const deny = (res: Response, status: number, message: string) =>
  res.status(status).json({ success: false, error: true, message });

const loadUser = (id: string) =>
  prisma.user.findUnique({ where: { id }, select: { role: true, permissions: true } });

// Must be used AFTER the `auth` middleware, which sets req.userId.
// Lets in everyone who uses the admin panel: ADMIN, OWNER (the site owner,
// full admin access) and MODERATOR. Each section's routes add `section(...)`
// after this, so a moderator only reaches the sections an admin granted.
export const admin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return deny(res, 401, "Authentication required");

    const user = await loadUser(userId);
    if (!user || !user.role || !PANEL_ROLES.includes(user.role)) {
      return deny(res, 403, "Access denied. Admin privileges required.");
    }

    req.userRole = user.role;
    req.userPermissions = user.permissions;
    next();
  } catch (error: any) {
    return deny(res, 500, error.message || "Internal server error!");
  }
};

// Use AFTER `admin`: ADMIN / OWNER pass; a MODERATOR only when an admin has
// granted them this section. `key` may be worked out from the request (e.g. a
// page slug); an unknown one lets admins through only.
export const section = (key: AdminSection | ((req: AuthRequest) => AdminSection | undefined)) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const k = typeof key === "function" ? key(req) : key;
    if (!k ? !isFullAdmin(req.userRole) : !canAccessSection(req.userRole, req.userPermissions, k)) {
      return deny(res, 403, "Access denied. You don't have access to this section.");
    }
    next();
  };

// For routes any signed-in staff member may use (use AFTER `auth`): blocks a
// MODERATOR who hasn't been granted the section, and lets everyone else through
// exactly as before.
export const moderatorSection = (key: AdminSection) =>
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.userId ? await loadUser(req.userId) : null;
      if (user?.role === "MODERATOR" && !canAccessSection(user.role, user.permissions, key)) {
        return deny(res, 403, "Access denied. You don't have access to this section.");
      }
      next();
    } catch (error: any) {
      return deny(res, 500, error.message || "Internal server error!");
    }
  };
