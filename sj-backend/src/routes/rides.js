const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');
const { geocodeAddress } = require('../services/geocode');

// Publish a ride
router.post('/', auth, async (req, res) => {
  try {
    const { start_address, end_address, seats } = req.body;
    if (!start_address || !end_address) return res.status(400).json({ error: 'start_address and end_address required' });

    // geocode
    const s = await geocodeAddress(start_address);
    const e = await geocodeAddress(end_address);

    if (!s || !e) {
      // If geocoding failed, still allow saving addresses without geometry
      const q = await db.query('INSERT INTO "Rides"(driver_id,start_address,end_address,seats) VALUES($1,$2,$3,$4) RETURNING *', [req.user.sub, start_address, end_address, seats || 1]);
      return res.status(201).json(q.rows[0]);
    }

    // Insert with PostGIS points (lon, lat)
    const insertSql = `INSERT INTO "Rides"(driver_id,start_address,end_address,start_location,end_location,seats) VALUES($1,$2,$3,ST_SetSRID(ST_MakePoint($4,$5),4326),ST_SetSRID(ST_MakePoint($6,$7),4326),$8) RETURNING *`;
    const q = await db.query(insertSql, [req.user.sub, start_address, end_address, s.lng, s.lat, e.lng, e.lat, seats || 1]);
    res.status(201).json(q.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

module.exports = router;
