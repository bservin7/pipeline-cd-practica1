const express = require('express');
const { Pool } = require('pg');
const { UnleashClient } = require('unleash-client');

const PORT = process.env.PORT || 3000;
const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@postgres:5432/postgres'
});

// Unleash client
const unleash = new UnleashClient({
  url: process.env.UNLEASH_URL || 'http://unleash:4242/api',
  appName: 'ms-ejemplo',
  instanceId: 'instance-1',
  refreshInterval: 10
});
unleash.start();

app.get('/health', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.get('/items', async (req, res) => {
  try {
    const r = await pool.query('SELECT id, name FROM items LIMIT 100');
    res.json({ items: r.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint que usa feature flag
app.get('/feature', (req, res) => {
  const enabled = unleash.isEnabled('demo-feature', { userId: 'test-user' });
  res.json({ feature: 'demo-feature', enabled });
});

app.listen(PORT, () => console.log(`ms-ejemplo listening on ${PORT}`));
