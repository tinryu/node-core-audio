const express = require('express');
const cors = require('cors');
const youtubeRoutes = require('./routes/youtube.routes');
const audioRoutes = require('./routes/audio.routes');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // max 30 requests per IP
  message: 'Too many requests'
});

const app = express();

app.use(limiter);
app.use(cors());
app.use(express.json());

app.use('/api', auth);
app.use('/api/youtube', rateLimit({
  windowMs: 60 * 1000,
  max: 50, // 50 searches per minute
  message: 'Too many requests'
}), youtubeRoutes);
app.use('/api/audio', audioRoutes);


module.exports = app;
