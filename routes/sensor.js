const express = require('express');
const router = express.Router();
const db = require('../db');

// POST data dari ESP32
let latestSensorData = null;
let lastSavedTime = 0;

router.post('/', async (req, res) => {
  const { soil, air } = req.body;
  const now = Date.now();

  // Simpan ke cache
  latestSensorData = {
    soil,
    air,
    timestamp: now,
  };

  // Cek apakah sudah lewat 30 menit
  if (now - lastSavedTime >= 30 * 60 * 1000) {
    try {
      await db.query('INSERT INTO sensor_data (soil_moisture, air_quality) VALUES (?, ?)', [soil, air]);
      lastSavedTime = now;
      console.log('[DB] Data inserted at', new Date(now).toISOString());
    } catch (err) {
      console.error('[DB] Failed to insert', err);
    }
  }

  res.json({ message: 'Received' });
});

// GET semua data sensor (history)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 5');
    res.json(rows);
  } catch (err) {
    console.error('[DB] Failed to fetch history:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// router.get('/', (req, res) => {
//   res.json({ message: 'Sensor endpoint works!' });
// });
// Endpoint untuk ambil data realtime
router.get('/latest', (req, res) => {
  if (latestSensorData) {
    res.json(latestSensorData);
  } else {
    res.status(404).json({ message: 'No data yet' });
  }
});

module.exports = router;
