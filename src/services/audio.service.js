const ytdlp = require('yt-dlp-exec');
const cache = require('../utils/cache');

exports.getAudioUrl = async (videoId) => {
  if (cache.has(videoId)) {
    return cache.get(videoId);
  }

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const url = await ytdlp(youtubeUrl, {
    format: 'bestaudio',
    getUrl: true
  });

  const cleanUrl = url.trim();

  cache.set(videoId, cleanUrl);

  return cleanUrl;
};