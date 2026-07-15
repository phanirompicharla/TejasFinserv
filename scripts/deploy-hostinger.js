import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
// On Hostinger, Git deploys to /home/u715321875/domains/tejasfinserv.com/nodejs/
// So ../../public_html resolves to /home/u715321875/domains/tejasfinserv.com/public_html/
const hostingerPublicHtml = path.resolve(__dirname, '../../public_html');
const localPublicHtml = path.resolve(__dirname, '../public_html');

function copyRecursiveSync(src, dest) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyRecursiveSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log('[AUTO-DEPLOY] Checking Hostinger directory structure after vite build...');
if (fs.existsSync(distDir)) {
    if (fs.existsSync(hostingerPublicHtml)) {
        console.log(`[AUTO-DEPLOY] Found Hostinger public_html target at: ${hostingerPublicHtml}`);
        console.log('[AUTO-DEPLOY] Copying build files from dist/ to public_html/ ...');
        copyRecursiveSync(distDir, hostingerPublicHtml);
        console.log('[AUTO-DEPLOY] SUCCESS: Automatically deployed dist/ to Hostinger public_html!');
    } else if (fs.existsSync(localPublicHtml)) {
        console.log(`[AUTO-DEPLOY] Found local public_html target at: ${localPublicHtml}`);
        copyRecursiveSync(distDir, localPublicHtml);
        console.log('[AUTO-DEPLOY] SUCCESS: Copied dist/ to local public_html!');
    } else {
        console.log('[AUTO-DEPLOY] Not running in Hostinger nodejs folder (public_html not found at ../../public_html). Build complete.');
    }
} else {
    console.warn('[AUTO-DEPLOY] WARNING: dist/ directory not found at:', distDir);
}
