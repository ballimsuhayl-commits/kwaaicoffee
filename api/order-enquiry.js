const crypto = require('crypto');

function clean(value, limit = 1200) {
  return String(value || '').replace(/[<>]/g, '').trim().slice(0, limit);
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.end(JSON.stringify(body));
}

function readJson(req) {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }

  if (typeof req.body === 'string' && req.body.trim()) {
    return Promise.resolve(JSON.parse(req.body));
  }

  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1000000) {
        reject(new Error('Payload too large'));
      }
    });

    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

function validate(payload) {
  const items = Array.isArray(payload.items)
    ? payload.items
        .map((item) => ({
          name: clean(item.name, 160),
          qty: Math.max(1, Math.min(99, Number(item.qty) || 1))
        }))
        .filter((item) => item.name)
    : [];

  const name = clean(payload.name, 120);
  const contact = clean(payload.contact, 180);
  const notes = clean(payload.notes, 1200);
  const errors = [];

  if (!items.length) errors.push('Add at least one product.');
  if (!name) errors.push('Name is required.');
  if (!contact) errors.push('Email or phone is required.');

  return {
    ok: errors.length === 0,
    errors,
    order: { name, contact, notes, items, createdAt: new Date().toISOString() }
  };
}

module.exports = async function orderEnquiry(req, res) {
  if (req.method === 'OPTIONS') {
    return send(res, 204, {});
  }

  if (req.method !== 'POST') {
    return send(res, 405, { ok: false, error: 'Method not allowed.' });
  }

  try {
    const payload = await readJson(req);
    const result = validate(payload);

    if (!result.ok) {
      return send(res, 400, { ok: false, errors: result.errors });
    }

    const orderId = 'KWAAI-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const record = {
      orderId,
      ...result.order,
      source: 'vercel',
      userAgent: req.headers['user-agent'] || ''
    };

    console.log('KWAAI order enquiry', JSON.stringify(record));

    return send(res, 200, {
      ok: true,
      orderId,
      message: 'Order enquiry received.'
    });
  } catch (error) {
    console.error('KWAAI order enquiry failed', error);
    return send(res, 500, { ok: false, error: 'Could not process order enquiry.' });
  }
};
