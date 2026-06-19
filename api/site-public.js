const renderSite = require('./site');

const PUBLIC_URL = 'https://www.kwaaicoffee.com';
const PUBLIC_TITLE = 'KWAAI Coffee | Cold Coffee Bottles and Pouches';
const PUBLIC_DESCRIPTION = 'KWAAI Coffee makes cold ready-to-drink coffee bottles and chilled pouch products in Coffee Latte, Cappuccino, Parisian Chocolate, Japanese Matcha, Caramel Latte, Hazelnut Bliss and Vanilla Dream. Order on WhatsApp or send a product enquiry.';
const PUBLIC_IMAGE = `${PUBLIC_URL}/assets/kwaai-logo-cutout.png`;

const EXACT_REPLACEMENTS = [
  ['<a href="#motion">Motion</a>', '<a href="#motion">Range</a>'],
  ['<a href="#world">World</a>', '<a href="#world">Brand</a>'],
  ['<a href="#shop">Order</a><a href="#contacts">Contacts</a>', '<a href="#shop">Shop</a><a href="#checkout">Checkout</a><a href="#contacts">Contacts</a>'],
  ['<a href="#shop">Order</a>', '<a href="#shop">Shop</a>'],
  ['Skip to order enquiry', 'Skip to shop'],
  ['aria-label="Animated KWAAI Coffee product sequence"', 'aria-label="KWAAI Coffee product range"'],
  ['aria-label="Animated KWAAI pouch product theatre"', 'aria-label="KWAAI Coffee pouch products"'],
  ['aria-label="Animated KWAAI Coffee logo assembly"', 'aria-label="KWAAI Coffee brand mark"'],
  ['<span>Order enquiry</span>', '<span>WhatsApp checkout</span>'],
  ['<p class="eyebrow">How KWAAI moves</p>', '<p class="eyebrow">The KWAAI range</p>'],
  ['Cold stuff<br>rolls in.', 'Cold coffee.<br>Ready to go.'],
  ['The bottle takes the first lap. Then the pouches slide in like they just escaped the cooler.', 'Choose 250 ml ready-to-drink bottles or chilled pouches, then send a checkout request straight to KWAAI Coffee.'],
  ['Daily Good Mood \u00b7 the bottle doing the most, politely.', 'Daily Good Mood \u00b7 a creamy coffee latte in a 250 ml ready-to-drink bottle.'],
  ['Parisian Chocolate \u00b7 Cappuccino \u00b7 Japanese Matcha. Small bottles, big main-character energy.', 'Parisian Chocolate, Cappuccino and Japanese Matcha in 250 ml ready-to-drink bottles.'],
  ['Four 250 ml ready-to-drink KWAAI Coffee bottles, each with its own on-pack mood phrase. Tiny bottle. Big \u201ctoday is not defeating me\u201d energy.', 'Four 250 ml ready-to-drink KWAAI Coffee bottles made for chilled service, quick orders, retail fridges, events and everyday coffee moments.'],
  ['Bold &amp; Dreamy on the bottle. A little dramatic, as chocolate is legally allowed to be.', 'Bold &amp; Dreamy on the bottle, with a chocolate-forward cold coffee profile and a smooth finish.'],
  ['Smooth &amp; Happy on pack. Basically a tiny pep talk with a black cap.', 'Smooth &amp; Happy on pack, with a classic cappuccino-style cold coffee profile in a 250 ml bottle.'],
  ['Daily Good Mood on the bottle. The dependable one. Main-character coffee at 250 ml.', 'Daily Good Mood on the bottle, with a balanced latte-style cold coffee profile in a compact 250 ml serve.'],
  ['Clean &amp; Green on pack. Calm, cool, and very neat about it.', 'Clean &amp; Green on pack, with a matcha-style cold drink profile for customers who prefer a greener finish.'],
  ['Pouches with<br>personality.', 'Chilled pouches.<br>Three flavours.'],
  ['Same KWAAI mood, softer pack. Caramel Latte is Smooth &amp; Sweet, Hazelnut Bliss is Nutty &amp; Creamy, and Vanilla Dream is Smooth &amp; Creamy. The pouches understood the assignment.', 'KWAAI pouch products are available in Caramel Latte, Hazelnut Bliss and Vanilla Dream. Each flavour is built around a smooth, creamy cold coffee profile for easy ordering and chilled service.'],
  ['Smooth &amp; Sweet. The pouch that arrived smiling.', 'Smooth &amp; Sweet, with a caramel latte profile for a creamy chilled coffee serve.'],
  ['Nutty &amp; Creamy. Bliss is literally doing the paperwork.', 'Nutty &amp; Creamy, with a hazelnut coffee profile and a soft chilled finish.'],
  ['Smooth &amp; Creamy. Soft-name, cold-coffee behaviour.', 'Smooth &amp; Creamy, with a vanilla coffee profile for a mellow chilled serve.'],
  ['It comes together.', 'KWAAI Coffee.'],
  ['Letters, lid, steam, attitude.', 'Cold coffee with attitude.'],
  ['KWAAI is South African slang for cool, excellent, seriously good \u2014 with a little attitude in the cap. Basically: cold coffee that walks in and makes boring leave quietly.', 'KWAAI is South African slang for cool, excellent and seriously good. The brand brings that energy to cold ready-to-drink coffee bottles and chilled pouch products.'],
  ['South African word energy: cool, bold and very much not shy.', 'South African slang for cool, excellent and full of confidence.'],
  ['KW-eye. Say it once and your fridge suddenly respects you.', 'KW-eye. Simple to say, easy to remember, and made for a cold coffee brand with presence.'],
  ['Good mood<br>in the wild.', 'Cold coffee<br>for real days.'],
  ['KWAAI Coffee shows up as bottles, pouches, cooler moments and a bright brand world. The vibe is simple: cold coffee, warm people, zero boring sips.', 'KWAAI Coffee is made for chilled cabinets, events, office orders, wholesale enquiries and everyday customers who want cold coffee with a clear flavour choice.'],
  ['Cold coffee for outside people.', 'Cold bottles, ready to serve.'],
  ['KWAAI bottle products shown together in a chilled cooler setting.', '250 ml ready-to-drink bottles made for chilled service and easy customer selection.'],
  ['Pouches, but make them cheerful.', 'Three pouch flavours.'],
  ['Caramel Latte, Hazelnut Bliss and Vanilla Dream.', 'Caramel Latte, Hazelnut Bliss and Vanilla Dream pouch products.'],
  ['alt="KWAAI Coffee packet artwork"', 'alt="KWAAI Coffee products on shelf"'],
  ['Coffee pack artwork shown in the KWAAI colour system.', 'KWAAI bottles and pouches presented for retail, cooler and event orders.'],
  ['Good coffee. Good mood. KWAAI means cool; we say it\u2019s KW-eye. Product range: 250 ml bottles and pouch products. Enquiry-based ordering.', 'Good coffee. Good mood. KWAAI means cool; we say it is KW-eye. Shop 250 ml bottles and chilled pouch products, then checkout by WhatsApp or enquiry.'],
  ['REV21 KWAAI Voice \u00b7 product facts only \u00b7 good mood allowed', 'Cold coffee bottles and pouch products'],
  ['source:\'KWAAI REV22 website\'', 'source:\'KWAAI Coffee website\''],
  ['Add to order request', 'Add to cart'],
  ['Copy order request', 'Copy cart summary'],
  ['Send order request', 'Send checkout request'],
  ['send the order enquiry, or open a ready-to-send WhatsApp checkout message.', 'send a checkout request, or open a ready-to-send WhatsApp order message.'],
  ['KWAAI Coffee order enquiry', 'KWAAI Coffee checkout request'],
  ['Please add at least one KWAAI product before sending the request. The cart is currently more empty than a Monday fridge.', 'Please add at least one KWAAI product before sending the checkout request.'],
  ['Please add your name and email or phone before sending. KWAAI can\u2019t reply to a mystery legend.', 'Please add your name and email or phone before sending. KWAAI Coffee needs those details to confirm your order.'],
  ['Order request submitted through the static form backend.', 'Order request submitted.'],
  ['Could not reach the backend from this local file view. Copy this request and send it manually for now:', 'We could not send the request automatically. Copy this request and send it to KWAAI Coffee on WhatsApp:'],
  ['/.netlify/functions/order-enquiry', '/api/order-enquiry']
];

