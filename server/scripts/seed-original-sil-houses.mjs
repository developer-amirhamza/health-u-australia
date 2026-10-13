import '../src/config/env.ts';
import { readFileSync } from 'node:fs';
import { Pool } from 'pg';

const migrations = new URL('../prisma/migrations/', import.meta.url);
const seed = readFileSync(new URL('20261002000100_seed_sil_houses/migration.sql', migrations), 'utf8');
const insert = seed.match(/INSERT INTO "SilHouse"[\s\S]*?ON CONFLICT DO NOTHING;/)?.[0];
if (!insert) throw new Error('Original SIL house seed statement was not found');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();
try {
  await client.query('BEGIN');
  const existing = await client.query('SELECT "id" FROM "SilHouse"');
  const missing = ['sil-belmore', 'sil-bowden', 'sil-normanhurst', 'sil-granny-flat']
    .filter(id => !existing.rows.some(row => row.id === id));
  if (missing.length) {
    await client.query(insert);
    for (const file of [
      '20261009000100_sil_house_galleries/migration.sql',
      '20261009000300_cloudinary_sil_images/migration.sql',
    ]) {
      await client.query(readFileSync(new URL(file, migrations), 'utf8'));
    }
  }
  await client.query('COMMIT');
  console.log(`Original SIL houses available: ${4 - missing.length} existing, ${missing.length} inserted`);
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
  await pool.end();
}
