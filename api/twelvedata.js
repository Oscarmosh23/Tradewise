const https = require('https');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) { res.status(500).json({ error: 'API key not configured' }); return; }

  const { endpoint, ...params } = req.query;
  const qs = Object.entries({ ...params, apikey: apiKey }).map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  const url = `https://api.twelvedata.com/${endpoint}?${qs}`;

  https.get(url, r => {
    let d = '';
    r.on('data', c => d += c);
    r.on('end', () => { res.setHeader('Content-Type','application/json'); res.status(r.statusCode).end(d); });
  }).on('error', e => res.status(500).json({ error: e.message }));
};
