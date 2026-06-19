const {
  PUBLIC_URL,
  PRODUCTS,
  findProduct,
  productUrl,
  productImageUrl,
  whatsappLink
} = require('./catalog');

const PUBLIC_IMAGE = `${PUBLIC_URL}/assets/kwaai-logo-cutout.png`;

function htmlEscape(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function attr(value) {
  return htmlEscape(value);
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function socialTags(meta) {
  return [
    `<link rel="canonical" href="${attr(meta.url)}" />`,
    `<meta property="og:type" content="product" />`,
    `<meta property="og:url" content="${attr(meta.url)}" />`,
    `<meta property="og:site_name" content="KWAAI Coffee" />`,
    `<meta property="og:title" content="${attr(meta.title)}" />`,
    `<meta property="og:description" content="${attr(meta.description)}" />`,
    `<meta property="og:image" content="${attr(meta.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${attr(meta.title)}" />`,
    `<meta name="twitter:description" content="${attr(meta.description)}" />`,
    `<meta name="twitter:image" content="${attr(meta.image)}" />`
  ].join('\n');
}

function productMeta(product) {
  return {
    title: `${product.label} | ${product.format} | KWAAI Coffee`,
    description: product.description,
    url: productUrl(product),
    image: productImageUrl(product)
  };
}

function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${PUBLIC_URL}/#organization`,
    name: 'KWAAI Coffee',
    url: PUBLIC_URL,
    logo: PUBLIC_IMAGE,
    email: 'hello@kwaaicoffee.com',
    telephone: '+27 72 724 0134'
  };
}

function productStructuredData(product) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema(),
      {
        '@type': 'Product',
        '@id': `${productUrl(product)}#product`,
        name: product.label,
        brand: { '@type': 'Brand', name: 'KWAAI Coffee' },
        category: product.category,
        image: [productImageUrl(product)],
        description: product.description,
        url: productUrl(product),
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Format', value: product.format },
          { '@type': 'PropertyValue', name: 'Flavour direction', value: product.short },
          { '@type': 'PropertyValue', name: 'Best fit', value: product.bestFor }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: PUBLIC_URL },
          { '@type': 'ListItem', position: 2, name: 'Products', item: `${PUBLIC_URL}/#range` },
          { '@type': 'ListItem', position: 3, name: product.label, item: productUrl(product) }
        ]
      }
    ]
  });
}

function productOrderMessage(product) {
  return [
    `Hi KWAAI Coffee, I would like to order or enquire about ${product.label}.`,
    '',
    `Product: ${product.label}`,
    `Format: ${product.format}`,
    `Website: ${productUrl(product)}`
  ].join('\n');
}

