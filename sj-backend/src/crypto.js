const crypto = require('crypto');

const ALGO = 'aes-256-gcm';
const KEY = process.env.ENC_KEY || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'; // 32 bytes (dev)

function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const key = Buffer.from(KEY, 'utf8');
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(String(text), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]); // store as BYTEA
}

function decrypt(buf) {
  const key = Buffer.from(KEY, 'utf8');
  const iv = buf.slice(0, 12);
  const tag = buf.slice(12, 28);
  const encrypted = buf.slice(28);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return out.toString('utf8');
}

module.exports = { encrypt, decrypt };
