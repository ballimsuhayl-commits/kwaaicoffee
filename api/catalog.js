const PUBLIC_URL = 'https://www.kwaaicoffee.com';
const WHATSAPP_NUMBER = '27727240134';
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

const PRODUCTS = [
  {
    slug: 'coffee-latte',
    name: 'Coffee Latte',
    label: 'KWAAI Coffee Latte',
    format: '250 ml ready-to-drink bottle',
    category: 'Cold coffee bottle',
    image: '/assets/bottle-coffee-latte.png',
    short: 'A balanced latte-style cold coffee in a compact 250 ml bottle.',
    description: 'KWAAI Coffee Latte is a ready-to-drink cold coffee bottle with a smooth latte profile, made for chilled service, retail fridges, events, office orders and everyday coffee moments.',
    notes: ['Balanced latte profile', 'Compact 250 ml serve', 'Made for chilled cabinets and quick orders'],
    bestFor: 'Retail fridges, office orders, event coolers and everyday cold coffee customers',
    mood: 'Daily Good Mood'
  },
  {
    slug: 'cappuccino',
    name: 'Cappuccino',
    label: 'KWAAI Cappuccino',
    format: '250 ml ready-to-drink bottle',
    category: 'Cold coffee bottle',
    image: '/assets/bottle-cappuccino.png',
    short: 'A classic cappuccino-style cold coffee with a smooth finish.',
    description: 'KWAAI Cappuccino brings a classic cappuccino-style cold coffee profile to a 250 ml ready-to-drink bottle, suited to customers who want an easy chilled coffee choice with a familiar flavour direction.',
    notes: ['Classic cappuccino profile', 'Smooth cold coffee finish', 'Ready to serve from the fridge'],
    bestFor: 'Retail shelves, lunch counters, office fridges and mixed cold coffee orders',
    mood: 'Smooth & Happy'
  },
  {
    slug: 'parisian-chocolate',
    name: 'Parisian Chocolate',
    label: 'KWAAI Parisian Chocolate',
    format: '250 ml ready-to-drink bottle',
    category: 'Chocolate cold coffee bottle',
    image: '/assets/bottle-parisian-chocolate.png',
    short: 'A chocolate-forward cold coffee bottle with a smooth, rich profile.',
    description: 'KWAAI Parisian Chocolate is a 250 ml ready-to-drink cold coffee bottle built around a chocolate-forward profile and a smooth finish, giving the range a bold flavour choice for customers who prefer a richer chilled drink.',
    notes: ['Chocolate-forward profile', 'Smooth cold finish', 'Strong choice for mixed bottle orders'],
    bestFor: 'Chocolate coffee fans, cooler displays, event stock and mixed bottle packs',
    mood: 'Bold & Dreamy'
  },
  {
    slug: 'japanese-matcha',
    name: 'Japanese Matcha',
    label: 'KWAAI Japanese Matcha',
    format: '250 ml ready-to-drink bottle',
    category: 'Matcha-style chilled drink',
    image: '/assets/bottle-japanese-matcha.png',
    short: 'A matcha-style chilled drink for customers who prefer a greener finish.',
    description: 'KWAAI Japanese Matcha is a 250 ml ready-to-drink bottle with a matcha-style chilled drink profile, giving the range a cleaner green option alongside the coffee-led bottle flavours.',
    notes: ['Matcha-style chilled profile', 'Cleaner green finish', 'Distinct option in the bottle range'],
    bestFor: 'Customers looking for a greener chilled drink, mixed fridges and flavour variety',
    mood: 'Clean & Green'
  },
  {
    slug: 'caramel-latte-pouch',
    name: 'Caramel Latte Pouch',
    label: 'KWAAI Caramel Latte Pouch',
    format: 'Chilled pouch product',
    category: 'Cold coffee pouch',
    image: '/assets/pouch-caramel-latte.png',
    short: 'A smooth caramel latte profile in a chilled KWAAI pouch.',
    description: 'KWAAI Caramel Latte Pouch is a chilled pouch product with a smooth caramel latte profile, made for customers who want a softer pack format with a creamy cold coffee flavour direction.',
    notes: ['Caramel latte profile', 'Smooth and sweet finish', 'Easy pouch format'],
    bestFor: 'Pouch displays, chilled event stock, sample orders and flavour variety',
    mood: 'Smooth & Sweet'
  },
  {
    slug: 'hazelnut-bliss-pouch',
    name: 'Hazelnut Bliss Pouch',
    label: 'KWAAI Hazelnut Bliss Pouch',
    format: 'Chilled pouch product',
    category: 'Cold coffee pouch',
    image: '/assets/pouch-hazelnut-bliss.png',
    short: 'A nutty, creamy hazelnut profile in a chilled pouch format.',
    description: 'KWAAI Hazelnut Bliss Pouch is a chilled pouch product with a nutty hazelnut coffee profile and a creamy finish, giving the pouch range a warm flavour note while staying ready for cold service.',
    notes: ['Hazelnut coffee profile', 'Nutty and creamy finish', 'Chilled pouch format'],
    bestFor: 'Pouch selections, office orders, event coolers and customers who like nutty cold coffee',
    mood: 'Nutty & Creamy'
  },
  {
    slug: 'vanilla-dream-pouch',
    name: 'Vanilla Dream Pouch',
    label: 'KWAAI Vanilla Dream Pouch',
    format: 'Chilled pouch product',
    category: 'Cold coffee pouch',
    image: '/assets/pouch-vanilla-dream.png',
    short: 'A mellow vanilla coffee profile with a smooth, creamy finish.',
    description: 'KWAAI Vanilla Dream Pouch is a chilled pouch product with a mellow vanilla coffee profile and a smooth creamy finish, suited to customers who want an easy, familiar cold coffee flavour.',
    notes: ['Vanilla coffee profile', 'Smooth and creamy finish', 'Soft chilled serve'],
    bestFor: 'Mixed pouch orders, event service, retail fridges and approachable cold coffee choices',
    mood: 'Smooth & Creamy'
  }
];

function productUrl(product) {
  return `${PUBLIC_URL}/products/${product.slug}`;
}

function productImageUrl(product) {
  return `${PUBLIC_URL}${product.image}`;
}

function whatsappLink(message) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}

function findProduct(slug) {
  return PRODUCTS.find((product) => product.slug === String(slug || '').toLowerCase()) || null;
}

module.exports = {
  PUBLIC_URL,
  WHATSAPP_NUMBER,
  WHATSAPP_BASE,
  PRODUCTS,
  findProduct,
  productUrl,
  productImageUrl,
  whatsappLink
};