function pageCss() {
  return `
:root{--paper:#fff7ea;--ice:#eefdfd;--ink:#211106;--brown:#3b1b09;--orange:#f04b24;--gold:#f6a400;--teal:#008d8c;--line:rgba(33,17,6,.14);--shadow:rgba(33,17,6,.14)}*{box-sizing:border-box}html{scroll-behavior:smooth;background:var(--paper)}body{margin:0;background:linear-gradient(180deg,#fff7ea 0%,#eefdfd 54%,#fff7ea 100%);color:var(--ink);font-family:Arial,Helvetica,sans-serif}a{color:inherit;text-decoration:none}img{display:block;max-width:100%}.site-header{position:sticky;top:0;z-index:20;background:rgba(255,247,234,.92);backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}.nav{max-width:1240px;margin:auto;min-height:76px;padding:0 clamp(16px,4vw,34px);display:flex;align-items:center;gap:22px}.brand{display:flex;align-items:center;gap:12px;margin-right:auto}.brand img{width:42px;height:42px;object-fit:contain}.brand strong{display:block;font-size:15px;letter-spacing:.08em}.brand small{display:block;margin-top:3px;color:var(--teal);font-size:10px;font-weight:1000;letter-spacing:.22em}.nav-links{display:flex;gap:clamp(12px,2vw,24px);align-items:center;font-size:12px;font-weight:1000;letter-spacing:.11em;text-transform:uppercase}.nav-cta,.btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;border-radius:999px;padding:0 18px;background:var(--orange);color:#fff;font-weight:1000;box-shadow:0 18px 36px rgba(240,75,36,.22)}.btn.secondary{background:#fff;color:var(--ink);border:1px solid var(--line);box-shadow:0 14px 30px rgba(33,17,6,.08)}main{overflow:hidden}.product-hero{max-width:1240px;margin:auto;padding:clamp(44px,7vw,86px) clamp(16px,4vw,34px);display:grid;grid-template-columns:minmax(0,.95fr) minmax(320px,.76fr);gap:clamp(26px,5vw,72px);align-items:center}.eyebrow{margin:0 0 16px;color:var(--teal);font-size:12px;font-weight:1000;letter-spacing:.2em;text-transform:uppercase}.product-copy h1{margin:0;font-size:clamp(56px,8vw,118px);line-height:.82;letter-spacing:-.08em;text-transform:uppercase}.lede{max-width:660px;font-size:clamp(19px,2.2vw,28px);line-height:1.16;font-weight:900;color:rgba(33,17,6,.82)}.cta-row{display:flex;flex-wrap:wrap;gap:12px;margin:28px 0}.facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:26px}.fact{padding:16px;border-radius:22px;background:rgba(255,255,255,.72);border:1px solid var(--line);box-shadow:0 18px 42px rgba(33,17,6,.07)}.fact span{display:block;margin-bottom:7px;color:var(--teal);font-size:10px;font-weight:1000;letter-spacing:.16em;text-transform:uppercase}.fact strong{font-size:14px;line-height:1.25}.product-visual{position:relative;border-radius:42px;background:linear-gradient(145deg,#fff,#dcfbfa 58%,#ffead0);border:1px solid rgba(255,255,255,.7);box-shadow:0 42px 100px rgba(33,17,6,.16);padding:clamp(28px,5vw,56px);min-height:520px;display:grid;place-items:center;overflow:hidden}.product-visual:before{content:"";position:absolute;inset:12%;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.75),rgba(255,255,255,0) 65%)}.product-visual img{position:relative;z-index:2;max-height:430px;object-fit:contain;filter:drop-shadow(0 46px 32px rgba(33,17,6,.28))}.product-visual figcaption{position:absolute;left:24px;right:24px;bottom:22px;z-index:3;padding:14px 16px;border-radius:20px;background:rgba(255,247,234,.88);font-weight:900;color:rgba(33,17,6,.72)}.details-band{background:#fff;padding:clamp(48px,7vw,88px) clamp(16px,4vw,34px)}.details-inner{max-width:1240px;margin:auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.detail-card{min-height:220px;border-radius:28px;background:#fff7ea;border:1px solid var(--line);box-shadow:0 22px 54px rgba(33,17,6,.08);padding:22px}.detail-card span{display:block;margin-bottom:14px;color:var(--teal);font-size:11px;font-weight:1000;letter-spacing:.18em;text-transform:uppercase}.detail-card h2{margin:0 0 12px;font-size:clamp(22px,2.4vw,34px);line-height:.94;letter-spacing:-.05em;text-transform:uppercase}.detail-card p,.detail-card li{color:rgba(33,17,6,.68);font-weight:850;line-height:1.42}.detail-card ul{padding-left:18px;margin:0}.range-section{max-width:1240px;margin:auto;padding:clamp(50px,7vw,90px) clamp(16px,4vw,34px)}.range-head{display:flex;justify-content:space-between;gap:22px;align-items:end;margin-bottom:22px}.range-head h2{margin:0;font-size:clamp(38px,5vw,76px);line-height:.86;letter-spacing:-.07em;text-transform:uppercase}.range-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.range-card{display:grid;grid-template-rows:150px auto;gap:12px;min-height:270px;border-radius:26px;background:rgba(255,255,255,.72);border:1px solid var(--line);padding:16px;box-shadow:0 18px 42px rgba(33,17,6,.08)}.range-card.is-active{background:#fff;box-shadow:0 26px 62px rgba(0,141,140,.16)}.range-card img{height:150px;width:100%;object-fit:contain;filter:drop-shadow(0 20px 16px rgba(33,17,6,.20))}.range-card strong{display:block;text-transform:uppercase;letter-spacing:-.03em;line-height:1}.range-card small{display:block;margin-top:7px;color:rgba(33,17,6,.62);font-weight:850;line-height:1.3}.site-footer{padding:36px clamp(16px,4vw,34px);background:#120b07;color:#fff}.footer-inner{max-width:1240px;margin:auto;display:flex;gap:18px;align-items:center;justify-content:space-between}.footer-inner p{margin:0;color:rgba(255,255,255,.68);font-weight:850}@media(max-width:920px){.nav-links{display:none}.product-hero,.details-inner{grid-template-columns:1fr}.product-visual{min-height:420px}.facts{grid-template-columns:1fr}.range-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.footer-inner{display:block}.footer-inner p{margin-top:12px}}@media(max-width:560px){.product-copy h1{font-size:clamp(48px,17vw,78px)}.cta-row .btn{width:100%}.range-grid{grid-template-columns:1fr}.range-head{display:block}.product-visual img{max-height:330px}}
`;
}

function rangeCards(activeSlug) {
  return PRODUCTS.map((item) => {
    const activeClass = item.slug === activeSlug ? ' is-active' : '';
    return `<a class="range-card${activeClass}" href="/products/${item.slug}"><img src="${attr(item.image)}" alt="${attr(item.label)}"><span><strong>${htmlEscape(item.name)}</strong><small>${htmlEscape(item.short)}</small></span></a>`;
  }).join('');
}

