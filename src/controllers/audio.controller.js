const service = require('../services/audio.service');
const axios = require('axios');


exports.getAudio = async (req, res) => {
  try {
    const { videoId } = req.query;
    if (!videoId) {
        return res.status(400).json({ error: 'videoId is required' });
    }
    const url = await service.getAudioUrl(videoId);
    res.json({ url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


exports.stream = async (req, res) => {
  try {
    const { videoId } = req.query;
    if (!videoId) {
        return res.status(400).send('videoId is required');
    }

    const url = await service.getAudioUrl(videoId);

    const response = await axios.get(url, { responseType: 'stream' });

    res.setHeader('Content-Type', 'audio/mpeg');
    response.data.pipe(res);

  } catch (e) {
    console.error('Streaming error:', e.message);
    res.status(500).send(e.message);
  }
};