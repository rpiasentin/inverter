// Basic polling script for inverter API
// Polls /api/status and /api/config with optional Basic authentication

const user = process.env.INVERTER_USER || '';
const pass = process.env.INVERTER_PASS || '';

const headers = {};
if (user || pass) {
  const token = Buffer.from(`${user}:${pass}`).toString('base64');
  headers['Authorization'] = `Basic ${token}`;
}

async function fetchStatus() {
  const res = await fetch('/api/status', { headers });
  return res.json();
}

async function fetchConfig() {
  const res = await fetch('/api/config', { headers });
  return res.json();
}

module.exports = { fetchStatus, fetchConfig };
