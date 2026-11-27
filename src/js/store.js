import { INITIAL_ORDERS, INITIAL_REVIEWS, PRODUCTS } from './data.js';

const DEFAULT_CART = [
  {
    productId: 1,
    name: 'Pink Flower Tree',
    price: 18.0,
    image: PRODUCTS[0].image,
    quantity: 2,
    color: '#E55472',
    size: 'M',
  },
  {
    productId: 2,
    name: 'Premium Joyful',
    price: 18.0,
    image: PRODUCTS[1].image,
    quantity: 2,
    color: '#FFFF00',
    size: 'L',
  },
  {
    productId: 3,
    name: 'The White Rose',
    price: 16.0,
    image: PRODUCTS[2].image,
    quantity: 2,
    color: '#FFFFFF',
    size: 'M',
  },
];

const DEFAULT_WISHLIST = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[3]];

const DEFAULT_USER = {
  firstName: 'Alex',
  lastName: 'Tuntuni',
  displayName: 'UserName',
  email: 'example@example.com',
  isLoggedIn: false,
  billingAddress: {
    name: 'Alex Tuntuni',
    street: '1355 Market St, Suite 900',
    cityStateZip: 'San Francisco, CA 94103',
    mobile: '(123) 456-7890',
  },
  shippingAddress: {
    name: 'Alex Tuntuni',
    street: '1355 Market St, Suite 900',
    cityStateZip: 'San Francisco, CA 94103',
    mobile: '(123) 456-7890',
  },
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota issues
  }
}

function resolveProductImage(item) {
  const matched = PRODUCTS.find((p) => p.id === item.productId || p.id === item.id);
  if (matched) {
    return { ...item, image: matched.image };
  }
  return item;
}

export function getCart() {
  const cart = readJson('fiama_cart', DEFAULT_CART);
  return Array.isArray(cart) ? cart.map(resolveProductImage) : DEFAULT_CART;
}

export function saveCart(cart) {
  writeJson('fiama_cart', cart);
  window.dispatchEvent(new CustomEvent('fiama:store-updated'));
}

export function addToCart(product, qty = 1, color, size) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === product.id);
  let next;
  if (existing) {
    next = cart.map((item) =>
      item.productId === product.id
        ? {
            ...item,
            image: product.image,
            quantity: item.quantity + qty,
            color: color || item.color,
            size: size || item.size,
          }
        : item
    );
  } else {
    next = [
      ...cart,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: qty,
        color: color || product.colors[0],
        size: size || product.sizes[0],
      },
    ];
  }
  saveCart(next);
  return next;
}

export function updateCartQuantity(productId, qty) {
  const cart = getCart();
  if (qty <= 0) {
    return removeFromCart(productId);
  }
  const next = cart.map((item) =>
    item.productId === productId ? { ...item, quantity: qty } : item
  );
  saveCart(next);
  return next;
}

export function removeFromCart(productId) {
  const next = getCart().filter((item) => item.productId !== productId);
  saveCart(next);
  return next;
}

export function getCartMetrics() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const coupon = localStorage.getItem('fiama_coupon') || '';
  const discount = coupon ? Number((subtotal * 0.1).toFixed(2)) : 0;
  return { cart, count, subtotal, coupon, discount };
}

export function applyCouponCode(code) {
  const normalized = (code || '').trim().toUpperCase();
  if (!normalized) {
    return { ok: false, message: 'Please enter a coupon code (try FIAMA10).' };
  }
  if (['FIAMA10', 'SAVE10', 'FLOWER10'].includes(normalized)) {
    localStorage.setItem('fiama_coupon', normalized);
    window.dispatchEvent(new CustomEvent('fiama:store-updated'));
    return { ok: true, message: `Coupon ${normalized} applied: 10% discount.` };
  }
  return { ok: false, message: 'Invalid coupon code. Try FIAMA10 for 10% off.' };
}

export function getWishlist() {
  const list = readJson('fiama_wishlist', DEFAULT_WISHLIST);
  return Array.isArray(list) ? list.map(resolveProductImage) : DEFAULT_WISHLIST;
}

export function addToWishlist(product) {
  const list = getWishlist();
  if (!list.some((p) => p.id === product.id)) {
    list.push(product);
    writeJson('fiama_wishlist', list);
    window.dispatchEvent(new CustomEvent('fiama:store-updated'));
  }
}

export function removeFromWishlist(productId) {
  const next = getWishlist().filter((p) => p.id !== productId);
  writeJson('fiama_wishlist', next);
  window.dispatchEvent(new CustomEvent('fiama:store-updated'));
  return next;
}

export function isInWishlist(productId) {
  return getWishlist().some((p) => p.id === productId);
}

export function getUser() {
  return readJson('fiama_user', DEFAULT_USER);
}

export function saveUser(user) {
  writeJson('fiama_user', user);
}

export function getOrders() {
  return readJson('fiama_orders', INITIAL_ORDERS);
}

export function placeOrder() {
  const { cart, count, subtotal, discount } = getCartMetrics();
  const shipping = cart.length > 0 ? 15 : 0;
  const total = Math.max(0, subtotal - discount + shipping);
  const orders = getOrders();
  const newOrder = {
    id: orders.length + 1,
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    status: 'Pending',
    total,
    itemsCount: count,
  };
  writeJson('fiama_orders', [newOrder, ...orders]);
  localStorage.removeItem('fiama_coupon');
  saveCart([]);
  return newOrder;
}

export function getReviews(productId) {
  return readJson(`fiama_reviews_${productId}`, INITIAL_REVIEWS);
}

export function addReview(productId, review) {
  const list = getReviews(productId);
  const next = [{ id: list.length + 1, ...review }, ...list];
  writeJson(`fiama_reviews_${productId}`, next);
  return next;
}

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === Number(id)) || PRODUCTS[8];
}
