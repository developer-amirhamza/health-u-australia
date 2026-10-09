# Local PostgreSQL development (Windows)

From `server`, with dependencies installed:

```sh
npm run db:local:setup
npm run dev
```

The setup command uses an installed PostgreSQL 16–18, creates a project-owned
cluster in `.local/postgres`, starts it on `127.0.0.1:5433`, creates
`health_u_local`, applies the Prisma migrations and generates the Prisma client.
It leaves existing PostgreSQL services and databases alone. If the PostgreSQL
binaries are elsewhere, set `POSTGRES_BIN` to the installation's `bin` directory.

Setup creates `.env.local` with a random database password, backend port `4000`,
loopback-only backend binding, and local client origins. PostgreSQL uses password
authentication and listens only on loopback. `.local/` and `.env.local` are ignored
by Git. Rerunning setup reuses the database and applies only pending migrations;
it does not reset data or restore deleted SIL listings.

The backend and Prisma CLI both load `.env.local` before `.env` in development.
Explicit process environment variables take precedence. With `NODE_ENV=production`,
the local file is ignored. The existing `.env` connection is preserved.
For an already configured local PostgreSQL server, use `.env.local.example` as a
template and run `npm run db:deploy` instead of initializing a new cluster.

## Everyday commands

```sh
npm run db:local:start
npm run db:status
npm run db:check
npm run db:migrate -- --name describe_your_change
npm run db:deploy
npm run db:local:stop
```

`db:migrate` creates/applies a migration after editing `prisma/schema.prisma`.
`db:deploy` applies committed migrations. Both commands require local connection
settings and reject remote hosts. PostgreSQL must be started again after reboot;
this setup does not install another Windows service. The cluster role is the
local development administrator so Prisma can create temporary shadow databases.

The initial migration creates all application tables. A second migration imports
the four original SIL houses without changing their content. User accounts and
other records from the remote database are not copied into this fresh local DB.
The frontend's existing `NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4000` works
with this setup. Start the frontend separately with `npm run dev` from `client`.

## Existing remote databases

The initial migration is for a new empty database. Do not apply it directly to
an existing populated database: first compare its schema and establish a matching
Prisma baseline. The guarded local commands never perform that remote operation.
