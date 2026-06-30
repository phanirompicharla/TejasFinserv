import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hostinger specific paths
const hostingerEnvPath = path.resolve(__dirname, '../../.builds/config/.env');
const rootEnvPath = path.resolve(__dirname, '../../.env');

// Try Hostinger path first, then local root
if (fs.existsSync(hostingerEnvPath)) {
    dotenv.config({ path: hostingerEnvPath });
    // console.log('[ENV] Loaded from Hostinger path');
} else if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
    // console.log('[ENV] Loaded from Local root');
} else {
    // console.warn('[ENV] No .env file found. Relying on system environment variables.');
}
