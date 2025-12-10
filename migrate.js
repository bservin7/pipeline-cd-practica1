const { Pool } = require('pg');

(async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@postgres:5432/postgres'
  });
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);
    // Insert sample rows if empty
    const r = await client.query('SELECT count(*) FROM items');
    if (parseInt(r.rows[0].count) === 0) {
      await client.query(`INSERT INTO items (name) VALUES ('Item A'), ('Item B'), ('Item C')`);
    }
    console.log('Migration done');
  } catch (e) {
    console.error('Migration error', e);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
})();
