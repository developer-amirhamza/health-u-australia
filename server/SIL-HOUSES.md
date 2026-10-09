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
The original four cover images and 42 gallery photos are provided under
`client/public/sil-houses`. The gallery migration fills the original listings
only when their galleries are empty.

Every listing links to a database-backed `/sil-house/:id` detail page with a
photo hero, property information, gallery, features and enquiry links. The
original static property pages remain available at their existing URLs. Card
links use the database-backed pages so admin changes appear when opened.

The controller is `src/controllers/silHouse.controllers.ts`. Routes are in
`src/routes/silHouse.route.ts`. `npm run test:sil-houses` checks validation;
`npm run db:check` exercises database create, read, update and delete inside
a rolled-back transaction.
