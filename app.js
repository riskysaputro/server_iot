const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
let latestSensorData = null;

const sensorRoutes = require('./routes/sensor');
const controlRoutes = require('./routes/control'); 

app.use('/api/sensor', sensorRoutes);
app.use('/api/control', controlRoutes);

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
