const ytdlp = require('yt-dlp-exec');
const cache = require('../utils/cache');

exports.getDownloadInfo = async (videoId, format = 'bestaudio') => {
    const cacheKey = `dl_info_${videoId}_${format}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    const info = await ytdlp(youtubeUrl, {
        format: format,
        dumpSingleJson: true,
        noPlaylist: true,
        noWarnings: true,
        noCheckCertificate: true,
    });

    cache.set(cacheKey, info);
    return info;
};

// Legacy support
exports.getVideoInfo = async (videoId) => {
    return exports.getDownloadInfo(videoId);
};

exports.getDownloadUrl = async (videoId, format = 'bestaudio') => {
    const info = await exports.getDownloadInfo(videoId, format);
    return info.url;
};
