const renderProductPage = require('./product-page');

function setProductCacheHeaders(res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800');
  res.setHeader('CDN-Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
  res.setHeader('Vercel-CDN-Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
}

module.exports = async function productCached(req, res) {
  const chunks = [];
  const headers = [];
  const capture = {
    statusCode: 200,
    setHeader(name, value) {
      headers.push([name, value]);
    },
    end(value) {
      chunks.push(Buffer.isBuffer(value) ? value.toString('utf8') : String(value || ''));
    }
  };

  await renderProductPage(req, capture);

  for (const [name, value] of headers) {
    res.setHeader(name, value);
  }
  setProductCacheHeaders(res);

  res.statusCode = capture.statusCode || 200;
  res.end(chunks.join(''));
};
