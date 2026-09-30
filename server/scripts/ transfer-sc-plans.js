// One-off migration script: copies ScPlan + ScTimeEntry rows from a source
// Postgres database to a target Postgres database, both via Prisma.
//
// This is a COPY, not a MOVE — it never writes to or deletes from the
// source database. It uses `skipDuplicates: true` on insert, so re-running
// it is safe: rows that already exist in the target (matched by id) are
// left untouched, not overwritten.
//
// WHY THIS SHAPE: it reuses this project's own generated Prisma Client
// (server/node_modules/@prisma/client), pointed at two different
// connection strings via the `datasources` override — so the source read
// is guaranteed to match this repo's exact ScPlan/ScTimeEntry schema. The
// target is assumed to have a compatible schema (same table/column names);
// if it doesn't, Prisma will throw a clear error naming the missing
// table/column rather than silently writing the wrong thing.
//
// USAGE (run from inside server/, where @prisma/client is installed):
//   SOURCE_DATABASE_URL="postgresql://..." \
//   TARGET_DATABASE_URL="postgresql://..." \
//   node scripts/transfer-sc-plans.js --dry-run
//
//   (then, once the dry run output looks right, drop --dry-run to write)
//
// Requires: SOURCE_DATABASE_URL and TARGET_DATABASE_URL env vars.
// Never commit this file with real credentials inlined — it only reads
// them from the environment.

const { PrismaClient } = require('@prisma/client');

const SOURCE_URL = process.env.SOURCE_DATABASE_URL;
const TARGET_URL = process.env.DATABASE_URL;
const DRY_RUN = process.argv.includes('--dry-run') || process.env.DRY_RUN === '1';
const BATCH_SIZE = 500;

if (!SOURCE_URL || !TARGET_URL) {
  console.error('Set both SOURCE_DATABASE_URL and TARGET_DATABASE_URL env vars before running.');
  process.exit(1);
}
if (SOURCE_URL === TARGET_URL) {
  console.error('SOURCE_DATABASE_URL and TARGET_DATABASE_URL are identical — refusing to run (this would be a no-op at best).');
  process.exit(1);
}

const sourceDb = new PrismaClient({ datasources: { db: { url: SOURCE_URL } } });
const targetDb = new PrismaClient({ datasources: { db: { url: TARGET_URL } } });

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN (no writes will be made) ===' : '=== LIVE RUN (writing to target) ===');

  const plans = await sourceDb.scPlan.findMany({ orderBy: { createdAt: 'asc' } });
  const entries = await sourceDb.scTimeEntry.findMany({ orderBy: { createdAt: 'asc' } });

  console.log(`Source: ${plans.length} ScPlan row(s), ${entries.length} ScTimeEntry row(s).`);

  // Sanity check: every entry's planId should resolve to a plan we're
  // also copying, so the target's foreign key constraint doesn't reject it.
  const planIds = new Set(plans.map((p) => p.id));
  const orphanEntries = entries.filter((e) => !planIds.has(e.planId));
  if (orphanEntries.length > 0) {
    console.warn(
      `WARNING: ${orphanEntries.length} ScTimeEntry row(s) reference a planId not present in the ScPlan rows just read. ` +
      `These will be skipped to avoid a foreign-key failure. IDs: ${orphanEntries.map((e) => e.id).join(', ')}`
    );
  }
  const safeEntries = entries.filter((e) => planIds.has(e.planId));

  if (DRY_RUN) {
    console.log('Dry run — stopping before any target writes. Sample plan:', plans[0] ?? '(none)');
    return;
  }

  let plansWritten = 0;
  for (const batch of chunk(plans, BATCH_SIZE)) {
    const res = await targetDb.scPlan.createMany({ data: batch, skipDuplicates: true });
    plansWritten += res.count;
  }
  console.log(`Target: inserted ${plansWritten} ScPlan row(s) (${plans.length - plansWritten} already present, skipped).`);

  let entriesWritten = 0;
  for (const batch of chunk(safeEntries, BATCH_SIZE)) {
    const res = await targetDb.scTimeEntry.createMany({ data: batch, skipDuplicates: true });
    entriesWritten += res.count;
  }
  console.log(`Target: inserted ${entriesWritten} ScTimeEntry row(s) (${safeEntries.length - entriesWritten} already present, skipped).`);

  const targetPlanCount = await targetDb.scPlan.count();
  const targetEntryCount = await targetDb.scTimeEntry.count();
  console.log(`Target now has ${targetPlanCount} ScPlan row(s) and ${targetEntryCount} ScTimeEntry row(s) in total.`);
}

main()
  .catch((err) => {
    console.error('Transfer failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sourceDb.$disconnect();
    await targetDb.$disconnect();
  });