function fallbackProduct() {
  return {
    ...PRODUCTS[0],
    slug: 'product-not-found',
    name: 'Product Not Found',
    label: 'KWAAI Coffee Product Not Found',
    description: 'This KWAAI Coffee product page is not available. Browse the current bottle and pouch range, then place an order or enquiry with KWAAI Coffee.',
    short: 'Browse the current KWAAI Coffee range.',
    bestFor: 'Customers looking for the current KWAAI Coffee bottle and pouch range',
    mood: 'Current range'
  };
}

function pageHtml(product, statusCode = 200) {
  const meta = productMeta(product);
  const notes = product.notes.map((note) => `<li>${htmlEscape(note)}</li>`).join('');
  const whatsapp = whatsappLink(productOrderMessage(product));
  const statusMeta = statusCode === 404 ? '<meta name="robots" content="noindex" />' : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${htmlEscape(meta.title)}</title>
<meta name="description" content="${attr(meta.description)}" />
${statusMeta}
${socialTags(meta)}
${productStructuredData(product)}
<style>${pageCss()}</style>
</head>
<body>
<header class="site-header">
  <nav class="nav" aria-label="Primary navigation">
    <a class="brand" href="/"><img src="/assets/kwaai-logo-cutout.png" alt="KWAAI Coffee logo"><span><strong>KWAAI Coffee</strong><small>Cold coffee</small></span></a>
    <div class="nav-links"><a href="/#range">Range</a><a href="/#pouches">Pouches</a><a href="/shop">Shop</a><a href="/contacts">Contacts</a><a class="nav-cta" href="${attr(whatsapp)}" target="_blank" rel="noopener">Order on WhatsApp</a></div>
  </nav>
</header>
<main>
  <section class="product-hero">
    <div class="product-copy">
      <p class="eyebrow">${htmlEscape(product.format)}</p>
      <h1>${htmlEscape(product.name)}</h1>
      <p class="lede">${htmlEscape(product.description)}</p>
      <div class="cta-row"><a class="btn" href="${attr(whatsapp)}" target="_blank" rel="noopener">Order this product on WhatsApp</a><a class="btn secondary" href="/#shop">Build a mixed order</a></div>
      <div class="facts" aria-label="Product facts">
        <div class="fact"><span>Format</span><strong>${htmlEscape(product.format)}</strong></div>
        <div class="fact"><span>Profile</span><strong>${htmlEscape(product.short)}</strong></div>
        <div class="fact"><span>Best fit</span><strong>${htmlEscape(product.bestFor)}</strong></div>
      </div>
    </div>
    <figure class="product-visual">
      <img src="${attr(product.image)}" alt="${attr(product.label)}">
      <figcaption>${htmlEscape(product.mood)}. ${htmlEscape(product.short)}</figcaption>
    </figure>
  </section>
  <section class="details-band">
    <div class="details-inner">
      <article class="detail-card"><span>Flavour</span><h2>${htmlEscape(product.mood)}</h2><p>${htmlEscape(product.short)}</p></article>
      <article class="detail-card"><span>Product notes</span><h2>What to expect</h2><ul>${notes}</ul></article>
      <article class="detail-card"><span>Ordering</span><h2>Confirm direct</h2><p>Pricing, stock, delivery and payment are confirmed directly with KWAAI Coffee before the order is final.</p></article>
    </div>
  </section>
  <section class="range-section">
    <div class="range-head"><h2>More KWAAI<br>products.</h2><a class="btn secondary" href="/#shop">Return to shop</a></div>
    <div class="range-grid">${rangeCards(product.slug)}</div>
  </section>
</main>
<footer class="site-footer"><div class="footer-inner"><strong>KWAAI Coffee</strong><p>Orders: +27 72 724 0134 | hello@kwaaicoffee.com | www.kwaaicoffee.com</p></div></footer>
</body>
</html>`;
}

function slugFromRequest(req) {
  const url = new URL(req.url || '/', PUBLIC_URL);
  const queryProduct = url.searchParams.get('product');
  if (queryProduct) return queryProduct.toLowerCase();
  const pathMatch = url.pathname.match(/^\/products\/([^/]+)\/?$/);
  return pathMatch ? decodeURIComponent(pathMatch[1]).toLowerCase() : '';
}

module.exports = function productPage(req, res) {
  const product = findProduct(slugFromRequest(req));
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  if (!product) {
    res.statusCode = 404;
    res.end(pageHtml(fallbackProduct(), 404));
    return;
  }
  res.statusCode = 200;
  res.end(pageHtml(product));
};
