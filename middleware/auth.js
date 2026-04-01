module.exports = (req, res, next) => {
    // Check both header and query param because browser can't send headers easily on download
    const apiKey = req.headers['x-api-key'] || req.query.key;

    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};