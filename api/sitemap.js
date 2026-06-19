const { PUBLIC_URL, PRODUCTS, productUrl } = require('./catalog');

const STATIC_PATHS = ['/', '/shop', '/checkout', '/contacts'];

function sitemapUrl(path, priority) {
  const loc = path.startsWith('http') ? path : `${PUBLIC_URL}${path}`;
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    `    <priority>${priority}</priority>`,
    '  </url>'
  ].join('\n');
}

module.exports = function sitemap(req, res) {
  const urls = [
    ...STATIC_PATHS.map((path, index) => sitemapUrl(path, index === 0 ? '1.0' : '0.8')),
    ...PRODUCTS.map((product) => sitemapUrl(productUrl(product), '0.9'))
  ];

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
};
