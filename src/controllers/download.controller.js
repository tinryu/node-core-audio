const service = require('../services/download.service');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

exports.download = async (req, res) => {
    const { v, format, title: clientTitle } = req.query; // videoId and optional title
    console.log(`[BACKEND] GET /api/download?v=${v}&format=${format}&title=${clientTitle}`);
    
    try {
        if (!v) {
            return res.status(400).json({ error: 'v is required (video id)' });
        }

        // 1. Determine extensions and paths
        const extension = format === 'video' ? 'mp4' : 'mp3';
        const subDir = format === 'video' ? 'video' : 'audio';
        const filePath = path.join(process.cwd(), 'downloads', subDir, `${v}.${extension}`);

        // 2. CHECK IF FILE ALREADY EXISTS (Ultra-fast path)
        if (fs.existsSync(filePath)) {
            console.log(`[BACKEND] Serving from local storage for ${v}`);
            const stat = fs.statSync(filePath);
            
            // Use client-provided title or fallback to id
            const title = clientTitle || v;
            const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
            const fileName = `${safeTitle}.${extension}`;

            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Type', format === 'video' ? 'video/mp4' : 'audio/mpeg');
            res.setHeader('Content-Length', stat.size);
            
            return fs.createReadStream(filePath).pipe(res);
        }

        // 3. FETCH METADATA & URL (Fast path, single yt-dlp call)
        let ytdlpFormat = 'bestaudio';
        if (format === 'video') {
            ytdlpFormat = 'bestvideo+bestaudio/best';
        }

        const info = await service.getDownloadInfo(v, ytdlpFormat);
        const title = clientTitle || info.title || v;
        const url = info.url;
        
        console.log(`[BACKEND] Upstream URL Obtained for ${v} (${title})`);

        // 4. PREPARE DOWNLOAD
        const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${safeTitle}.${extension}`;
        const response = await axios.get(url, { responseType: 'stream' });

        // Ensure directories exist
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        const fileStream = fs.createWriteStream(filePath);

        // Set attachment headers
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        ['content-type', 'content-length'].forEach(h => {
            if (response.headers[h]) {
                res.setHeader(h, response.headers[h]);
            }
        });

        // Direct pipe to response (to client) + pipe to file (for caching)
        response.data.pipe(res);
        response.data.pipe(fileStream);

        // Error handlers
        response.data.on('error', (err) => {
            console.error(`[BACKEND] Source Stream Error (${v}):`, err.message);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });

        fileStream.on('error', (err) => {
            console.error(`[BACKEND] File Save Error (${v}):`, err.message);
        });

        res.on('finish', () => console.log(`[BACKEND] Download Sent and Cached (${v})`));

    } catch (e) {
        console.error(`[BACKEND] Optimized Download Error (${v}):`, e.message);
        if (!res.headersSent) {
            res.status(500).json({ error: e.message });
        }
    }
};
