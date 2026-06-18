exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ ok:false, error:'Method not allowed' }) };
  try {
    const payload = JSON.parse(event.body || '{}');
    const clean = (value, max=1200) => String(value || '').replace(/[<>]/g, '').trim().slice(0, max);
    const items = Array.isArray(payload.items) ? payload.items.map(item => ({ name: clean(item.name,160), qty: Math.max(1, Math.min(99, Number(item.qty) || 1)) })).filter(item => item.name) : [];
    const name = clean(payload.name,120);
    const contact = clean(payload.contact,180);
    const notes = clean(payload.notes,1200);
    const errors = [];
    if (!items.length) errors.push('Add at least one product.');
    if (!name) errors.push('Name is required.');
    if (!contact) errors.push('Email or phone is required.');
    if (errors.length) return { statusCode: 400, headers, body: JSON.stringify({ ok:false, errors }) };
    const orderId = 'KWAAI-' + Math.random().toString(16).slice(2,10).toUpperCase();
    return { statusCode: 200, headers, body: JSON.stringify({ ok:true, orderId, message:'Order enquiry received by serverless backend.', order:{ name, contact, notes, items, createdAt:new Date().toISOString() } }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok:false, error:'Could not process order enquiry.' }) };
  }
};
