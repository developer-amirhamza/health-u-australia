-- Preserve the existing SIL House listings on first migration.
BEGIN;
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
