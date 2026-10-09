-- Additive setup for this repository, which has no baseline migration history.
-- Run once before deploying the SIL House UI. Re-running does not overwrite edits.
BEGIN;
CREATE TABLE IF NOT EXISTS "SilHouse" (
  "id" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "image" TEXT NOT NULL,
  "bedrooms" INTEGER NOT NULL,
  "bathrooms" INTEGER NOT NULL,
  "parking" INTEGER NOT NULL,
  "accessible" BOOLEAN NOT NULL DEFAULT false,
  "description" TEXT NOT NULL DEFAULT '',
  "gallery" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "legacyPath" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SilHouse_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "SilHouse_legacyPath_key" ON "SilHouse"("legacyPath");

-- Seed only on initial setup. A deleted listing must not return on a later deploy.
CREATE TABLE IF NOT EXISTS "SilHouseSetup" (
  "id" TEXT PRIMARY KEY
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "SilHouseSetup" WHERE "id" = 'original-listings-v1') THEN
    INSERT INTO "SilHouse" ("id", "address", "image", "bedrooms", "bathrooms", "parking", "accessible", "legacyPath", "sortOrder", "updatedAt") VALUES
      ('sil-belmore', 'Belmore Street Ryde NSW 2112', '/sil-houses/belmore.png', 3, 3, 3, false, '/belmore_street/', 0, CURRENT_TIMESTAMP),
      ('sil-bowden', 'Bowden Street Ryde NSW 2112', '/sil-houses/bowden.png', 3, 3, 2, false, '/bowden_street/', 1, CURRENT_TIMESTAMP),
      ('sil-normanhurst', 'Denman Parade Normanhurst NSW 2076', '/sil-houses/normanhurst.png', 4, 2, 3, true, '/normanhurst/', 2, CURRENT_TIMESTAMP),
      ('sil-granny-flat', 'Belmore Street Ryde NSW 2112 (Granny Flat) ', '/sil-houses/granny-flat.png', 2, 2, 2, true, '/granny-flat/', 3, CURRENT_TIMESTAMP)
    ON CONFLICT DO NOTHING;
    INSERT INTO "SilHouseSetup" ("id") VALUES ('original-listings-v1');
  END IF;
END;
$$;
COMMIT;
