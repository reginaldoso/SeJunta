const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/users', require('./routes/users'));
app.use('/profile', require('./routes/profile'));
app.use('/rides', require('./routes/rides'));

module.exports = app;
