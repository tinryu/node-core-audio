const express = require('express');
const cors = require('cors');
const youtubeRoutes = require('./routes/youtube.routes');
const audioRoutes = require('./routes/audio.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/youtube', youtubeRoutes);
app.use('/api/audio', audioRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = app;
