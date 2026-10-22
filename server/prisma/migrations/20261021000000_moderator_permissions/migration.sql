-- Moderator role: the restricted admin-panel sections an admin has granted.
ALTER TABLE "User" ADD COLUMN "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[];
