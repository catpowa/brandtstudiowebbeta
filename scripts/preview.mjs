import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('public');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.ttf':'font/ttf','.txt':'text/plain'};
http.createServer(async(req,res)=>{
 const route=new URL(req.url,'http://localhost').pathname;
 if(route==='/api/contact'){res.writeHead(503,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({ok:false,code:'NOT_CONFIGURED'}));return;}
 let file;try{file=path.resolve(root,'.'+decodeURIComponent(route==='/'?'/index.html':route));}catch{res.writeHead(400).end();return;}
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 try{const bytes=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(bytes);}catch{res.writeHead(404).end('Not found');}
}).listen(8767,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:8767'));
