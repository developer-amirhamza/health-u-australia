# SIL House administration

The admin page is `/admin/sil-houses`. ADMIN and OWNER accounts can add,
view, edit and delete property listings. All write and image upload endpoints
require the existing authentication and admin middleware. Visitors can only
read properties at `/sil-house` and `/sil-house/:id`.

## Setup

For local PostgreSQL development, see [LOCAL-DATABASE.md](LOCAL-DATABASE.md).
From `server`:

```sh
npm install
npm run db:local:setup
npm run build
npm run test:sil-houses
```

Prisma migrations now create the full application schema and import the four
existing listings into a new database. A setup marker prevents subsequent runs
from restoring deleted listings or overwriting edits. The older additive
`setup:sil-houses` SQL remains available for databases predating these migrations;
it is not needed after `db:local:setup`. See the local database guide before
adopting the initial migration on any existing populated remote database.

The client uses the existing `NEXT_PUBLIC_BACKEND_API_URL`. Uploaded images use
the existing Cloudinary settings (`CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET_KEY`), or admins may provide HTTPS image URLs directly.
The original four cover images are also provided under `client/public/sil-houses`.

Existing listings keep their original property-page links. Their bespoke detail
pages and all general SIL page text remain unchanged. New properties receive a
detail page showing their cover, address, room counts, accessibility, description,
gallery and enquiry links. Deleting a listing removes its public card; original
static property pages are retained at their existing URLs.

The controller is `src/controllers/silHouse.controllers.ts`. Routes are in
`src/routes/silHouse.route.ts`. Tests exercise validation, authorization, CRUD,
missing records and empty lists using an in-memory Prisma substitute; they do
not touch the configured database.
