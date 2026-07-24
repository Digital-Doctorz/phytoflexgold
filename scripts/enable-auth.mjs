import https from 'https';
import { readFileSync } from 'fs';
import jwt from 'jsonwebtoken';

const envContent = readFileSync('.env.local', 'utf-8');
const match = envContent.match(/FIREBASE_SERVICE_ACCOUNT_KEY=(.+)/);
const sa = JSON.parse(match[1]);

const now = Math.floor(Date.now() / 1000);
const claim = {
  iss: sa.client_email,
  scope: 'https://www.googleapis.com/auth/cloud-platform',
  aud: 'https://oauth2.googleapis.com/token',
  iat: now,
  exp: now + 3600,
};

const signedJwt = jwt.sign(claim, sa.private_key, { algorithm: 'RS256' });
const tokenData = 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + signedJwt;

function apiCall(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  const tokenRes = await apiCall({
    hostname: 'oauth2.googleapis.com',
    path: '/token',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }, tokenData);

  const parsed = JSON.parse(tokenRes.body);
  const accessToken = parsed.access_token || parsed.id_token;
  if (!accessToken) {
    console.log('Failed to get token:', tokenRes.body);
    return;
  }
  console.log('Got token (type:', parsed.access_token ? 'access' : 'id', ')');

  const projectId = sa.project_id;

  // Try all possible API endpoints
  const endpoints = [
    { host: 'identitytoolkit.googleapis.com', path: `/v1/projects/${projectId}/config`, label: 'v1 config' },
    { host: 'identitytoolkit.googleapis.com', path: `/v1/projects/${projectId}/defaultConfig`, label: 'v1 defaultConfig' },
    { host: 'identityplatform.googleapis.com', path: `/v1/projects/${projectId}/config`, label: 'platform v1 config' },
    { host: 'identityplatform.googleapis.com', path: `/v1beta1/projects/${projectId}/config`, label: 'platform v1beta1 config' },
  ];

  for (const ep of endpoints) {
    console.log(`\nTrying: ${ep.label} (${ep.host}${ep.path})`);
    const res = await apiCall({
      hostname: ep.host,
      path: ep.path,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + accessToken }
    });
    console.log(`  Status: ${res.status}`);
    if (res.status === 200) {
      try {
        const config = JSON.parse(res.body);
        console.log('  Keys:', Object.keys(config).join(', '));
        if (config.signIn) console.log('  signIn:', JSON.stringify(config.signIn).substring(0, 300));
      } catch {
        console.log('  Body:', res.body.substring(0, 300));
      }
    } else {
      console.log('  Error:', res.body.substring(0, 150));
    }
  }
}

main().catch(console.error);
