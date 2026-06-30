import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.join(__dirname, 'server_startup.log');

// --- HELPER: Logging ---
function log(msg) {
    const time = new Date().toISOString();
    const line = `[${time}] ${msg}\n`;
    try {
        fs.appendFileSync(logFile, line);
        console.log(line.trim());
    } catch (e) {
        console.error("LOGGING FAILED:", e);
    }
}

// --- HELPER: Emergency Server ---
function startEmergencyServer(error) {
    const port = process.env.PORT || 3000;
    log(`STARTING EMERGENCY SERVER on port ${port} due to: ${error.message}`);

    try {
        const server = http.createServer((req, res) => {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(`
CRITICAL STARTUP ERROR
======================
The Node.js application failed to start.

Error Details:
${error.stack || error}

Time: ${new Date().toISOString()}
Check 'server_startup.log' for more info.
            `.trim());
        });

        server.listen(port, () => {
            log(`Emergency server listening on port ${port}`);
        });

        // Prevent process exit
        setInterval(() => { }, 1000 * 60 * 60);
    } catch (srvErr) {
        log(`FATAL: Could not start emergency server: ${srvErr.message}`);
    }
}

// --- MAIN EXECUTION ---
log("--- SERVER ENTRY STARTED ---");

process.on('uncaughtException', (err) => {
    log(`UNCAUGHT EXCEPTION: ${err.stack || err}`);
    startEmergencyServer(err);
});

process.on('unhandledRejection', (reason, promise) => {
    log(`UNHANDLED REJECTION: ${reason}`);
});

(async () => {
    try {
        const serverPath = path.join(__dirname, 'server/server.js');
        log(`Target Server Path: ${serverPath}`);

        if (!fs.existsSync(serverPath)) {
            throw new Error(`server/server.js DOES NOT EXIST at ${serverPath}`);
        }

        log("Attempting import of server/server.js...");
        await import('./server/server.js');
        log("Import successful. Express should be running.");

    } catch (err) {
        log(`IMPORT FAILED: ${err.stack || err}`);
        startEmergencyServer(err);
    }
})();
