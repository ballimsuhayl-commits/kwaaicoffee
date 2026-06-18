const renderSite = require('./site');

module.exports = async function sitePublic(req, res) {
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

  await renderSite(req, capture);

  for (const [name, value] of headers) {
    res.setHeader(name, value);
  }

  res.statusCode = capture.statusCode || 200;
  const body = chunks.join('').replace(
    "replace(/s+/g, ' ')",
    "replace(new RegExp('\\\\s+', 'g'), ' ')"
  );

  res.end(body);
};
