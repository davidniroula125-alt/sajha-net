const express = require('express');
const router = express.Router();
const crypto = require('crypto');

router.get('/', (req, res) => {
  const size = parseInt(req.query.size) || 10;
  const clamped = Math.min(Math.max(size, 1), 50);
  const buffer = crypto.randomBytes(clamped * 1024 * 1024);
  res.set({
    'Content-Type': 'application/octet-stream',
    'Content-Length': buffer.length,
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  res.send(buffer);
});

module.exports = router;
