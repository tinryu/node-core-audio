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
  const { videoId } = req.query;
  console.log(`[BACKEND] GET /api/audio/stream?videoId=${videoId}`);
  
  try {
    if (!videoId) {
      console.warn('[BACKEND] MISSING VideoId');
      return res.status(400).json({ error: 'videoId is required' });
    }

    const url = await service.getAudioUrl(videoId);
    console.log(`[BACKEND] Upstream URL Obtained for ${videoId}`);
    
    const range = req.headers.range;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    if (range) {
      console.log(`[BACKEND] Range Requested: ${range}`);
      headers['Range'] = range;
    }

    const response = await axios.get(url, { responseType: 'stream', headers });
    console.log(`[BACKEND] Upstream Connection Status: ${response.status}`);

    res.status(response.status);

    // Filter and set headers from upstream
    ['content-type', 'content-length', 'accept-ranges', 'content-range'].forEach(h => {
      if (response.headers[h]) {
        res.setHeader(h, response.headers[h]);
      }
    });

    response.data.pipe(res);

    response.data.on('error', (err) => {
      console.error(`[BACKEND] Stream Source Data Error (${videoId}):`, err.message);
    });

    res.on('finish', () => {
      console.log(`[BACKEND] Stream Finished (${videoId})`);
    });

    res.on('close', () => {
      console.log(`[BACKEND] Stream Closed (${videoId})`);
    });
  } catch (e) {
    console.error(`[BACKEND] Streaming Error (${videoId}):`, e.message);
    if (!res.headersSent) {
      res.status(500).json({ error: e.message });
    }
  }
};
