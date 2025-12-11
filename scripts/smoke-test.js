const fetch = require('node-fetch');

(async () => {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  try {
    const h = await fetch(`${base}/health`);
    if (h.status !== 200) throw new Error('health failed ' + h.status);
    const f = await fetch(`${base}/feature`);
    if (f.status !== 200) throw new Error('feature failed ' + f.status);
    console.log('smoke ok');
    process.exit(0);
  } catch (err) {
    console.error('smoke error', err);
    process.exit(2);
  }
})();
