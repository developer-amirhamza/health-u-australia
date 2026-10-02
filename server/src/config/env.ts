import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

// Resolves from both src/config and dist/config. Explicit process variables win.
const root = new URL('../../', import.meta.url);
dotenv.config({
  path: process.env.NODE_ENV === 'production'
    ? fileURLToPath(new URL('.env', root))
    : [fileURLToPath(new URL('.env.local', root)), fileURLToPath(new URL('.env', root))],
  quiet: true,
});
