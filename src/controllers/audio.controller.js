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
        return res.status(400).json({ error: 'videoId is required' });
    }

    const url = await service.getAudioUrl(videoId);
    
    const range = req.headers.range;
    const headers = {
      'User-Agent': 'Mozilla/5.0',
    };

    if (range) {
      headers['Range'] = range;
    }
    const response = await axios.get(url, { responseType: 'stream', headers });

    res.status(response.status);

    res.setHeader(
      'Content-Type',
      response.headers.get('content-type') || 'audio/mpeg'
    );

    res.setHeader(
      'Content-Length',
      response.headers.get('content-length') || ''
    );

    res.setHeader(
      'Accept-Ranges',
      response.headers.get('accept-ranges') || 'bytes'
    );

    res.setHeader(
      'Content-Range',
      response.headers.get('content-range') || ''
    );

    response.data.pipe(res);

    response.data.on('error', (err) => {
      console.error('Stream error:', err);
    });

    res.on('finish', () => {
      console.log('Stream finished');
    });

    res.on('close', () => {
      console.log('Stream closed');
    });
  } catch (e) {
    console.error('Streaming error:', e.message);
    res.status(500).json({ error: e.message });
  }
};
