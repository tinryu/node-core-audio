const axios = require('axios');

exports.search = async (query) => {
  const url = 'https://www.googleapis.com/youtube/v3/search';

  const res = await axios.get(url, {
    params: {
      part: 'snippet',
      q: query,
      type: 'video',
      key: process.env.YOUTUBE_API_KEY
    }
  });

  return res.data.items;
};