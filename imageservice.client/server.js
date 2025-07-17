// server.js
import express from 'express';
import path from 'path';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 8080;

// 1. 静态文件
app.use(express.static(path.join(process.cwd(), 'public')));

// 2. /token 端点：在容器内请求 Metadata Server
app.get('/token', async (req, res) => {
  try {
    const audience = req.query.audience;
    if (!audience) return res.status(400).send('Missing audience');

    const metadataUrl = `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=${encodeURIComponent(audience)}`;
    const tokenRes = await fetch(metadataUrl, {
      headers: { 'Metadata-Flavor': 'Google' }
    });
    if (!tokenRes.ok) {
      return res.status(502).send(`Meta fetch failed: ${tokenRes.status}`);
    }
    const idToken = await tokenRes.text();
    res.set('Cache-Control', 'no-store').send(idToken);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

// 3. SPA deep‑link fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🟢 Server listening on port ${PORT}`);
});
