const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = __dirname;
const dataDir = path.join(root, 'data');
const ordersFile = path.join(dataDir, 'orders.jsonl');
const port = process.env.PORT || 8787;

const mime = {
  '.html':'text/html; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.webp':'image/webp', '.mp4':'video/mp4', '.svg':'image/svg+xml', '.txt':'text/plain; charset=utf-8'
};

function send(res, status, body, type='application/json; charset=utf-8'){
  res.writeHead(status, {'Content-Type': type, 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'Content-Type', 'Access-Control-Allow-Methods':'POST, OPTIONS'});
  res.end(type.includes('json') ? JSON.stringify(body) : body);
}
function clean(s){ return String(s || '').replace(/[<>]/g,'').trim().slice(0, 1200); }
function validate(payload){
  const items = Array.isArray(payload.items) ? payload.items.map(i=>({ name: clean(i.name).slice(0,160), qty: Math.max(1, Math.min(99, Number(i.qty)||1)) })).filter(i=>i.name) : [];
  const name = clean(payload.name).slice(0,120);
  const contact = clean(payload.contact).slice(0,180);
  const notes = clean(payload.notes).slice(0,1200);
  const errors = [];
  if(!items.length) errors.push('Add at least one product.');
  if(!name) errors.push('Name is required.');
  if(!contact) errors.push('Email or phone is required.');
  return { ok: !errors.length, errors, order: { name, contact, notes, items, createdAt: new Date().toISOString() } };
}
function readJson(req){ return new Promise((resolve,reject)=>{ let data=''; req.on('data',chunk=>{ data += chunk; if(data.length > 1e6){ req.destroy(); reject(new Error('Payload too large')); }}); req.on('end',()=>{ try{ resolve(data ? JSON.parse(data) : {}); } catch(e){ reject(e); } }); req.on('error', reject); }); }

const server = http.createServer(async (req,res)=>{
  if(req.method === 'OPTIONS') return send(res, 204, {});
  const url = new URL(req.url, `http://${req.headers.host}`);
  if(req.method === 'POST' && url.pathname === '/api/order-enquiry'){
    try{
      const payload = await readJson(req);
      const result = validate(payload);
      if(!result.ok) return send(res, 400, { ok:false, errors: result.errors });
      fs.mkdirSync(dataDir, { recursive:true });
      const orderId = 'KWAAI-' + crypto.randomBytes(4).toString('hex').toUpperCase();
      const record = { orderId, ...result.order, userAgent: req.headers['user-agent'] || '' };
      fs.appendFileSync(ordersFile, JSON.stringify(record) + '\n');
      return send(res, 200, { ok:true, orderId, message:'Order enquiry saved.' });
    }catch(err){ return send(res, 500, { ok:false, error:'Could not process order enquiry.' }); }
  }
  let filePath = path.join(root, url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname));
  if(!filePath.startsWith(root)) return send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
  fs.stat(filePath, (err, stat)=>{
    if(err || !stat.isFile()) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    res.writeHead(200, {'Content-Type': mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream'});
    fs.createReadStream(filePath).pipe(res);
  });
});
server.listen(port, ()=> console.log(`KWAAI Coffee REV22 running at http://localhost:${port}`));
