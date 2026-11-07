import http from 'http';
import app from '../server/server.js';

process.env.NODE_ENV = 'test';

const server = http.createServer(app);

server.listen(0, '127.0.0.1', async () => {
    const port = server.address().port;
    const baseUrl = `http://127.0.0.1:${port}`;
    console.log(`[TEST RUNNER] Server listening on ${baseUrl}\n`);

    const results = [];

    async function probe(testName, path, options = {}) {
        return new Promise((resolve) => {
            const req = http.request(`${baseUrl}${path}`, options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        testName,
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: data
                    });
                });
            });
            req.on('error', (err) => {
                resolve({ testName, statusCode: 0, headers: {}, body: '', error: err.message });
            });
            if (options.body) {
                req.write(options.body);
            }
            req.end();
        });
    }

    try {
        // Test 1: Homepage HTML & Headers
        const t1 = await probe('Homepage HTML (200 OK + RFC 8288 + Security Headers)', '/');
        const pass1 = t1.statusCode === 200 &&
                      t1.headers['link'] && t1.headers['link'].includes('/llms.txt') &&
                      t1.headers['permissions-policy'] &&
                      t1.headers['x-content-type-options'] === 'nosniff' &&
                      t1.body.includes('<h1');
        results.push({ name: t1.testName, passed: pass1, details: `Status: ${t1.statusCode}, Link: ${t1.headers['link']}` });

        // Test 2: Homepage Markdown Content Negotiation
        const t2 = await probe('Homepage Markdown Content Negotiation (Accept: text/markdown)', '/', {
            headers: { 'Accept': 'text/markdown' }
        });
        const pass2 = t2.statusCode === 200 &&
                      t2.headers['content-type'].includes('text/markdown') &&
                      t2.body.includes('# Tejas Finserv') &&
                      t2.body.includes('ARN-251896');
        results.push({ name: t2.testName, passed: pass2, details: `Status: ${t2.statusCode}, Content-Type: ${t2.headers['content-type']}` });

        // Test 3: /robots.txt with Content-Signal
        const t3 = await probe('Robots.txt Content-Signal declaration', '/robots.txt');
        const pass3 = t3.statusCode === 200 &&
                      t3.body.includes('Content-Signal: search=yes, ai-train=no');
        results.push({ name: t3.testName, passed: pass3, details: `Status: ${t3.statusCode}, Has Content-Signal: ${t3.body.includes('Content-Signal: search=yes, ai-train=no')}` });

        // Test 4: /llms.txt
        const t4 = await probe('Well-formed llms.txt route', '/llms.txt');
        const pass4 = t4.statusCode === 200 &&
                      t4.body.includes('# Tejas Finserv') &&
                      t4.body.includes('https://tejasfinserv.com/nav');
        results.push({ name: t4.testName, passed: pass4, details: `Status: ${t4.statusCode}, Body length: ${t4.body.length}` });

        // Test 5: /.well-known/mcp/server-card.json
        const t5 = await probe('MCP Server Card (application/json)', '/.well-known/mcp/server-card.json');
        let cardParsed = false;
        try {
            const json = JSON.parse(t5.body);
            if (json.name && json.resources) cardParsed = true;
        } catch (e) {}
        const pass5 = t5.statusCode === 200 &&
                      t5.headers['content-type'].includes('application/json') &&
                      cardParsed;
        results.push({ name: t5.testName, passed: pass5, details: `Status: ${t5.statusCode}, Valid JSON: ${cardParsed}` });

        // Test 6: Mutual Fund NAV Today page
        const t6 = await probe('NAV Page HTML (/nav)', '/nav');
        const pass6 = t6.statusCode === 200 &&
                      t6.body.includes('Mutual Fund NAV Today');
        results.push({ name: t6.testName, passed: pass6, details: `Status: ${t6.statusCode}` });

        // Test 7: NAV Page Markdown
        const t7 = await probe('NAV Page Markdown Negotiation (/nav)', '/nav', {
            headers: { 'Accept': 'text/markdown' }
        });
        const pass7 = t7.statusCode === 200 &&
                      t7.headers['content-type'].includes('text/markdown') &&
                      t7.body.includes('Mutual Fund NAV Today');
        results.push({ name: t7.testName, passed: pass7, details: `Status: ${t7.statusCode}` });

        // Test 8: Non-existent Page returns HTTP 404 (NOT 200)
        const t8 = await probe('Non-existent route returns HTTP 404', '/non-existent-random-page-abc123xyz');
        const pass8 = t8.statusCode === 404 &&
                      t8.body.includes('noindex');
        results.push({ name: t8.testName, passed: pass8, details: `Status: ${t8.statusCode} (expected 404), has noindex: ${t8.body.includes('noindex')}` });

        // Test 9: Non-existent Page Markdown returns HTTP 404
        const t9 = await probe('Non-existent route with text/markdown returns HTTP 404', '/non-existent-random-page-abc123xyz', {
            headers: { 'Accept': 'text/markdown' }
        });
        const pass9 = t9.statusCode === 404 &&
                      t9.body.includes('# 404 Page Not Found');
        results.push({ name: t9.testName, passed: pass9, details: `Status: ${t9.statusCode} (expected 404)` });

        // Test 10: Permanently Removed Page returns HTTP 410 Gone
        const t10 = await probe('Permanently removed route returns HTTP 410 Gone', '/legacy-app');
        const pass10 = t10.statusCode === 410;
        results.push({ name: t10.testName, passed: pass10, details: `Status: ${t10.statusCode} (expected 410)` });

        // Test 11: Non-existent API returns 404 JSON
        const t11 = await probe('Non-existent API endpoint returns 404 JSON', '/api/non-existent');
        const pass11 = t11.statusCode === 404 &&
                       t11.body.includes('API endpoint not found');
        results.push({ name: t11.testName, passed: pass11, details: `Status: ${t11.statusCode}` });

        // Test 12: Input Validation on Contact API
        const t12 = await probe('Contact API Input Validation rejection (empty payload)', '/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const pass12 = t12.statusCode === 400;
        results.push({ name: t12.testName, passed: pass12, details: `Status: ${t12.statusCode} (expected 400)` });

        // Print Summary
        console.log('='.repeat(70));
        console.log('TEST SUITE VERIFICATION RESULTS:');
        console.log('='.repeat(70));
        let allPassed = true;
        for (const r of results) {
            const statusStr = r.passed ? '✓ PASS' : '✗ FAIL';
            console.log(`${statusStr} | ${r.name}`);
            console.log(`        Details: ${r.details}`);
            if (!r.passed) allPassed = false;
        }
        console.log('='.repeat(70));
        console.log(`OVERALL RESULT: ${allPassed ? 'ALL TESTS PASSED (12/12)' : 'SOME TESTS FAILED'}`);
        console.log('='.repeat(70));

    } catch (e) {
        console.error('Error during test execution:', e);
    } finally {
        server.close();
        process.exit(0);
    }
});
