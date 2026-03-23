const router = require('express').Router();
const controller = require('../controllers/audio.controller');

router.get('/', controller.getAudio);
router.get('/stream', controller.stream);

module.exports = router;