const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtube.controller');

router.get('/', youtubeController.searchVideos);

module.exports = router;
