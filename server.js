const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url).pathname;
    const filePath = path.join(__dirname, 'src', parsedUrl === '/' ? 'index.html' : parsedUrl);
    const ext = path.extname(filePath);

    const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.json': 'application/json'
    }[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end('<h1>404 — Página no encontrada</h1>')
            }
            res.writeHead(500);
            return res.end('Error interno del servidor');
        }

        res.writeHead(200, { 'Content-Type': contentType});
        res.end(content);
    });
});

server.listen(3000, 'localhost', () => {
    console.log('Servidor corriendo en ➜ http://localhost:3000');
});

// Detectar entrada de texto desde la consola
process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const command = input.trim();

  if (command === "stop") {
    console.log("Deteniendo servidor...");
    server.close(() => {
      console.log("Servidor detenido");
      process.exit(0);
    });
  }
});