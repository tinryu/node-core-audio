const service = require('./src/services/audio.service');
(async () => {
    try {
        const url = await service.getAudioUrl('dQw4w9WgXcQ');
        console.log('URL:', url);
    } catch (e) {
        console.error('Error:', e);
    }
})();
