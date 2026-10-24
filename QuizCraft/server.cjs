// A small development server using only Node built-in modules. No npm install needed.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, 'dist');
const portIndex = process.argv.indexOf('--port');
const port = Number(process.env.PORT || (portIndex >= 0 ? process.argv[portIndex + 1] : 5173)) || 5173;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.pdf':'application/pdf','.txt':'text/plain; charset=utf-8'};
const server = http.createServer((req,res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); }
  catch (_) { res.writeHead(400); res.end('Invalid URL'); return; }
  const file = path.resolve(root,'.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(file,(error,data) => {
    if(error){res.writeHead(404,{'Content-Type':'text/plain'});res.end('File not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(data);
  });
});
server.on('error',error => {console.error('Server could not start: ' + error.message);if(error.code === 'EADDRINUSE') console.error('Close the existing server or choose another PORT.');process.exitCode=1;});
server.listen(port,'0.0.0.0',() => console.log('QuizCraft is ready at http://localhost:' + port + '\nPress Ctrl+C to stop.'));
