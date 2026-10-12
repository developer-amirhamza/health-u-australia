-- Populate the original four listings only when they have not been edited.
UPDATE "SilHouse" SET "gallery" = ARRAY[
  '/sil-houses/gallery/belmore_street/belmore1.png',
  '/sil-houses/gallery/belmore_street/belmore2.png',
  '/sil-houses/gallery/belmore_street/belmore3.png',
  '/sil-houses/gallery/belmore_street/belmore4.png',
  '/sil-houses/gallery/belmore_street/belmore5.png',
  '/sil-houses/gallery/belmore_street/belmore6.png',
  '/sil-houses/gallery/belmore_street/belmore7.png',
  '/sil-houses/gallery/belmore_street/belmore8.png',
  '/sil-houses/gallery/belmore_street/belmore9.png',
  '/sil-houses/gallery/belmore_street/belmore10.png',
  '/sil-houses/gallery/belmore_street/belmore11.png',
  '/sil-houses/gallery/belmore_street/belmore12.png',
  '/sil-houses/gallery/belmore_street/belmore13.png',
  '/sil-houses/gallery/belmore_street/belmore14.png',
  '/sil-houses/gallery/belmore_street/belmore15.png'
] WHERE "id" = 'sil-belmore' AND cardinality("gallery") = 0;
UPDATE "SilHouse" SET "gallery" = ARRAY[
  '/sil-houses/gallery/bowden_street/bowden1.png',
  '/sil-houses/gallery/bowden_street/bowden2.png',
  '/sil-houses/gallery/bowden_street/bowden3.png',
  '/sil-houses/gallery/bowden_street/bowden4.png',
  '/sil-houses/gallery/bowden_street/bowden5.png',
  '/sil-houses/gallery/bowden_street/bowden6.png',
  '/sil-houses/gallery/bowden_street/bowden7.png',
  '/sil-houses/gallery/bowden_street/bowden8.png',
  '/sil-houses/gallery/bowden_street/bowden9.png',
  '/sil-houses/gallery/bowden_street/bowden10.png'
] WHERE "id" = 'sil-bowden' AND cardinality("gallery") = 0;
UPDATE "SilHouse" SET "gallery" = ARRAY[
  '/sil-houses/gallery/Normanhurst/Normanhurst1.png',
  '/sil-houses/gallery/Normanhurst/Normanhurst2.png',
  '/sil-houses/gallery/Normanhurst/Normanhurst3.png',
  '/sil-houses/gallery/Normanhurst/Normanhurst4.png',
  '/sil-houses/gallery/Normanhurst/Normanhurst5.png',
  '/sil-houses/gallery/Normanhurst/Normanhurst6.png',
  '/sil-houses/gallery/Normanhurst/Normanhurst7.png',
  '/sil-houses/gallery/Normanhurst/Normanhurst8.png',
  '/sil-houses/gallery/Normanhurst/Normanhurst9.png',
  '/sil-houses/gallery/Normanhurst/Normanhurst10.png'
] WHERE "id" = 'sil-normanhurst' AND cardinality("gallery") = 0;
UPDATE "SilHouse" SET "gallery" = ARRAY[
  '/sil-houses/gallery/granny_flat/granny_flat1.png',
  '/sil-houses/gallery/granny_flat/granny_flat2.png',
  '/sil-houses/gallery/granny_flat/granny_flat3.png',
  '/sil-houses/gallery/granny_flat/granny_flat4.png',
  '/sil-houses/gallery/granny_flat/granny_flat5.png',
  '/sil-houses/gallery/granny_flat/granny_flat6.png',
  '/sil-houses/gallery/granny_flat/granny_flat7.png'
] WHERE "id" = 'sil-granny-flat' AND cardinality("gallery") = 0;
