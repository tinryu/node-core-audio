const router = require('express').Router();
const controller = require('../controllers/audio.controller');

router.get('/', controller.getAudio);

module.exports = router;