const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');
const { encrypt } = require('../crypto');
const multer = require('multer');
const path = require('path');

const upload = multer({ dest: path.join(__dirname, '..', '..', 'uploads') });

// Store/Update PIX key (encrypted)
router.put('/pix', auth, async (req, res) => {
  try {
    const { pix } = req.body;
    if (!pix) return res.status(400).json({ error: 'pix is required' });
    const enc = encrypt(pix);
    // upsert into User_Pix
    const q = await db.query('SELECT id FROM "User_Pix" WHERE user_id=$1', [req.user.sub]);
    if (q.rows.length) {
      await db.query('UPDATE "User_Pix" SET pix_key=$1 WHERE user_id=$2', [enc, req.user.sub]);
    } else {
      await db.query('INSERT INTO "User_Pix"(user_id,pix_key) VALUES($1,$2)', [req.user.sub, enc]);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Upload profile photo
router.post('/photo', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'file required' });
    const rel = path.relative(process.cwd(), req.file.path);
    await db.query('UPDATE "Users" SET photo_path=$1 WHERE id=$2', [rel, req.user.sub]);
    res.json({ path: rel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

module.exports = router;
