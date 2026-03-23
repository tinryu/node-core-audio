const fetch = globalThis.fetch;
(async () => {
    try {
        const response = await fetch('https://example.com');
        console.log('response.body type:', typeof response.body);
        console.log('response.body.pipe:', typeof response.body.pipe);
    } catch (e) {
        console.error(e);
    }
})();
