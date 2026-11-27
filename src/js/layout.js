import { BRAND_LOGOS, PRODUCTS } from './data.js';
import {
  addToCart,
  addToWishlist,
  getCartMetrics,
  isInWishlist,
  removeFromCart,
} from './store.js';

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderStars(rating, sizeClass = 'h-3 w-3') {
  const rounded = Math.round(rating || 5);
  let html = '';
  for (let i = 1; i <= 5; i++) {
    const filled = i <= rounded;
    html += `<svg viewBox="0 0 24 24" class="${sizeClass} ${
      filled ? 'fill-[#FFB800] text-[#FFB800]' : 'fill-none text-[#D5D5D5]'
    }" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }
  return html;
}

export function renderProductCardHtml(product, { variant = 'grid', showRating = false } = {}) {
  const wishlisted = isInWishlist(product.id);
  const badgeHtml = product.badge
    ? `<span class="absolute top-3.5 left-0 z-10 rounded-r-[3px] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white ${
        product.badge.type === 'hot' ? 'bg-[#E55472]' : 'bg-[#8CB83F]'
      }">${escapeHtml(product.badge.text)}</span>`
    : '';

  if (variant === 'list') {
    return `
      <div class="flex flex-col sm:flex-row gap-6 border border-[#F0F0F0] bg-white p-4 sm:p-5 transition-shadow duration-300 hover:shadow-md">
        <div class="relative aspect-[3/3.4] w-full sm:w-[220px] shrink-0 bg-[#F7F7F7] overflow-hidden group">
          <a href="/product-details.html?id=${product.id}" class="block h-full w-full">
            <img src="${product.image}" alt="${escapeHtml(product.name)}" class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
          </a>
          ${badgeHtml}
        </div>
        <div class="flex flex-1 flex-col justify-center">
          <a href="/product-details.html?id=${product.id}" class="text-left text-[17px] font-semibold text-[#010101] hover:text-[#E55472] transition-colors">
            ${escapeHtml(product.name)}
          </a>
          <div class="mt-2 flex items-center gap-2 text-[16px] font-semibold tabular-nums">
            <span class="text-[#E55472]">$${product.price.toFixed(2)}</span>
            ${product.oldPrice ? `<del class="text-[14px] font-normal text-[#999999]">$${product.oldPrice.toFixed(2)}</del>` : ''}
          </div>
          <div class="mt-2 flex items-center gap-1">
            ${renderStars(product.rating, 'h-3.5 w-3.5')}
            <span class="ml-1 text-[12px] text-[#888888]">(${product.reviewCount})</span>
          </div>
          <p class="mt-3 text-[13px] leading-relaxed text-[#666666] line-clamp-2">
            ${escapeHtml(product.shortDescription)}
          </p>
          <div class="mt-5 flex flex-wrap items-center gap-2">
            <button type="button" data-action="add-to-cart" data-id="${product.id}" class="flex items-center gap-2 bg-[#565656] px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#E55472] transition-colors duration-200 cursor-pointer">
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              ADD TO CART
            </button>
            <button type="button" data-action="quick-view" data-id="${product.id}" title="Quick View" class="flex h-9 w-9 items-center justify-center border border-[#E5E5E5] text-[#565656] hover:border-[#E55472] hover:bg-[#E55472] hover:text-white transition-colors duration-200 cursor-pointer">
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <button type="button" data-action="add-to-wishlist" data-id="${product.id}" title="Add to Wishlist" class="flex h-9 w-9 items-center justify-center border transition-colors duration-200 cursor-pointer ${
              wishlisted
                ? 'border-[#E55472] bg-[#E55472] text-white'
                : 'border-[#E5E5E5] text-[#565656] hover:border-[#E55472] hover:bg-[#E55472] hover:text-white'
            }">
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  const countdownHtml = product.hasCountdown
    ? `<div id="countdown-strip" class="absolute bottom-3 right-3 z-10 flex flex-col gap-1 bg-white/95 px-2.5 py-2 text-center shadow-sm transition-all duration-500 ease-out group-hover:translate-x-10 group-hover:opacity-0 pointer-events-none">
        <div class="leading-none py-0.5"><div data-cd="days" class="text-[11px] font-bold text-[#010101] tabular-nums">394</div><div class="text-[8px] font-medium uppercase tracking-wider text-[#666666]">DAYS</div></div>
        <div class="leading-none py-0.5"><div data-cd="hrs" class="text-[11px] font-bold text-[#010101] tabular-nums">08</div><div class="text-[8px] font-medium uppercase tracking-wider text-[#666666]">HRS</div></div>
        <div class="leading-none py-0.5"><div data-cd="mins" class="text-[11px] font-bold text-[#010101] tabular-nums">18</div><div class="text-[8px] font-medium uppercase tracking-wider text-[#666666]">MINS</div></div>
        <div class="leading-none py-0.5"><div data-cd="secs" class="text-[11px] font-bold text-[#010101] tabular-nums">38</div><div class="text-[8px] font-medium uppercase tracking-wider text-[#666666]">SECS</div></div>
      </div>`
    : '';

  return `
    <div class="group text-center">
      <div class="relative aspect-[3/3.65] w-full overflow-hidden bg-[#F7F7F7]">
        <a href="/product-details.html?id=${product.id}" class="block h-full w-full">
          <img src="${product.image}" alt="${escapeHtml(product.name)}" class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        </a>
        ${badgeHtml}
        ${countdownHtml}
        <div class="absolute inset-x-0 bottom-0 z-20 flex translate-y-full items-stretch bg-[#565656] text-white opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <button type="button" data-action="quick-view" data-id="${product.id}" title="Quick View" class="flex w-10 sm:w-11 items-center justify-center border-r border-white/15 py-2.5 hover:bg-[#E55472] transition-colors duration-200 cursor-pointer">
            <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <button type="button" data-action="add-to-cart" data-id="${product.id}" title="Add to Cart" class="flex flex-1 items-center justify-center py-2.5 text-[11px] font-semibold uppercase tracking-wider hover:bg-[#E55472] transition-colors duration-200 cursor-pointer whitespace-nowrap px-2">
            <span class="hidden xl:inline">ADD TO CART</span>
            <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 xl:hidden" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
          <button type="button" data-action="add-to-wishlist" data-id="${product.id}" title="Add to Wishlist" class="flex w-10 sm:w-11 items-center justify-center border-l border-white/15 py-2.5 transition-colors duration-200 cursor-pointer ${
            wishlisted ? 'bg-[#E55472]' : 'hover:bg-[#E55472]'
          }">
            <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
          </button>
        </div>
      </div>
      <div class="pt-3.5 pb-1">
        ${showRating ? `<div class="mb-1.5 flex items-center justify-center gap-0.5">${renderStars(product.rating)}</div>` : ''}
        <h2 class="text-[12px] sm:text-[13px] font-medium uppercase tracking-wide text-[#010101]">
          <a href="/product-details.html?id=${product.id}" class="hover:text-[#E55472] transition-colors duration-200">${escapeHtml(product.name)}</a>
        </h2>
        <div class="mt-1 flex items-center justify-center gap-2 text-[13px] sm:text-[14px] font-semibold tabular-nums">
          <span class="text-[#010101]">$${product.price.toFixed(2)}</span>
          ${product.oldPrice ? `<del class="text-[12px] font-normal text-[#999999]">$${product.oldPrice.toFixed(2)}</del>` : ''}
        </div>
      </div>
    </div>
  `;
}

export function initSharedLayout(activePage) {
  const headerEl = document.getElementById('site-header');
  const brandEl = document.getElementById('brand-logos');
  const footerEl = document.getElementById('site-footer');
  const modalsEl = document.getElementById('site-modals');

  const navLinkClass = (isActive) =>
    `text-[13px] font-medium uppercase tracking-[0.06em] whitespace-nowrap shrink-0 transition-colors duration-200 ${
      isActive ? 'text-[#E55472]' : 'text-[#010101] hover:text-[#E55472]'
    }`;

  if (headerEl) {
    const initialSearch = new URLSearchParams(window.location.search).get('q') || '';
    headerEl.innerHTML = `
      <header class="relative z-40 bg-white">
        <!-- Mobile / Tablet Header (< 1024px) matching Fiama 500px mobile layout -->
        <div class="lg:hidden border-b border-[#F0F0F0] bg-white">
          <div class="flex items-center justify-center py-5 px-4">
            <a href="/index.html" class="block leading-none">
              <img src="/assets/aistudio/logo_8f140d5f.png" alt="Fiama" class="h-[26px] sm:h-[30px] w-auto object-contain block" />
            </a>
          </div>
          <div class="border-t border-[#F4F4F4] py-3 px-4 flex items-center justify-center gap-8">
            <button id="open-mini-cart-mobile" type="button" class="flex items-center gap-3 group cursor-pointer" aria-label="Open shopping cart">
              <div class="relative">
                <svg viewBox="0 0 24 24" class="h-6 w-6 text-[#333333] group-hover:text-[#E55472] transition-colors" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span data-cart-count class="absolute -top-1.5 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E55472] px-1 text-[10px] font-semibold text-white tabular-nums">0</span>
              </div>
              <div class="text-left leading-tight">
                <div class="text-[10px] font-medium uppercase tracking-wider text-[#666666]">YOUR CART</div>
                <div data-cart-total class="text-[12px] font-semibold text-[#E55472] tabular-nums">$0.00</div>
              </div>
            </button>

            <button id="open-mobile-menu-btn" type="button" aria-label="Open navigation menu" class="p-1.5 text-[#010101] hover:text-[#E55472] transition-colors cursor-pointer">
              <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Desktop Header (>= 1024px) -->
        <div class="hidden lg:block border-b border-[#EDEDED]">
          <div class="mx-auto flex max-w-[1170px] items-center justify-between gap-4 px-[15px] py-6">
            <a href="/index.html" class="block leading-none shrink-0">
              <img src="/assets/aistudio/logo_8f140d5f.png" alt="Fiama" class="h-[28px] lg:h-[30px] w-auto object-contain block" />
            </a>

            <div class="flex items-center gap-3 shrink-0">
              <svg viewBox="0 0 24 24" class="h-5 w-5 text-[#565656]" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <div class="leading-tight">
                <div class="text-[11px] font-medium uppercase tracking-wider text-[#666666]">PHONE</div>
                <a href="tel:+0123456789" class="text-[13px] font-semibold text-[#010101] hover:text-[#E55472] transition-colors tabular-nums">+0123-456-789</a>
              </div>
            </div>

            <form id="header-search-form" class="flex flex-1 max-w-[440px] items-center relative">
              <input id="header-search-input" type="text" value="${escapeHtml(initialSearch)}" placeholder="Search here..." class="w-full h-[44px] rounded-full border border-[#E5E5E5] bg-white pl-5 pr-12 text-[13px] text-[#010101] placeholder:text-[#999999] focus:border-[#E55472] focus:outline-none transition-colors" />
              <button type="submit" aria-label="Search products" class="absolute right-4 text-[#565656] hover:text-[#E55472] transition-colors cursor-pointer">
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
            </form>

            <div class="flex items-center gap-5 shrink-0">
              <a href="/account.html" title="My Account" class="flex items-center justify-center text-[#565656] hover:text-[#E55472] transition-colors">
                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </a>

              <button id="open-mini-cart-btn" type="button" class="flex items-center gap-3 group cursor-pointer" aria-label="Open shopping cart">
                <div class="relative">
                  <svg viewBox="0 0 24 24" class="h-6 w-6 text-[#333333] group-hover:text-[#E55472] transition-colors" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  <span data-cart-count class="absolute -top-1.5 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E55472] px-1 text-[10px] font-semibold text-white tabular-nums">0</span>
                </div>
                <div class="text-left leading-tight">
                  <div class="text-[11px] font-medium uppercase tracking-wider text-[#666666]">YOUR CART</div>
                  <div data-cart-total class="text-[13px] font-semibold text-[#E55472] tabular-nums">$0.00</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div id="sticky-nav-bar" class="hidden lg:block bg-white transition-shadow duration-200">
          <div class="mx-auto flex max-w-[1170px] items-center justify-center px-[15px]">
            <nav class="flex items-center gap-9 py-4">
              <a href="/index.html" class="${navLinkClass(activePage === 'home')}">HOME</a>

              <div class="relative group py-1">
                <a href="/shop-left-sidebar.html" class="flex items-center gap-1 ${navLinkClass(['login','register','account','wishlist','cart','checkout'].includes(activePage))}">
                  PAGES
                  <svg viewBox="0 0 24 24" class="h-3 w-3 opacity-60 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                </a>
                <div class="invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 absolute left-0 top-full w-52 bg-white border border-[#F0F0F0] shadow-lg py-2.5 transition-all duration-200 z-50">
                  <a href="/shop-left-sidebar.html" class="block px-5 py-2 text-[13px] text-[#565656] hover:text-[#E55472] hover:bg-[#F9F9F9] transition-colors">Shop Left Sidebar</a>
                  <a href="/product-details.html" class="block px-5 py-2 text-[13px] text-[#565656] hover:text-[#E55472] hover:bg-[#F9F9F9] transition-colors">Product Details</a>
                  <a href="/cart.html" class="block px-5 py-2 text-[13px] text-[#565656] hover:text-[#E55472] hover:bg-[#F9F9F9] transition-colors">Cart</a>
                  <a href="/wishlist.html" class="block px-5 py-2 text-[13px] text-[#565656] hover:text-[#E55472] hover:bg-[#F9F9F9] transition-colors">Wishlist</a>
                  <a href="/checkout.html" class="block px-5 py-2 text-[13px] text-[#565656] hover:text-[#E55472] hover:bg-[#F9F9F9] transition-colors">Checkout</a>
                  <a href="/account.html" class="block px-5 py-2 text-[13px] text-[#565656] hover:text-[#E55472] hover:bg-[#F9F9F9] transition-colors">My Account</a>
                  <a href="/login.html" class="block px-5 py-2 text-[13px] text-[#565656] hover:text-[#E55472] hover:bg-[#F9F9F9] transition-colors">Login</a>
                  <a href="/register.html" class="block px-5 py-2 text-[13px] text-[#565656] hover:text-[#E55472] hover:bg-[#F9F9F9] transition-colors">Register</a>
                  <a href="/contact.html" class="block px-5 py-2 text-[13px] text-[#565656] hover:text-[#E55472] hover:bg-[#F9F9F9] transition-colors">Contact Us</a>
                </div>
              </div>

              <div class="relative group py-1">
                <a href="/shop-left-sidebar.html" class="flex items-center gap-1 ${navLinkClass(['shop','product-details'].includes(activePage))}">
                  SHOP
                  <svg viewBox="0 0 24 24" class="h-3 w-3 opacity-60 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                </a>
                <div class="invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 absolute left-0 top-full w-52 bg-white border border-[#F0F0F0] shadow-lg py-2.5 transition-all duration-200 z-50">
                  <a href="/shop-left-sidebar.html" class="block px-5 py-2 text-[13px] text-[#565656] hover:text-[#E55472] hover:bg-[#F9F9F9] transition-colors">Shop Left Sidebar</a>
                  <a href="/product-details.html" class="block px-5 py-2 text-[13px] text-[#565656] hover:text-[#E55472] hover:bg-[#F9F9F9] transition-colors">Product Details</a>
                  <a href="/cart.html" class="block px-5 py-2 text-[13px] text-[#565656] hover:text-[#E55472] hover:bg-[#F9F9F9] transition-colors">Shopping Cart</a>
                  <a href="/wishlist.html" class="block px-5 py-2 text-[13px] text-[#565656] hover:text-[#E55472] hover:bg-[#F9F9F9] transition-colors">Wishlist</a>
                  <a href="/checkout.html" class="block px-5 py-2 text-[13px] text-[#565656] hover:text-[#E55472] hover:bg-[#F9F9F9] transition-colors">Checkout</a>
                </div>
              </div>

              <a href="/shop-left-sidebar.html" class="${navLinkClass(false)}">PORTFOLIO</a>
              <a href="/index.html#latest-news" class="${navLinkClass(false)}">NEWS</a>
              <a href="/contact.html" class="${navLinkClass(activePage === 'contact')}">CONTACT</a>
            </nav>
          </div>
        </div>
        <div id="sticky-nav-spacer" class="hidden h-[53px]"></div>

        <!-- Mobile Menu Drawer -->
        <div id="mobile-menu-drawer" class="fixed inset-0 z-50 pointer-events-none opacity-0 transition-opacity duration-300 lg:hidden flex">
          <div id="mobile-menu-backdrop" class="fixed inset-0 bg-black/50"></div>
          <div id="mobile-menu-panel" class="relative z-10 w-[300px] max-w-[85vw] bg-white h-full overflow-y-auto p-6 shadow-2xl flex flex-col -translate-x-full transition-transform duration-300 ease-out">
            <div class="flex items-center justify-between border-b border-[#EDEDED] pb-4 mb-5">
              <a href="/index.html" class="block leading-none">
                <img src="/assets/aistudio/logo_8f140d5f.png" alt="Fiama" class="h-[26px] w-auto object-contain block" />
              </a>
              <button id="close-mobile-menu-btn" type="button" aria-label="Close menu" class="p-1.5 text-[#565656] hover:text-[#E55472] transition-colors cursor-pointer">
                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <form id="mobile-search-form" class="relative mb-6">
              <input id="mobile-search-input" type="text" placeholder="Search here..." class="w-full h-10 border border-[#E5E5E5] px-3 pr-9 text-[13px] focus:border-[#E55472] focus:outline-none" />
              <button type="submit" aria-label="Search" class="absolute right-3 top-2.5 text-[#565656] hover:text-[#E55472] cursor-pointer">
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
            </form>
            <nav class="flex flex-col divide-y divide-[#F0F0F0]">
              <a href="/index.html" class="py-3 text-[13px] font-medium uppercase tracking-wider ${activePage === 'home' ? 'text-[#E55472]' : 'text-[#333333] hover:text-[#E55472]'} transition-colors">Home</a>
              <a href="/shop-left-sidebar.html" class="py-3 text-[13px] font-medium uppercase tracking-wider ${activePage === 'shop' ? 'text-[#E55472]' : 'text-[#333333] hover:text-[#E55472]'} transition-colors">Shop Left Sidebar</a>
              <a href="/product-details.html" class="py-3 text-[13px] font-medium uppercase tracking-wider ${activePage === 'product-details' ? 'text-[#E55472]' : 'text-[#333333] hover:text-[#E55472]'} transition-colors">Product Details</a>
              <a href="/cart.html" class="py-3 text-[13px] font-medium uppercase tracking-wider ${activePage === 'cart' ? 'text-[#E55472]' : 'text-[#333333] hover:text-[#E55472]'} transition-colors">Cart</a>
              <a href="/wishlist.html" class="py-3 text-[13px] font-medium uppercase tracking-wider ${activePage === 'wishlist' ? 'text-[#E55472]' : 'text-[#333333] hover:text-[#E55472]'} transition-colors">Wishlist</a>
              <a href="/checkout.html" class="py-3 text-[13px] font-medium uppercase tracking-wider ${activePage === 'checkout' ? 'text-[#E55472]' : 'text-[#333333] hover:text-[#E55472]'} transition-colors">Checkout</a>
              <a href="/account.html" class="py-3 text-[13px] font-medium uppercase tracking-wider ${activePage === 'account' ? 'text-[#E55472]' : 'text-[#333333] hover:text-[#E55472]'} transition-colors">My Account</a>
              <a href="/login.html" class="py-3 text-[13px] font-medium uppercase tracking-wider ${activePage === 'login' ? 'text-[#E55472]' : 'text-[#333333] hover:text-[#E55472]'} transition-colors">Login</a>
              <a href="/register.html" class="py-3 text-[13px] font-medium uppercase tracking-wider ${activePage === 'register' ? 'text-[#E55472]' : 'text-[#333333] hover:text-[#E55472]'} transition-colors">Register</a>
              <a href="/contact.html" class="py-3 text-[13px] font-medium uppercase tracking-wider ${activePage === 'contact' ? 'text-[#E55472]' : 'text-[#333333] hover:text-[#E55472]'} transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>
    `;
  }

  if (brandEl) {
    brandEl.innerHTML = `
      <div class="bg-[#F7F7F7] py-12 border-t border-[#EEEEEE]">
        <div class="mx-auto max-w-[1170px] px-[15px]">
          <div class="overflow-hidden">
            <div id="brand-logo-track" class="flex transition-transform duration-500 ease-out">
              ${BRAND_LOGOS.map(
                (b) => `
                <div class="w-1/2 sm:w-1/3 lg:w-1/6 shrink-0 px-[15px] flex items-center justify-center">
                  <img src="${b.image}" alt="${escapeHtml(b.alt)}" class="max-h-14 w-auto object-contain opacity-65 hover:opacity-100 transition-all duration-300 hover:scale-105 select-none" />
                </div>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (footerEl) {
    const cols = [
      {
        title: 'MY ACCOUNT',
        links: [
          ['My account', '/account.html'],
          ['Checkout', '/checkout.html'],
          ['Contact us', '/contact.html'],
          ['Shopping Cart', '/cart.html'],
          ['Wishlist', '/wishlist.html'],
        ],
      },
      {
        title: 'QUICK LINKS',
        links: [
          ['Store Location', '/contact.html'],
          ['Orders Tracking', '/account.html'],
          ['Size Guide', '/shop-left-sidebar.html'],
          ['My account', '/account.html'],
          ['FAQs', '/contact.html'],
        ],
      },
      {
        title: 'INFORMATION',
        links: [
          ['Privacy Page', '/contact.html'],
          ['About us', '/contact.html'],
          ['Careers', '/contact.html'],
          ['Delivery Information', '/checkout.html'],
          ['Term & Conditions', '/register.html'],
        ],
      },
      {
        title: 'CUSTOMER SERVICE',
        links: [
          ['Shipping Policy', '/checkout.html'],
          ['Help & Contact Us', '/contact.html'],
          ['Returns & Refunds', '/account.html'],
          ['Online Stores', '/shop-left-sidebar.html'],
          ['Terms and Conditions', '/register.html'],
        ],
      },
    ];

    footerEl.innerHTML = `
      <footer class="relative bg-[#272829] text-[#A9A9A9]">
        <div class="mx-auto max-w-[1170px] px-[15px] pt-16 pb-14">
          <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
            ${cols
              .map(
                (col) => `
              <div class="lg:col-span-2">
                <h4 class="mb-6 text-[13px] font-bold uppercase tracking-wider text-white">${col.title}</h4>
                <ul class="space-y-3">
                  ${col.links
                    .map(
                      ([label, href]) => `
                    <li>
                      <a href="${href}" class="group flex items-center text-[13px] text-[#9E9E9E] hover:text-[#E55472] transition-colors duration-200">
                        <span class="inline-block w-0 overflow-hidden opacity-0 group-hover:w-4 group-hover:opacity-100 text-[#E55472] transition-all duration-200">//</span>
                        <span>${label}</span>
                      </a>
                    </li>
                  `
                    )
                    .join('')}
                </ul>
              </div>
            `
              )
              .join('')}

            <div class="lg:col-span-4">
              <h4 class="mb-6 text-[13px] font-bold uppercase tracking-wider text-white">ABOUT OUR SHOP</h4>
              <p class="text-[13px] leading-relaxed text-[#9E9E9E] mb-5">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmo incididunt ut labore et dolore
              </p>
              <ul class="space-y-2.5 text-[13px] text-[#9E9E9E]">
                <li class="flex items-start gap-2.5">
                  <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 mt-0.5 text-[#9E9E9E]" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>Brooklyn, New York, United States</span>
                </li>
                <li class="flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 text-[#9E9E9E]" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <a href="tel:+0123456789" class="hover:text-[#E55472] transition-colors tabular-nums">+0123-456789</a>
                </li>
                <li class="flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 text-[#9E9E9E]" fill="none" stroke="currentColor" stroke-width="1.6"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <a href="mailto:example@example.com" class="hover:text-[#E55472] transition-colors">example@example.com</a>
                </li>
              </ul>
              <div class="mt-6 flex flex-wrap items-center gap-2">
                ${['VISA', 'PayPal', 'Master', 'AMEX', 'DISCOVER']
                  .map(
                    (c) =>
                      `<span class="inline-flex h-6 items-center justify-center rounded-[2px] bg-[#A6A6A6] px-2 text-[10px] font-bold tracking-tight text-[#272829]">${c}</span>`
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-white/10">
          <div class="mx-auto flex max-w-[1170px] flex-col sm:flex-row items-center justify-between gap-4 px-[15px] py-5">
            <p class="text-[12px] text-[#8E8E8E]">© 2026 - JUST FOR YOU</p>
            <div class="flex items-center gap-5 text-[13px] text-[#8E8E8E]">
              <a href="/index.html" class="hover:text-[#E55472] transition-colors font-semibold">f</a>
              <a href="/index.html" class="hover:text-[#E55472] transition-colors">𝕏</a>
              <a href="/index.html" class="hover:text-[#E55472] transition-colors font-semibold">P</a>
              <a href="/index.html" class="hover:text-[#E55472] transition-colors">IG</a>
            </div>
          </div>
        </div>

        <button id="scroll-to-top-btn" type="button" aria-label="Scroll to top" class="absolute right-8 -top-5 sm:top-auto sm:bottom-10 flex h-9 w-9 rotate-45 items-center justify-center bg-[#9E9E9E] text-[#272829] shadow-md hover:bg-[#E55472] hover:text-white transition-all duration-300 cursor-pointer">
          <svg viewBox="0 0 24 24" class="h-4 w-4 -rotate-45" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 15-6-6-6 6"/></svg>
        </button>
      </footer>
    `;
  }

  if (modalsEl) {
    modalsEl.innerHTML = `
      <!-- Mini-Cart Drawer -->
      <div id="mini-cart-drawer" class="fixed inset-0 z-50 pointer-events-none opacity-0 transition-opacity duration-300 flex justify-end">
        <div id="mini-cart-backdrop" class="fixed inset-0 bg-black/50"></div>
        <aside id="mini-cart-panel" class="relative z-10 flex h-full w-full max-w-[380px] flex-col bg-white shadow-2xl translate-x-full transition-transform duration-300 ease-out">
          <div class="flex items-center justify-between border-b border-[#EDEDED] px-7 py-5">
            <h4 class="text-[14px] font-bold uppercase tracking-wider text-[#010101]">CART</h4>
            <button id="close-mini-cart-btn" type="button" aria-label="Close cart drawer" class="text-[#333333] hover:text-[#E55472] transition-colors cursor-pointer">
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div id="mini-cart-items" class="flex-1 overflow-y-auto px-7 py-4"></div>
          <div class="border-t border-[#EDEDED] px-7 py-6">
            <div class="mb-5 flex items-center justify-between">
              <h5 class="text-[15px] font-bold text-[#010101]">Subtotal:</h5>
              <span id="mini-cart-subtotal" class="text-[16px] font-bold text-[#E55472] tabular-nums">$0.00</span>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-4">
              <a href="/cart.html" class="bg-[#E55472] py-3 text-center text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#d13f5e] transition-colors">VIEW CART</a>
              <a href="/checkout.html" class="bg-[#272829] py-3 text-center text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#E55472] transition-colors">CHECKOUT</a>
            </div>
            <p class="text-[12px] text-[#666666]">Free Shipping on All Orders Over $100!</p>
          </div>
        </aside>
      </div>

      <!-- Quick View Modal -->
      <div id="quick-view-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/55 p-4">
        <div id="quick-view-content" class="modal-pop relative w-full max-w-[900px] bg-white p-6 md:p-9 shadow-2xl max-h-[92vh] overflow-y-auto"></div>
      </div>

      <!-- Add To Cart Modal -->
      <div id="add-to-cart-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/55 p-4">
        <div id="add-to-cart-content" class="modal-pop relative w-full max-w-[540px] bg-white p-7 shadow-2xl"></div>
      </div>

      <!-- Wishlist Modal -->
      <div id="wishlist-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/55 p-4">
        <div id="wishlist-modal-content" class="modal-pop relative w-full max-w-[500px] bg-white p-7 shadow-2xl"></div>
      </div>
    `;
  }

  wireSharedEvents();
  refreshHeaderAndDrawer();
  initBrandCarousel();
}

function initBrandCarousel() {
  const track = document.getElementById('brand-logo-track');
  if (!track) return;
  let offset = 0;
  const syncBrand = () => {
    const visible = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 640 ? 3 : 2;
    const maxOffset = Math.max(0, BRAND_LOGOS.length - visible);
    if (maxOffset === 0) {
      offset = 0;
      track.style.transform = 'translateX(0%)';
      return;
    }
    offset = offset >= maxOffset ? 0 : offset + 1;
    track.style.transform = `translateX(-${(offset * 100) / visible}%)`;
  };
  setInterval(syncBrand, 4000);
  window.addEventListener('resize', () => {
    const visible = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 640 ? 3 : 2;
    if (BRAND_LOGOS.length <= visible) {
      offset = 0;
      track.style.transform = 'translateX(0%)';
    }
  });
}

export function refreshHeaderAndDrawer() {
  const { cart, count, subtotal } = getCartMetrics();
  const miniItemsEl = document.getElementById('mini-cart-items');
  const miniSubEl = document.getElementById('mini-cart-subtotal');

  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = String(count);
  });
  document.querySelectorAll('[data-cart-total]').forEach((el) => {
    el.textContent = `$${subtotal.toFixed(2)}`;
  });
  if (miniSubEl) miniSubEl.textContent = `$${subtotal.toFixed(2)}`;

  if (miniItemsEl) {
    if (cart.length === 0) {
      miniItemsEl.innerHTML = `<div class="py-16 text-center text-[14px] text-[#666666]">Your shopping cart is currently empty.</div>`;
    } else {
      miniItemsEl.innerHTML = `
        <div class="divide-y divide-[#F0F0F0]">
          ${cart
            .map(
              (item) => `
            <div class="flex items-center gap-4 py-4">
              <div class="relative h-[74px] w-[74px] shrink-0 bg-[#F7F7F7] overflow-hidden">
                <a href="/product-details.html?id=${item.productId}" class="block h-full w-full">
                  <img src="${item.image}" alt="${escapeHtml(item.name)}" class="h-full w-full object-cover" />
                </a>
                <button type="button" data-mini-remove="${item.productId}" title="Remove item" class="absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] text-[#333333] shadow hover:bg-[#E55472] hover:text-white transition-colors cursor-pointer">×</button>
              </div>
              <div class="min-w-0 flex-1">
                <h6 class="truncate text-[14px] font-semibold text-[#010101]">
                  <a href="/product-details.html?id=${item.productId}" class="hover:text-[#E55472] transition-colors">${escapeHtml(item.name)}</a>
                </h6>
                <p class="mt-1 text-[13px] text-[#666666] tabular-nums">${item.quantity} × $${item.price.toFixed(2)}</p>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      `;
    }
  }
}

export function openQuickViewModal(product) {
  const modal = document.getElementById('quick-view-modal');
  const content = document.getElementById('quick-view-content');
  if (!modal || !content || !product) return;

  let qty = 2;
  let selectedColor = product.colors[0] || '#E55472';
  let selectedSize = product.sizes[1] || product.sizes[0] || 'M';

  const renderModal = () => {
    content.innerHTML = `
      <button type="button" id="qv-close" aria-label="Close quick view" class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center bg-[#E55472] text-white hover:bg-[#d13f5e] transition-colors cursor-pointer">
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div class="md:col-span-6 bg-[#F7F7F7] aspect-[3/3.4] overflow-hidden flex items-center justify-center">
          <img src="${product.image}" alt="${escapeHtml(product.name)}" class="h-full w-full object-cover" />
        </div>
        <div class="md:col-span-6">
          <h3 class="text-[24px] font-semibold text-[#010101]">${escapeHtml(product.name)}</h3>
          <div class="mt-2 flex flex-wrap items-center gap-3">
            <span class="text-[20px] font-bold text-[#E55472] tabular-nums">$${product.price.toFixed(2)}</span>
            ${product.oldPrice ? `<del class="text-[16px] text-[#E55472]/50 tabular-nums">$${product.oldPrice.toFixed(2)}</del>` : ''}
            <div class="flex items-center gap-0.5 ml-1">
              ${renderStars(product.rating, 'h-3.5 w-3.5')}
              <span class="ml-1 text-[12px] text-[#FFB800]">( ${product.reviewCount} Reviews )</span>
            </div>
          </div>
          <p class="mt-4 text-[13px] leading-relaxed text-[#666666] border-b border-[#F0F0F0] pb-5">
            ${escapeHtml(product.shortDescription)}
          </p>
          <div class="mt-4">
            <div class="text-[13px] font-medium text-[#010101] mb-2">Color</div>
            <div class="flex flex-wrap items-center gap-2.5">
              ${product.colors
                .map(
                  (hex) => `<button type="button" data-qv-color="${hex}" style="background-color:${hex}" class="h-6 w-6 rounded-full border transition-transform cursor-pointer ${
                    selectedColor === hex ? 'ring-2 ring-[#E55472] ring-offset-2 scale-105 border-[#CCCCCC]' : 'border-[#DDDDDD]'
                  }"></button>`
                )
                .join('')}
            </div>
          </div>
          <div class="mt-4">
            <div class="text-[13px] font-medium text-[#010101] mb-2">Size</div>
            <div class="flex flex-wrap items-center gap-4">
              ${product.sizes
                .map(
                  (sz) => `<button type="button" data-qv-size="${sz}" class="text-[13px] font-medium transition-colors cursor-pointer ${
                    selectedSize === sz ? 'text-[#E55472] font-bold underline underline-offset-4' : 'text-[#666666] hover:text-[#010101]'
                  }">${sz}</button>`
                )
                .join('')}
            </div>
          </div>
          <div class="mt-6 flex flex-wrap items-center gap-3 border-b border-[#F0F0F0] pb-6">
            <div class="flex h-[46px] items-center border border-[#EAEAEA] bg-[#F7F7F7]">
              <button type="button" id="qv-minus" class="h-full w-9 text-[15px] text-[#333333] hover:text-[#E55472] cursor-pointer">-</button>
              <span class="w-10 text-center text-[13px] font-semibold text-[#010101] tabular-nums">${String(qty).padStart(2, '0')}</span>
              <button type="button" id="qv-plus" class="h-full w-9 text-[15px] text-[#333333] hover:text-[#E55472] cursor-pointer">+</button>
            </div>
            <button type="button" id="qv-add" class="h-[46px] bg-[#E55472] px-7 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#d13f5e] transition-colors cursor-pointer">ADD TO CART</button>
            <button type="button" id="qv-wish" aria-label="Add to wishlist" class="flex h-[46px] w-[46px] items-center justify-center border border-[#EAEAEA] text-[#565656] hover:border-[#E55472] hover:text-[#E55472] transition-colors cursor-pointer">
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
          </div>
          <div class="mt-4 flex items-center gap-4 text-[13px] text-[#666666]">
            <span class="font-medium text-[#010101]">Share:</span>
            <a href="/product-details.html?id=${product.id}" class="hover:text-[#E55472] transition-colors">f</a>
            <a href="/product-details.html?id=${product.id}" class="hover:text-[#E55472] transition-colors">𝕏</a>
            <a href="/product-details.html?id=${product.id}" class="hover:text-[#E55472] transition-colors">P</a>
            <a href="/product-details.html?id=${product.id}" class="hover:text-[#E55472] transition-colors">IG</a>
          </div>
        </div>
      </div>
    `;

    content.querySelector('#qv-close')?.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
    content.querySelector('#qv-minus')?.addEventListener('click', () => {
      qty = Math.max(1, qty - 1);
      renderModal();
    });
    content.querySelector('#qv-plus')?.addEventListener('click', () => {
      qty += 1;
      renderModal();
    });
    content.querySelectorAll('[data-qv-color]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedColor = btn.getAttribute('data-qv-color');
        renderModal();
      });
    });
    content.querySelectorAll('[data-qv-size]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedSize = btn.getAttribute('data-qv-size');
        renderModal();
      });
    });
    content.querySelector('#qv-add')?.addEventListener('click', () => {
      addToCart(product, qty, selectedColor, selectedSize);
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      openAddToCartModal(product);
    });
    content.querySelector('#qv-wish')?.addEventListener('click', () => {
      addToWishlist(product);
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      openWishlistModal(product);
    });
  };

  renderModal();
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

export function openAddToCartModal(product) {
  const modal = document.getElementById('add-to-cart-modal');
  const content = document.getElementById('add-to-cart-content');
  if (!modal || !content || !product) return;

  content.innerHTML = `
    <button type="button" id="atc-close" class="absolute top-3 right-3 flex h-7 w-7 items-center justify-center bg-[#F2F2F2] text-[#333333] hover:bg-[#E55472] hover:text-white transition-colors cursor-pointer">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
    <div class="flex flex-col sm:flex-row items-center gap-6">
      <div class="h-28 w-24 shrink-0 bg-[#F7F7F7] overflow-hidden">
        <img src="${product.image}" alt="${escapeHtml(product.name)}" class="h-full w-full object-cover" />
      </div>
      <div class="text-center sm:text-left">
        <h5 class="text-[17px] font-bold text-[#010101]">${escapeHtml(product.name)}</h5>
        <p class="mt-1.5 flex items-center justify-center sm:justify-start gap-1.5 text-[13px] text-[#565656]">
          <span class="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#8CB83F] text-white text-[10px] font-bold">✓</span>
          Successfully added to your Cart
        </p>
        <div class="mt-4 flex flex-wrap justify-center sm:justify-start gap-2.5">
          <a href="/cart.html" class="bg-[#E55472] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#d13f5e] transition-colors">View Cart</a>
          <a href="/checkout.html" class="bg-[#272829] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#E55472] transition-colors">Checkout</a>
        </div>
      </div>
    </div>
  `;

  content.querySelector('#atc-close')?.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

export function openWishlistModal(product) {
  const modal = document.getElementById('wishlist-modal');
  const content = document.getElementById('wishlist-modal-content');
  if (!modal || !content || !product) return;

  content.innerHTML = `
    <button type="button" id="wl-close" class="absolute top-3 right-3 flex h-7 w-7 items-center justify-center bg-[#F2F2F2] text-[#333333] hover:bg-[#E55472] hover:text-white transition-colors cursor-pointer">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
    <div class="flex flex-col sm:flex-row items-center gap-6">
      <div class="h-28 w-24 shrink-0 bg-[#F7F7F7] overflow-hidden">
        <img src="${product.image}" alt="${escapeHtml(product.name)}" class="h-full w-full object-cover" />
      </div>
      <div class="text-center sm:text-left">
        <h5 class="text-[17px] font-bold text-[#010101]">${escapeHtml(product.name)}</h5>
        <p class="mt-1.5 flex items-center justify-center sm:justify-start gap-1.5 text-[13px] text-[#565656]">
          <span class="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#8CB83F] text-white text-[10px] font-bold">✓</span>
          Successfully added to your Wishlist
        </p>
        <div class="mt-4">
          <a href="/wishlist.html" class="inline-block bg-[#E55472] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#d13f5e] transition-colors">View Wishlist</a>
        </div>
      </div>
    </div>
  `;

  content.querySelector('#wl-close')?.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function wireSharedEvents() {
  // Sticky Nav
  const stickyNav = document.getElementById('sticky-nav-bar');
  const spacer = document.getElementById('sticky-nav-spacer');
  window.addEventListener(
    'scroll',
    () => {
      if (!stickyNav || !spacer) return;
      if (window.scrollY > 140) {
        stickyNav.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'z-40', 'shadow-sm', 'sticky-anim');
        spacer.classList.remove('hidden');
        spacer.classList.add('lg:block');
      } else {
        stickyNav.classList.remove('fixed', 'top-0', 'left-0', 'right-0', 'z-40', 'shadow-sm', 'sticky-anim');
        spacer.classList.add('hidden');
        spacer.classList.remove('lg:block');
      }
    },
    { passive: true }
  );

  // Header & Mobile Search
  document.getElementById('header-search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('header-search-input')?.value.trim() || '';
    window.location.href = `/shop-left-sidebar.html${q ? `?q=${encodeURIComponent(q)}` : ''}`;
  });
  document.getElementById('mobile-search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('mobile-search-input')?.value.trim() || '';
    window.location.href = `/shop-left-sidebar.html${q ? `?q=${encodeURIComponent(q)}` : ''}`;
  });

  // Mini Cart Drawer with smooth transition
  const miniDrawer = document.getElementById('mini-cart-drawer');
  const miniPanel = document.getElementById('mini-cart-panel');
  const openMini = () => {
    miniDrawer?.classList.remove('pointer-events-none', 'opacity-0');
    miniDrawer?.classList.add('pointer-events-auto', 'opacity-100');
    miniPanel?.classList.remove('translate-x-full');
    miniPanel?.classList.add('translate-x-0');
  };
  const closeMini = () => {
    miniDrawer?.classList.add('pointer-events-none', 'opacity-0');
    miniDrawer?.classList.remove('pointer-events-auto', 'opacity-100');
    miniPanel?.classList.add('translate-x-full');
    miniPanel?.classList.remove('translate-x-0');
  };
  document.getElementById('open-mini-cart-btn')?.addEventListener('click', openMini);
  document.getElementById('open-mini-cart-mobile')?.addEventListener('click', openMini);
  document.getElementById('close-mini-cart-btn')?.addEventListener('click', closeMini);
  document.getElementById('mini-cart-backdrop')?.addEventListener('click', closeMini);

  // Mobile Menu Drawer with smooth transition
  const mobDrawer = document.getElementById('mobile-menu-drawer');
  const mobPanel = document.getElementById('mobile-menu-panel');
  const openMob = () => {
    mobDrawer?.classList.remove('pointer-events-none', 'opacity-0');
    mobDrawer?.classList.add('pointer-events-auto', 'opacity-100');
    mobPanel?.classList.remove('-translate-x-full');
    mobPanel?.classList.add('translate-x-0');
  };
  const closeMob = () => {
    mobDrawer?.classList.add('pointer-events-none', 'opacity-0');
    mobDrawer?.classList.remove('pointer-events-auto', 'opacity-100');
    mobPanel?.classList.add('-translate-x-full');
    mobPanel?.classList.remove('translate-x-0');
  };
  document.getElementById('open-mobile-menu-btn')?.addEventListener('click', openMob);
  document.getElementById('close-mobile-menu-btn')?.addEventListener('click', closeMob);
  document.getElementById('mobile-menu-backdrop')?.addEventListener('click', closeMob);

  // Scroll to top
  document.getElementById('scroll-to-top-btn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Backdrop click on modals
  ['quick-view-modal', 'add-to-cart-modal', 'wishlist-modal'].forEach((id) => {
    const el = document.getElementById(id);
    el?.addEventListener('click', (e) => {
      if (e.target === el) {
        el.classList.add('hidden');
        el.classList.remove('flex');
      }
    });
  });

  // Escape key closes active drawers/modals
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeMini();
    closeMob();
    ['quick-view-modal', 'add-to-cart-modal', 'wishlist-modal'].forEach((id) => {
      const el = document.getElementById(id);
      el?.classList.add('hidden');
      el?.classList.remove('flex');
    });
  });

  // Global delegation for product card buttons & mini-cart remove
  document.addEventListener('click', (e) => {
    const miniRem = e.target.closest('[data-mini-remove]');
    if (miniRem) {
      removeFromCart(Number(miniRem.getAttribute('data-mini-remove')));
      return;
    }
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;

    const action = actionBtn.getAttribute('data-action');
    const id = Number(actionBtn.getAttribute('data-id'));
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    if (action === 'quick-view') {
      openQuickViewModal(product);
    } else if (action === 'add-to-cart') {
      addToCart(product, 1);
      openAddToCartModal(product);
    } else if (action === 'add-to-wishlist') {
      addToWishlist(product);
      openWishlistModal(product);
    }
  });

  window.addEventListener('fiama:store-updated', refreshHeaderAndDrawer);
}
