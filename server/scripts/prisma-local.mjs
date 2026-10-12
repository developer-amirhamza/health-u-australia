import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const localEnv = fileURLToPath(new URL('../.env.local', import.meta.url));
if (!existsSync(localEnv)) throw new Error('Run npm run db:local:setup or configure server/.env.local first.');
dotenv.config({ path: localEnv, quiet: true });
const url = new URL(process.env.DATABASE_URL || '');
if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || process.env.NODE_ENV === 'production') {
  throw new Error('Local migration commands require a local PostgreSQL URL and a non-production environment.');
}
const result = spawnSync(process.execPath, [fileURLToPath(new URL('../node_modules/prisma/build/index.js', import.meta.url)), ...process.argv.slice(2)], {
  cwd: root, stdio: 'inherit', env: process.env,
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
