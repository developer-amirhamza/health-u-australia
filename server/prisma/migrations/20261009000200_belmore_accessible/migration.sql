-- The original Belmore detail page shows the fully accessible sign.
UPDATE "SilHouse" SET "accessible" = true
WHERE "id" = 'sil-belmore' AND "accessible" = false;