const PRODUCT_INFO_REPLACEMENTS = [
  ["info:'250 ml \\u00b7 Daily Good Mood'", "info:'250 ml ready-to-drink coffee latte'"],
  ["info:'250 ml \\u00b7 Clean & Green'", "info:'250 ml ready-to-drink matcha-style drink'"],
  ["info:'250 ml \\u00b7 Bold & Dreamy'", "info:'250 ml ready-to-drink chocolate coffee'"],
  ["info:'250 ml \\u00b7 Smooth & Happy'", "info:'250 ml ready-to-drink cappuccino coffee'"],
  ["info:'Smooth & Sweet'", "info:'Smooth & Sweet caramel latte pouch'"],
  ["info:'Nutty & Creamy'", "info:'Nutty & Creamy hazelnut pouch'"],
  ["info:'Smooth & Creamy'", "info:'Smooth & Creamy vanilla pouch'"]
];

function replaceAll(text, replacements) {
  let output = text;
  for (const [from, to] of replacements) {
    output = output.split(from).join(to);
  }
  return output;
}

function cleanStyleComments(html) {
  return html.replace(/<style>([\s\S]*?)<\/style>/i, (_, css) => {
    return `<style>${css.replace(/\/\*[\s\S]*?\*\//g, '')}</style>`;
  });
}

