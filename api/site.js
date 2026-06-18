const fs = require('fs/promises');
const path = require('path');

const CONTACT_CSS = `
.contact-section{background:#f0fbfb;padding-top:clamp(64px,8vw,110px)}.contact-grid{display:grid;grid-template-columns:.82fr 1.18fr;gap:28px;align-items:start}.contact-card{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.contact-link{display:grid;gap:8px;min-height:142px;padding:22px;border-radius:30px;background:#fff;border:1px solid var(--line);box-shadow:0 24px 58px rgba(33,17,6,.09);font-weight:1000}.contact-link span{color:var(--teal);font-size:11px;letter-spacing:.18em;text-transform:uppercase}.contact-link strong{font-size:clamp(18px,1.6vw,26px);line-height:.98;letter-spacing:-.04em;overflow-wrap:anywhere}.contact-link small{color:rgba(33,17,6,.62);font-weight:850;line-height:1.35}.contact-link:hover{transform:translateY(-3px);box-shadow:0 30px 70px rgba(0,141,140,.14);transition:transform .25s var(--soft),box-shadow .25s var(--soft)}.contact-domain{display:inline-flex;width:fit-content;margin-top:22px;padding:11px 15px;border-radius:999px;background:rgba(240,75,36,.10);color:var(--orange);font-weight:1000;letter-spacing:.04em}@media(max-width:980px){.contact-grid{grid-template-columns:1fr}}@media(max-width:620px){.contact-card{grid-template-columns:1fr}}
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
    <div class="contact-card" aria-label="KWAAI Coffee email contacts">
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

function injectContacts(html) {
  if (html.includes('id="contacts"')) return html;

  return html
    .replace('</style>', `${CONTACT_CSS}\n</style>`)
    .replace('<a href="#shop">Order</a></div>', '<a href="#shop">Order</a><a href="#contacts">Contacts</a></div>')
    .replace('</main>', `${CONTACT_HTML}\n</main>`);
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
    res.end(injectContacts(html));
  } catch (error) {
    console.error('KWAAI contact injection failed', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Could not load KWAAI Coffee website.');
  }
};
