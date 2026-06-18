const fs = require('fs/promises');
const path = require('path');

const WHATSAPP_NUMBER = '27727240134';
const WHATSAPP_TEXT = 'Hi KWAAI Coffee, I would like to place an order.';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

const STORE_CSS = `
/* KWAAI ecommerce and contact enhancements */
.cart-pill{background:var(--ink);color:#fff}.cart-pill span{display:inline-grid;place-items:center;min-width:24px;height:24px;border-radius:999px;background:var(--orange);color:#fff}.add-btn{background:var(--orange);box-shadow:0 16px 30px rgba(240,75,36,.18)}.whatsapp-checkout{width:100%;background:#1fa855!important;color:#fff!important;text-align:center;text-decoration:none;box-shadow:0 18px 34px rgba(31,168,85,.22)!important}.whatsapp-float{position:fixed;right:clamp(14px,3vw,28px);bottom:clamp(14px,3vw,28px);z-index:850;display:inline-flex;align-items:center;gap:10px;min-height:54px;padding:0 18px;border-radius:999px;background:#1fa855;color:#fff;font-weight:1000;letter-spacing:.02em;box-shadow:0 22px 50px rgba(31,168,85,.32)}.whatsapp-float span:first-child{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.18);font-size:18px}.whatsapp-float:hover{transform:translateY(-2px);transition:transform .24s var(--soft)}
.ecommerce-section{background:linear-gradient(180deg,#f0fbfb,#fff7ea);padding-top:clamp(58px,8vw,106px);padding-bottom:clamp(58px,8vw,106px)}.ecommerce-grid{display:grid;grid-template-columns:.88fr 1.12fr;gap:28px;align-items:start}.store-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.store-step{min-height:156px;padding:22px;border-radius:30px;background:#fff;border:1px solid var(--line);box-shadow:0 24px 58px rgba(33,17,6,.09)}.store-step span{display:inline-grid;place-items:center;width:34px;height:34px;margin-bottom:14px;border-radius:50%;background:var(--ink);color:#fff;font-weight:1000}.store-step strong{display:block;margin-bottom:8px;font-size:clamp(18px,1.6vw,25px);line-height:.98;letter-spacing:-.04em;text-transform:uppercase}.store-step small{display:block;color:rgba(33,17,6,.64);font-weight:850;line-height:1.35}.store-note{display:inline-flex;width:fit-content;margin-top:22px;padding:11px 15px;border-radius:999px;background:rgba(0,141,140,.10);color:var(--teal);font-weight:1000;letter-spacing:.04em}
.contact-section{background:#f0fbfb;padding-top:clamp(64px,8vw,110px)}.contact-grid{display:grid;grid-template-columns:.82fr 1.18fr;gap:28px;align-items:start}.contact-card{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.contact-link{display:grid;gap:8px;min-height:142px;padding:22px;border-radius:30px;background:#fff;border:1px solid var(--line);box-shadow:0 24px 58px rgba(33,17,6,.09);font-weight:1000}.contact-link span{color:var(--teal);font-size:11px;letter-spacing:.18em;text-transform:uppercase}.contact-link strong{font-size:clamp(18px,1.6vw,26px);line-height:.98;letter-spacing:-.04em;overflow-wrap:anywhere}.contact-link small{color:rgba(33,17,6,.62);font-weight:850;line-height:1.35}.contact-link:hover{transform:translateY(-3px);box-shadow:0 30px 70px rgba(0,141,140,.14);transition:transform .25s var(--soft),box-shadow .25s var(--soft)}.contact-domain{display:inline-flex;width:fit-content;margin-top:22px;padding:11px 15px;border-radius:999px;background:rgba(240,75,36,.10);color:var(--orange);font-weight:1000;letter-spacing:.04em}.whatsapp-contact{background:linear-gradient(135deg,#fff,#ecfff4)}
@media(max-width:980px){.ecommerce-grid,.contact-grid{grid-template-columns:1fr}}
@media(max-width:620px){.store-steps,.contact-card{grid-template-columns:1fr}.whatsapp-float{left:14px;right:14px;justify-content:center}.whatsapp-float strong{display:inline}}
`;

