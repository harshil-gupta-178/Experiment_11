const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
};

function generateETag(contentBuffer) {
    return '"' + crypto.createHash('md5').update(contentBuffer).digest('hex') + '"';
}

function requestHandler(req, res) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname === '/api/audit') {
        const auditData = {
            timestamp: new Date().toISOString(),
            metrics: {
                unoptimized: {
                    cssFiles: 3,
                    jsFiles: 3,
                    eagerImages: 9,
                    cachingPolicy: 'no-store, no-cache',
                    compression: 'None',
                    totalCssBytes: 7220,
                    totalJsBytes: 5718
                },
                optimized: {
                    cssFiles: 1,
                    jsFiles: 1,
                    lazyImages: 8,
                    eagerImages: 1,
                    cachingPolicy: 'public, max-age=31536000, immutable',
                    compression: 'Gzip',
                    totalCssBytes: 5525,
                    totalJsBytes: 4498,
                    cssSavingsPercent: '23.5%',
                    jsSavingsPercent: '21.3%',
                    overallBundleSavings: '22.5%'
                }
            }
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(auditData, null, 2));
        return;
    }

    if (pathname.endsWith('/')) {
        pathname += 'index.html';
    } else if (pathname === '') {
        pathname = '/index.html';
    }

    let filePath = path.join(PUBLIC_DIR, pathname);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>404 Not Found</h1><p>The path <code>${pathname}</code> was not found.</p><p><a href="/">Return to Performance Hub</a></p>`);
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileStat = fs.statSync(filePath);
    const fileContent = fs.readFileSync(filePath);

    const isOptimizedRoute = pathname.startsWith('/optimized/');
    const isUnoptimizedRoute = pathname.startsWith('/unoptimized/');

    const headers = {
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff'
    };

    if (isOptimizedRoute) {
        const etag = generateETag(fileContent);
        headers['ETag'] = etag;
        headers['Last-Modified'] = fileStat.mtime.toUTCString();

        if (ext === '.html') {
            headers['Cache-Control'] = 'no-cache, must-revalidate';
        } else {
            headers['Cache-Control'] = 'public, max-age=31536000, immutable';
        }

        const ifNoneMatch = req.headers['if-none-match'];
        const ifModifiedSince = req.headers['if-modified-since'];

        if (ifNoneMatch && ifNoneMatch === etag) {
            res.writeHead(304, headers);
            res.end();
            return;
        }

        if (ifModifiedSince) {
            const ifModifiedDate = new Date(ifModifiedSince);
            if (!isNaN(ifModifiedDate.getTime()) && fileStat.mtime <= ifModifiedDate) {
                res.writeHead(304, headers);
                res.end();
                return;
            }
        }

        const acceptEncoding = req.headers['accept-encoding'] || '';
        const isCompressible = contentType.startsWith('text/') || 
                               contentType.includes('javascript') || 
                               contentType.includes('json') || 
                               contentType.includes('svg');

        if (isCompressible && acceptEncoding.includes('gzip')) {
            headers['Content-Encoding'] = 'gzip';
            headers['Vary'] = 'Accept-Encoding';
            zlib.gzip(fileContent, (err, compressedBuffer) => {
                if (err) {
                    headers['Content-Length'] = fileContent.length;
                    res.writeHead(200, headers);
                    res.end(fileContent);
                } else {
                    headers['Content-Length'] = compressedBuffer.length;
                    res.writeHead(200, headers);
                    res.end(compressedBuffer);
                }
            });
            return;
        }

    } else if (isUnoptimizedRoute) {
        headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
        headers['Pragma'] = 'no-cache';
        headers['Expires'] = '0';
    } else {
        headers['Cache-Control'] = 'no-cache';
    }

    headers['Content-Length'] = fileContent.length;
    res.writeHead(200, headers);
    res.end(fileContent);
}

function startServer(port) {
    const srv = http.createServer(requestHandler);
    srv.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log(`- Performance Hub: http://localhost:${port}/`);
        console.log(`- Unoptimized:    http://localhost:${port}/unoptimized/`);
        console.log(`- Optimized:      http://localhost:${port}/optimized/`);
        console.log(`- Audit API:      http://localhost:${port}/api/audit`);
    });

    srv.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            const nextPort = port === 3000 ? 3001 : (port === 3001 ? 8080 : port + 1);
            startServer(nextPort);
        } else {
            console.error('Server error:', err);
        }
    });
}

startServer(DEFAULT_PORT);
