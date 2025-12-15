const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
const { encrypt, decrypt } = require('../crypto');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const mailer = require('../mailer');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, cpf } = req.body;
    if (!email || !email.endsWith('@ufba.br')) return res.status(400).json({ error: 'E-mail deve ser @ufba.br' });
    if (!password) return res.status(400).json({ error: 'Senha é obrigatória' });
    if (!cpf) return res.status(400).json({ error: 'CPF é obrigatório' });

    // check existing
    const existing = await db.query('SELECT id FROM "Users" WHERE email=$1', [email]);
    if (existing.rows.length) return res.status(409).json({ error: 'E-mail já cadastrado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const cpfEnc = encrypt(cpf);

    const verifyToken = randomUUID();
    const userRes = await db.query('INSERT INTO "Users"(name,email,cpf,verify_token) VALUES($1,$2,$3,$4) RETURNING id,email,name', [name, email, cpfEnc, verifyToken]);
    const user = userRes.rows[0];

    await db.query('INSERT INTO "User_Credentials"(user_id,password_hash) VALUES($1,$2)', [user.id, passwordHash]);

    // send verification email (will log if SMTP not configured)
    mailer.sendVerificationEmail(email, verifyToken).catch((e) => console.error('Mailer error', e));

    res.status(201).json({ id: user.id, email: user.email, name: user.name, verificationSent: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Email verification endpoint
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const q = await db.query('SELECT id FROM "Users" WHERE verify_token=$1', [token]);
    if (!q.rows.length) return res.status(404).send('Token inválido');
    const userId = q.rows[0].id;
    await db.query('UPDATE "Users" SET verified=true, verify_token=NULL WHERE id=$1', [userId]);
    res.send('E-mail verificado com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro interno');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

    const q = await db.query('SELECT u.id,u.name,u.email,uc.password_hash FROM "Users" u JOIN "User_Credentials" uc ON uc.user_id=u.id WHERE u.email=$1', [email]);
    if (!q.rows.length) return res.status(401).json({ error: 'Credenciais inválidas' });

    const user = q.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ sub: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

module.exports = router;