const STORE_HTML = `
<section class="section ecommerce-section" id="checkout" data-dock="shop">
  <div class="section-inner ecommerce-grid">
    <div>
      <p class="eyebrow">Online store</p>
      <h2 class="h2">Shop.<br>Cart.<br>Checkout.</h2>
      <p class="copy">Add KWAAI bottles and pouches to your cart, send the order enquiry, or open a ready-to-send WhatsApp checkout message.</p>
      <span class="store-note">WhatsApp orders: +27 72 724 0134</span>
    </div>
    <div class="store-steps" aria-label="KWAAI Coffee ecommerce flow">
      <article class="store-step"><span>1</span><strong>Add to cart</strong><small>Choose bottles, pouches, mixed packs, and wholesale enquiry items from the shop.</small></article>
      <article class="store-step"><span>2</span><strong>Share details</strong><small>Add your name, contact details, quantities, delivery area, and notes.</small></article>
      <article class="store-step"><span>3</span><strong>Checkout on WhatsApp</strong><small>Open WhatsApp with your cart summary already prepared for KWAAI Coffee.</small></article>
      <article class="store-step"><span>4</span><strong>Confirm order</strong><small>Pricing, stock, delivery, and payment are confirmed before the order is final.</small></article>
    </div>
  </div>
</section>
`;

const CONTACT_HTML = `
<section class="section contact-section" id="contacts" data-dock="shop">
  <div class="section-inner contact-grid">
    <div>
      <p class="eyebrow">Contacts</p>
      <h2 class="h2">Talk to<br>KWAAI.</h2>
      <p class="copy">Use the right inbox for samples, orders, wholesale, and support. The main website address is www.kwaaicoffee.com.</p>
      <a class="contact-domain" href="https://www.kwaaicoffee.com">www.kwaaicoffee.com</a>
    </div>
    <div class="contact-card" aria-label="KWAAI Coffee email and WhatsApp contacts">
      <a class="contact-link whatsapp-contact" href="${WHATSAPP_LINK}" target="_blank" rel="noopener">
        <span>WhatsApp</span>
        <strong>+27 72 724 0134</strong>
        <small>Fast ordering, stock questions, and checkout follow-up.</small>
      </a>
      <a class="contact-link" href="mailto:hello@kwaaicoffee.com">
        <span>General</span>
        <strong>hello@kwaaicoffee.com</strong>
        <small>Brand, samples, partnerships, and first chats.</small>
      </a>
      <a class="contact-link" href="mailto:orders@kwaaicoffee.com">
        <span>Orders</span>
        <strong>orders@kwaaicoffee.com</strong>
        <small>Product requests, order follow-up, and quantities.</small>
      </a>
      <a class="contact-link" href="mailto:wholesale@kwaaicoffee.com">
        <span>Wholesale</span>
        <strong>wholesale@kwaaicoffee.com</strong>
        <small>Retail, reseller, office, event, and bulk enquiries.</small>
      </a>
      <a class="contact-link" href="mailto:support@kwaaicoffee.com">
        <span>Support</span>
        <strong>support@kwaaicoffee.com</strong>
        <small>Questions, help, and product support.</small>
      </a>
    </div>
  </div>
</section>
`;

const STORE_SCRIPT = `
<script>
(() => {
  const whatsappBase = 'https://wa.me/${WHATSAPP_NUMBER}';
  const defaultMessage = 'Hi KWAAI Coffee, I would like to place an order.';
  const text = (selector) => (document.querySelector(selector)?.value || '').trim();
  const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();

  function cartSummary() {
    const rows = Array.from(document.querySelectorAll('#cartList .cart-row'));
    if (!rows.length) return 'No products selected yet.';
    return rows.map((row) => clean(row.innerText.replace(/[+\u2212]/g, ' '))).join('\n');
  }

  function buildMessage() {
    const name = text('#customerName');
    const contact = text('#customerContact');
    const notes = text('#customerNotes');
    return [
      defaultMessage,
      '',
      'Cart:',
      cartSummary(),
      '',
      name ? 'Name: ' + name : '',
      contact ? 'Contact: ' + contact : '',
      notes ? 'Notes: ' + notes : '',
      '',
      'Website: www.kwaaicoffee.com'
    ].filter(Boolean).join('\n');
  }

  function updateWhatsAppCheckout() {
    document.querySelectorAll('[data-whatsapp-order]').forEach((link) => {
      link.href = whatsappBase + '?text=' + encodeURIComponent(buildMessage());
    });
  }

  document.addEventListener('input', updateWhatsAppCheckout);
  document.addEventListener('change', updateWhatsAppCheckout);
  document.addEventListener('click', () => setTimeout(updateWhatsAppCheckout, 0));
  setInterval(updateWhatsAppCheckout, 1000);
  updateWhatsAppCheckout();
})();
</script>
`;

