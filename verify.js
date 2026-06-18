const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const refs = [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map(m => m[1]);
const missing = refs.filter(ref => !fs.existsSync(path.join(__dirname, '..', ref)));
if (missing.length) { console.error('Missing assets:', missing); process.exit(1); }
require('vm').Script;
console.log(`OK: ${refs.length} asset references checked.`);