function socialTags() {
  return [
    `<link rel="canonical" href="${PUBLIC_URL}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${PUBLIC_URL}" />`,
    `<meta property="og:site_name" content="KWAAI Coffee" />`,
    `<meta property="og:title" content="${PUBLIC_TITLE}" />`,
    `<meta property="og:description" content="${PUBLIC_DESCRIPTION}" />`,
    `<meta property="og:image" content="${PUBLIC_IMAGE}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${PUBLIC_TITLE}" />`,
    `<meta name="twitter:description" content="${PUBLIC_DESCRIPTION}" />`,
    `<meta name="twitter:image" content="${PUBLIC_IMAGE}" />`
  ].join('\n');
}

function cleanHead(html) {
  let output = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${PUBLIC_TITLE}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${PUBLIC_DESCRIPTION}" />`)
    .replace(/\n?<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/\n?<meta\s+(?:property|name)="(?:og:|twitter:)[^"]+"[^>]*>/gi, '');

  return output.replace('<style>', `${socialTags()}\n<style>`);
}

function cleanPublicCopy(html) {
  let output = cleanStyleComments(html);
  output = replaceAll(output, EXACT_REPLACEMENTS);
  output = replaceAll(output, PRODUCT_INFO_REPLACEMENTS);
  output = output
    .replace(/\n\s*\/\/ REV[^\n]*/g, '')
    .replace(/\n\s*\/\/ Netlify Forms fallback for static deploys/g, '')
    .replace(/rev22Orbit/g, 'brandOrbit')
    .replace(/theatre/gi, 'range')
    .replace(/\bREV\d+\b/g, '')
    .replace(/Fullstack Logo Assembly/gi, 'Cold Coffee Bottles and Pouches')
    .replace(/full-stack deploy-ready website/gi, 'cold coffee brand')
    .replace(/animated split-logo assembly,\s*/gi, '')
    .replace(/order enquiry backend/gi, 'WhatsApp and product enquiry ordering')
    .replace(/Animated /g, '')
    .replace(/ theatre/gi, '');

  return cleanHead(output);
}

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
  const body = cleanPublicCopy(chunks.join('')).replace(
    "replace(/s+/g, ' ')",
    "replace(new RegExp('\\\\s+', 'g'), ' ')"
  );

  res.end(body);
};
