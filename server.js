const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  // Parse URL to discard query parameters/hashes
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname;

  // Redirect requests ending in .html to clean pretty URLs
  if (pathname.endsWith('.html')) {
    let cleanPath = pathname.slice(0, -5);
    if (cleanPath === '/index') {
      cleanPath = '/';
    }
    const search = parsedUrl.search || '';
    res.writeHead(301, { 'Location': cleanPath + search });
    res.end();
    return;
  }
  
  // Default to index.html for root path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  let filePath = path.join(__dirname, pathname);
  
  // Security check: Prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Forbidden');
    return;
  }

  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // If file not found, check if it's a subpage route without extension (e.g. /about)
        if (!extname) {
          const possibleHtmlFile = filePath + '.html';
          fs.readFile(possibleHtmlFile, (htmlErr, htmlContent) => {
            if (!htmlErr) {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(htmlContent);
            } else {
              // Redirect/fallback to index.html
              fs.readFile(path.join(__dirname, 'index.html'), (indexErr, indexContent) => {
                if (!indexErr) {
                  res.writeHead(200, { 'Content-Type': 'text/html' });
                  res.end(indexContent);
                } else {
                  res.writeHead(404, { 'Content-Type': 'text/plain' });
                  res.end('404 Not Found');
                }
              });
            }
          });
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        }
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
