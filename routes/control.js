const express = require('express');
const router = express.Router();
const db = require('../db');

// GET status kontrol aktuator (ESP32 ambil data)
// router.get('/', async (req, res) => {
//   const [rows] = await db.query('SELECT * FROM device_status WHERE id = 1');
//   res.json(rows[0]);
// });

// POST untuk update kontrol (mode, pompa, fan)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM device_status WHERE id = 1');
    const data = rows[0];
    res.json({
      mode: data.mode,
      pump: data.pump_status === 1,
      fan: data.fan_status === 1,
    });
  } catch (err) {
    console.error('[DB] Failed to get control status:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST untuk update kontrol (dari React)
router.post('/', async (req, res) => {
  const { mode, pump, fan } = req.body;

  try {
    await db.query('UPDATE device_status SET mode = ?, pump_status = ?, fan_status = ? WHERE id = 1', [mode, pump ? 1 : 0, fan ? 1 : 0]);

    res.json({ success: true });
  } catch (err) {
    console.error('[DB] Gagal update control status:', err);
    res.status(500).json({ error: 'Gagal update status' });
  }
});

module.exports = router;
