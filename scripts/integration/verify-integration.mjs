import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const TEST_PORT = process.env.TEST_PORT || '8098';
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

async function runIntegrationChecks() {
  const serverProcess = spawn('node', ['server.js'], {
    env: { ...process.env, PORT: TEST_PORT },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout waiting for server.js to start'));
    }, 8000);

    serverProcess.stdout.on('data', (chunk) => {
      if (chunk.toString().includes(TEST_PORT)) {
        clearTimeout(timeout);
        resolve();
      }
    });

    serverProcess.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });

  try {
    // 1. /api/health -> 200
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    assert.equal(healthRes.status, 200, 'Expected GET /api/health to return 200');
    const healthBody = await healthRes.json();
    assert.equal(healthBody.status, 'ok');
    console.log('✓ GET /api/health -> 200 OK');

    // 2. /api/auth/login (Demo TV1) -> 200
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'tv1@soulvillage.vn', password: 'hoalang2026' }),
    });
    assert.equal(loginRes.status, 200, 'Expected POST /api/auth/login to return 200');
    const loginBody = await loginRes.json();
    assert.ok(loginBody.token, 'Expected signed auth token');
    assert.equal(loginBody.user.role, 'tv1_lead');
    console.log('✓ POST /api/auth/login (TV1) -> 200 OK');

    // 3. /api/auth/me -> 200
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${loginBody.token}` },
    });
    assert.equal(meRes.status, 200, 'Expected GET /api/auth/me to return 200');
    console.log('✓ GET /api/auth/me -> 200 OK');

    // 4. /api/auth/register -> 201
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Nguyễn Phúc Lữ Khách',
        email: `visitor.${Date.now()}@soulvillage.vn`,
        password: 'password123',
        role: 'visitor',
      }),
    });
    assert.equal(regRes.status, 201, 'Expected POST /api/auth/register to return 201');
    console.log('✓ POST /api/auth/register -> 201 Created');

    // 5. /api/places -> 200 (after TV3 merge) or 501 (starter stub before TV3 merge)
    const placesRes = await fetch(`${BASE_URL}/api/places`);
    assert.ok(
      placesRes.status === 200 || placesRes.status === 501,
      `Expected GET /api/places to return 200 or 501, got ${placesRes.status}`
    );
    console.log(`✓ GET /api/places -> ${placesRes.status}`);

    // 6. POST /api/itinerary with empty body -> 400 (after TV2 merge) or 501 (starter stub before TV2 merge)
    const itineraryRes = await fetch(`${BASE_URL}/api/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.ok(
      itineraryRes.status === 400 || itineraryRes.status === 501,
      `Expected POST /api/itinerary with {} to return 400 or 501, got ${itineraryRes.status}`
    );
    console.log(`✓ POST /api/itinerary ({}) -> ${itineraryRes.status}`);

    // 7. POST /api/itinerary with malformed JSON -> 400
    const badJsonRes = await fetch(`${BASE_URL}/api/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{bad-json',
    });
    assert.equal(badJsonRes.status, 400, 'Expected malformed JSON to return 400');
    console.log('✓ POST /api/itinerary (malformed JSON) -> 400 INVALID_JSON');

    // 8. /api/passport -> 501
    const passportRes = await fetch(`${BASE_URL}/api/passport`);
    assert.equal(passportRes.status, 501, 'Expected /api/passport to return 501');
    console.log('✓ GET /api/passport -> 501 NOT_IMPLEMENTED');

    // 9. Unknown /api route -> 404 JSON
    const unknownApiRes = await fetch(`${BASE_URL}/api/non-existent`);
    assert.equal(unknownApiRes.status, 404, 'Expected unknown /api route to return 404');
    console.log('✓ GET /api/non-existent -> 404 NOT_FOUND');

    // 10. SPA HTML fallback -> 200
    const spaRes = await fetch(`${BASE_URL}/`);
    assert.equal(spaRes.status, 200, 'Expected SPA index fallback to return 200');
    const spaHtml = await spaRes.text();
    assert.ok(spaHtml.includes('<div id="root"></div>'), 'Expected index.html root div');
    console.log('✓ GET / (SPA Fallback) -> 200 HTML');

    console.log('\nAll TV1 integration & authentication checks passed!');
  } finally {
    serverProcess.kill();
  }
}

runIntegrationChecks().catch((err) => {
  console.error('Integration check failed:', err);
  process.exit(1);
});
