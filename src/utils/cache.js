const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 14400 }); // 4 hours

if (process.env.NODE_ENV === 'development') {
    cache.flushAll();
    console.log('Cache cleared for development mode');
}

module.exports = cache;