const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300 }); // 5 min

module.exports = cache;