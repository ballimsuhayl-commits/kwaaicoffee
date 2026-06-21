const renderPublicSite = require('./site-public');
const { PUBLIC_URL, PRODUCTS, productUrl } = require('./catalog');

const PRODUCT_LINK_CSS = `
.product-actions,.shop-actions{display:grid;gap:8px}.product-actions .add-btn,.shop-actions .add-btn{width:100%}.details-link{display:inline-flex;align-items:center;justify-content:center;min-height:40px;border-radius:999px;background:#fff;color:var(--ink);border:1px solid rgba(33,17,6,.14);font-size:12px;font-weight:1000;letter-spacing:.08em;text-transform:uppercase}.details-link:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(33,17,6,.10);transition:transform .24s var(--soft),box-shadow .24s var(--soft)}.pouch-card .details-link{width:fit-content;margin-top:12px;padding:0 15px}.shop-item .shop-actions{grid-template-columns:1fr;gap:7px}
`;

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function homeStructuredData() {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${PUBLIC_URL}/#organization`,
        name: 'KWAAI Coffee',
        url: PUBLIC_URL,
        logo: `${PUBLIC_URL}/assets/kwaai-logo-cutout.png`,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: '+27 72 724 0134',
            email: 'hello@kwaaicoffee.com',
            areaServed: 'ZA'
          },
          {
            '@type': 'ContactPoint',
            contactType: 'wholesale enquiries',
            email: 'wholesale@kwaaicoffee.com',
            areaServed: 'ZA'
          }
        ]
      },
      {
        '@type': 'WebSite',
        '@id': `${PUBLIC_URL}/#website`,
        url: PUBLIC_URL,
        name: 'KWAAI Coffee',
        publisher: { '@id': `${PUBLIC_URL}/#organization` }
      },
      {
        '@type': 'ItemList',
        name: 'KWAAI Coffee product range',
        itemListElement: PRODUCTS.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: productUrl(product),
          name: product.label
        }))
      }
    ]
  });
}

function addProductLinks(html) {
  let output = html;
  if (!output.includes('.details-link{')) {
    output = output.replace('</style>', `${PRODUCT_LINK_CSS}\n</style>`);
  }

  for (const product of PRODUCTS) {
    const shortName = product.name.replace(/ Pouch$/i, '');
    const buttonPattern = new RegExp(`(<button class="add-btn" data-add="[^"]*${escapeRegExp(shortName)}[^"]*">Add to cart<\\/button>)`, 'g');
    output = output.replace(buttonPattern, `<div class="product-actions"><a class="details-link" href="/products/${product.slug}">View product</a>$1</div>`);

    if (product.slug.endsWith('-pouch')) {
      const pouchPattern = new RegExp(`(<h3>${escapeRegExp(shortName)}<\\/h3><p>[^<]+<\\/p>)(?!<a class="details-link")`, 'g');
      output = output.replace(pouchPattern, `$1<a class="details-link" href="/products/${product.slug}">View product</a>`);
    }
  }

  const originalRender = "function renderProducts(){ const wrap=$('#shopProducts'); wrap.innerHTML=products.map(p=>`<article class=\"shop-item\"><img src=\"${p.img}\" alt=\"${p.name}\"><div><h3>${p.name}</h3><p>${p.info}</p><button class=\"add-btn\" data-add=\"${p.add}\">Add to cart</button></div></article>`).join(''); }";
  const enhancedRender = "function productPageFor(name){ return '/products/' + String(name).toLowerCase().replace(/\\s+pouch$/,'-pouch').replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }\n  function renderProducts(){ const wrap=$('#shopProducts'); wrap.innerHTML=products.map(p=>`<article class=\"shop-item\"><img src=\"${p.img}\" alt=\"${p.name}\"><div><h3>${p.name}</h3><p>${p.info}</p><div class=\"shop-actions\"><a class=\"details-link\" href=\"${productPageFor(p.name)}\">View product</a><button class=\"add-btn\" data-add=\"${p.add}\">Add to cart</button></div></div></article>`).join(''); }";
  return output.replace(originalRender, enhancedRender);
}

function cleanBottleProductInfo(html) {
  return html
    .replace(/info:'250 ml (?:\\u00b7|\u00b7) Daily Good Mood'/g, "info:'250 ml ready-to-drink coffee latte'")
    .replace(/info:'250 ml (?:\\u00b7|\u00b7) Clean & Green'/g, "info:'250 ml ready-to-drink matcha-style drink'")
    .replace(/info:'250 ml (?:\\u00b7|\u00b7) Bold & Dreamy'/g, "info:'250 ml ready-to-drink chocolate coffee'")
    .replace(/info:'250 ml (?:\\u00b7|\u00b7) Smooth & Happy'/g, "info:'250 ml ready-to-drink cappuccino coffee'");
}

function enhanceHome(html) {
  let output = cleanBottleProductInfo(addProductLinks(html));
  if (!output.includes('"@type":"ItemList"')) {
    output = output.replace('</head>', `${homeStructuredData()}\n</head>`);
  }
  return output;
}

function setStorefrontCacheHeaders(res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('CDN-Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.setHeader('Vercel-CDN-Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
}

module.exports = async function siteEnhanced(req, res) {
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

  await renderPublicSite(req, capture);

  for (const [name, value] of headers) {
    res.setHeader(name, value);
  }
  setStorefrontCacheHeaders(res);

  res.statusCode = capture.statusCode || 200;
  res.end(enhanceHome(chunks.join('')));
};
