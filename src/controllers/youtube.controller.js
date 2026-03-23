const youtubeService = require('../services/youtube.service');

exports.searchVideos = async (req, res) => {
  try {
    const { q } = req.query;
    const results = await youtubeService.search(q);
    res.json({ items: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
