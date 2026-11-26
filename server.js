const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg'
};

function startServer(port) {
    const server = http.createServer((req, res) => {
        let pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
        if (pathname === '/' || pathname === '') pathname = '/index.html';

        const filePath = path.join(ROOT_DIR, pathname);
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('404 Not Found');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const fileContent = fs.readFileSync(filePath);
        const etag = '"' + crypto.createHash('md5').update(fileContent).digest('hex') + '"';

        const headers = {
            'Content-Type': contentType,
            'X-Content-Type-Options': 'nosniff',
            'ETag': etag
        };

        if (ext === '.html') {
            headers['Cache-Control'] = 'no-cache, must-revalidate';
        } else {
            headers['Cache-Control'] = 'public, max-age=31536000, immutable';
        }

        if (req.headers['if-none-match'] === etag) {
            res.writeHead(304, headers);
            return res.end();
        }

        const acceptEncoding = req.headers['accept-encoding'] || '';
        if (acceptEncoding.includes('gzip') && (contentType.startsWith('text/') || contentType.includes('javascript') || contentType.includes('svg'))) {
            headers['Content-Encoding'] = 'gzip';
            res.writeHead(200, headers);
            return res.end(zlib.gzipSync(fileContent));
        }

        headers['Content-Length'] = fileContent.length;
        res.writeHead(200, headers);
        res.end(fileContent);
    });

    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
}

startServer(PORT);
