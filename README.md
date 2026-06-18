# KWAAI Coffee REV22 — Fullstack Logo Assembly

## What changed
- Built on REV21, preserving the REV09/REV11 product-led cold editorial direction.
- Added a stronger split-logo assembly in the "What does KWAAI mean?" section using the uploaded individual logo components.
- Corrected the pronunciation line to: "We say it’s KW-eye."
- Reworked the section copy to be more joyful and brand-authored while keeping product information truthful.
- Added a deployable backend path for order enquiries.

## Frontend
Open `index.html` directly for static preview, or run the backend server below for full order API behaviour.

## Local full-stack run
```bash
npm start
```
Then open:
```text
http://localhost:8787
```
Order enquiries are saved to:
```text
data/orders.jsonl
```

## Netlify deployment
This package includes:
- `netlify.toml`
- `netlify/functions/order-enquiry.js`
- a hidden Netlify Forms-compatible form

Deploy the full folder to Netlify. The frontend will submit to `/.netlify/functions/order-enquiry` and `/api/order-enquiry` is redirected there.

## Product truth standard
The site uses only visible/supplied product facts: product names, 250 ml where shown, and on-pack mood/flavour phrases. No prices, ingredients, allergens, stock, shipping or payment promises are invented.

## Verification performed
- HTML asset references checked.
- JavaScript syntax checked.
- Node backend syntax checked.
- API endpoint tested locally using Node server.
- ZIP integrity checked.

## Not verified here
- Live visual browser QA in the sandbox, because local browser navigation has been unreliable/blocked in prior tests. Please test `index.html` or `http://localhost:8787` on your Windows machine.