function injectStore(html) {
  let output = html;

  if (!output.includes('KWAAI ecommerce and contact enhancements')) {
    output = output.replace('</style>', `${STORE_CSS}\n</style>`);
  }

  output = output
    .replace('<a href="#shop">Order</a></div>', '<a href="#shop">Shop</a><a href="#checkout">Checkout</a><a href="#contacts">Contacts</a></div>')
    .replace('<a href="#shop" class="cart-pill">Order <span id="cartCount">0</span></a>', '<a href="#shop" class="cart-pill">Cart <span id="cartCount">0</span></a>')
    .replace('Start an order request', 'Shop now')
    .replace('<p class="eyebrow">Order enquiry</p><h2 class="h2">Build your<br>KWAAI order.</h2><p class="copy">Pick your KWAAI bottles and pouches. Prices and delivery are confirmed by KWAAI Coffee before anything gets serious. The coffee may be chilled; the order request is not confusing.</p>', '<p class="eyebrow">KWAAI store</p><h2 class="h2">Build your<br>KWAAI cart.</h2><p class="copy">Pick your KWAAI bottles and pouches, add them to your cart, then checkout by enquiry or WhatsApp. Stock, delivery, pricing, and payment are confirmed before anything is final.</p>')
    .replace('<aside class="cart-box"><h3>Order request</h3><p class="copy">Add products, leave your details, then send or copy the request. No fake checkout. No secret tunnel. Just coffee admin behaving itself.</p>', '<aside class="cart-box"><h3>Your cart</h3><p class="copy">Add products, leave your details, then send a checkout request or open WhatsApp with your cart summary already prepared.</p>')
    .replace('<button class="btn dark" id="copySummary">Copy order request</button><button class="btn" id="sendOrder" type="button">Send order request</button>', `<button class="btn dark" id="copySummary">Copy cart summary</button><button class="btn" id="sendOrder" type="button">Send checkout request</button><a class="btn whatsapp-checkout" id="whatsappCheckout" data-whatsapp-order href="${WHATSAPP_LINK}" target="_blank" rel="noopener">Checkout on WhatsApp</a>`);

  if (!output.includes('id="checkout"')) {
    output = output.replace('</main>', `${STORE_HTML}\n${CONTACT_HTML}\n</main>`);
  } else if (!output.includes('id="contacts"')) {
    output = output.replace('</main>', `${CONTACT_HTML}\n</main>`);
  }

  if (!output.includes('data-whatsapp-float')) {
    output = output.replace('</body>', `<a class="whatsapp-float" data-whatsapp-float data-whatsapp-order href="${WHATSAPP_LINK}" target="_blank" rel="noopener"><span>WA</span><strong>Order on WhatsApp</strong></a>\n${STORE_SCRIPT}\n</body>`);
  }

  return output;
}

async function readLocalTemplate() {
  const candidates = [
    path.join(process.cwd(), 'index.html'),
    path.join(__dirname, '..', 'index.html')
  ];

  for (const candidate of candidates) {
    try {
      return await fs.readFile(candidate, 'utf8');
    } catch (error) {}
  }

  throw new Error('Local index template unavailable.');
}

module.exports = async function site(req, res) {
  try {
    const html = await readLocalTemplate();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.end(injectStore(html));
  } catch (error) {
    console.error('KWAAI ecommerce injection failed', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Could not load KWAAI Coffee website.');
  }
};
