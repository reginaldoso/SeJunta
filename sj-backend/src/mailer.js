const nodemailer = require('nodemailer');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@sejunta.local';

let transporter = null;
if (SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT ? parseInt(SMTP_PORT, 10) : 587,
    secure: false,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
}

async function sendVerificationEmail(to, token) {
  const verifyUrl = `${process.env.APP_BASE_URL || 'http://localhost:3000'}/users/verify/${token}`;
  const subject = 'SeJunta — Confirme seu e-mail';
  const text = `Olá! Confirme seu e-mail clicando no link: ${verifyUrl}`;

  if (!transporter) {
    console.log('No SMTP configured — verification link:', verifyUrl);
    return;
  }

  await transporter.sendMail({ from: FROM_EMAIL, to, subject, text });
}

module.exports = { sendVerificationEmail };
