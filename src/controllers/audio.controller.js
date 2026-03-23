const service = require('../services/audio.service');

exports.getAudio = async (req, res) => {
  try {
    const { videoId } = req.query;
    const url = await service.getAudioUrl(videoId);
    res.json({ url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};