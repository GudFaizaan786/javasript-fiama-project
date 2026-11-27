import {
  BLOG_POSTS,
  HERO_SLIDES,
  INITIAL_DOWNLOADS,
  PRODUCTS,
  SHOP_CATEGORIES,
  SHOP_COLORS,
  SHOP_SIZES,
  SHOP_TAGS,
} from './data.js';
import {
  escapeHtml,
  initSharedLayout,
  openAddToCartModal,
  openWishlistModal,
  renderProductCardHtml,
  renderStars,
} from './layout.js';
import {
  addReview,
  addToCart,
  addToWishlist,
  applyCouponCode,
  getCartMetrics,
  getOrders,
  getProductById,
  getReviews,
  getUser,
  getWishlist,
  placeOrder,
  removeFromCart,
  removeFromWishlist,
  saveUser,
  updateCartQuantity,
} from './store.js';

const page = document.body.dataset.page || 'home';
initSharedLayout(page);

/* =========================================================
   1. HOME PAGE
   ========================================================= */
if (page === 'home') {
  let slideIdx = 0;
  const heroSection = document.getElementById('hero-section');
  const heroTrack = document.getElementById('hero-track');
  const heroDotsWrap = document.getElementById('hero-dots');

  if (heroTrack && HERO_SLIDES.length) {
    heroTrack.innerHTML = HERO_SLIDES.map(
      (slide, idx) => `
      <div class="hero-slide ${idx === 0 ? 'slide-active' : ''} relative w-full shrink-0 ${slide.bgClass} bg-cover bg-right md:bg-center min-h-[430px] sm:min-h-[520px] lg:min-h-[600px] xl:min-h-[660px] flex items-center" style="background-image: url('${slide.image}')">
        <div class="absolute inset-0 bg-gradient-to-r from-white/60 via-white/25 to-transparent sm:hidden pointer-events-none"></div>
        <div class="relative z-10 mx-auto w-full max-w-[1170px] px-[15px]">
          <div class="w-full lg:w-7/12">
            <div class="slide-item-info max-w-[540px] py-16 md:py-24">
              <div class="slide-anim">
                <h1 class="text-[32px] sm:text-[46px] md:text-[56px] lg:text-[62px] font-bold leading-[1.15] text-[#3B3C3D]">${escapeHtml(slide.title)}</h1>
                <h6 class="mt-2 font-[Lora] text-[16px] sm:text-[20px] md:text-[22px] font-normal text-[#565656]">${escapeHtml(slide.subtitle)}</h6>
                <div class="w-[70px] h-[2px] bg-[#E55472] mt-4 mb-5"></div>
                <p class="text-[13px] sm:text-[14px] leading-[1.8] text-[#555555] max-w-[440px]">${escapeHtml(slide.description)}</p>
                <div class="mt-7">
                  <a href="/shop-left-sidebar.html" class="inline-block rounded-full bg-[#E55472] hover:bg-[#3B3C3D] px-8 sm:px-9 py-3 sm:py-3.5 text-[13px] sm:text-[14px] font-medium text-white shadow-sm transition-colors duration-300">
                    ${escapeHtml(slide.ctaText)}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    ).join('');
  }

  if (heroDotsWrap && HERO_SLIDES.length) {
    heroDotsWrap.innerHTML = HERO_SLIDES.map(
      (_, idx) => `
      <button type="button" data-hero-dot="${idx}" aria-label="Slide ${idx + 1}" class="h-2.5 w-2.5 rounded-full transition-all duration-300 cursor-pointer ${
        idx === 0 ? 'bg-[#E55472] scale-110' : 'bg-[#C8C4C2] hover:bg-[#E55472]'
      }"></button>
    `
    ).join('');
  }

  const updateSlide = (nextIndex) => {
    slideIdx = (nextIndex + HERO_SLIDES.length) % HERO_SLIDES.length;
    const slide = HERO_SLIDES[slideIdx];
    if (heroSection && slide) {
      heroSection.className = `group/hero relative w-full overflow-hidden ${slide.bgClass} transition-colors duration-500`;
    }
    if (heroTrack) {
      heroTrack.style.transition = 'transform 700ms cubic-bezier(0.25, 0.8, 0.25, 1)';
      heroTrack.style.transform = `translateX(-${slideIdx * 100}%)`;
      const slideEls = heroTrack.querySelectorAll('.hero-slide');
      slideEls.forEach((el, idx) => {
        el.classList.remove('slide-active');
        if (idx === slideIdx) {
          void el.offsetWidth;
          el.classList.add('slide-active');
        }
      });
    }
    document.querySelectorAll('[data-hero-dot]').forEach((dot, idx) => {
      dot.className = `h-2.5 w-2.5 rounded-full transition-all duration-300 cursor-pointer ${
        idx === slideIdx ? 'bg-[#E55472] scale-110' : 'bg-[#C8C4C2] hover:bg-[#E55472]'
      }`;
    });
  };

  document.getElementById('hero-prev')?.addEventListener('click', () => {
    updateSlide(slideIdx - 1);
  });
  document.getElementById('hero-next')?.addEventListener('click', () => {
    updateSlide(slideIdx + 1);
  });
  heroDotsWrap?.addEventListener('click', (e) => {
    const dot = e.target.closest('[data-hero-dot]');
    if (!dot) return;
    updateSlide(Number(dot.getAttribute('data-hero-dot')));
  });

  if (heroTrack) {
    let isDragging = false;
    let startX = 0;
    let deltaX = 0;

    const onStart = (clientX, target) => {
      if (target.closest('a, button')) return;
      isDragging = true;
      startX = clientX;
      deltaX = 0;
      heroTrack.style.transition = 'none';
    };

    const onMove = (clientX) => {
      if (!isDragging || !heroSection) return;
      deltaX = clientX - startX;
      const pct = (deltaX / Math.max(heroSection.offsetWidth, 1)) * 100;
      heroTrack.style.transform = `translateX(calc(-${slideIdx * 100}% + ${pct}%))`;
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      const threshold = Math.min(80, (heroSection?.offsetWidth || 400) * 0.15);
      if (deltaX < -threshold) {
        updateSlide(slideIdx + 1);
      } else if (deltaX > threshold) {
        updateSlide(slideIdx - 1);
      } else {
        heroTrack.style.transition = 'transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)';
        heroTrack.style.transform = `translateX(-${slideIdx * 100}%)`;
      }
    };

    heroTrack.addEventListener('mousedown', (e) => onStart(e.clientX, e.target));
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onEnd);

    heroTrack.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches[0]) onStart(e.touches[0].clientX, e.target);
      },
      { passive: true }
    );
    heroTrack.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches[0]) onMove(e.touches[0].clientX);
      },
      { passive: true }
    );
    heroTrack.addEventListener('touchend', onEnd);
  }

  const newArrivalsEl = document.getElementById('new-arrivals-grid');
  const topTrackEl = document.getElementById('top-products-track');
  const topDotsEl = document.getElementById('top-products-dots');
  const blogTrackEl = document.getElementById('latest-news-track');
  const blogDotsEl = document.getElementById('blog-dots');

  let topIdx = 0;
  let blogIdx = 0;
  const topProductsList = PRODUCTS.slice(0, 6);

  const getTopVisible = () => (window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : 2);
  const getBlogVisible = () => (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1);

  const syncTopCarousel = () => {
    if (!topTrackEl) return;
    const vis = getTopVisible();
    const maxIdx = Math.max(0, topProductsList.length - vis);
    topIdx = Math.min(topIdx, maxIdx);
    topTrackEl.style.transform = `translateX(-${(topIdx * 100) / vis}%)`;
    if (topDotsEl) {
      topDotsEl.innerHTML = Array.from({ length: maxIdx + 1 }, (_, i) => `
        <button type="button" data-top-dot="${i}" aria-label="Top products slide ${i + 1}" class="h-2.5 w-2.5 rounded-full transition-all duration-300 cursor-pointer ${
          i === topIdx ? 'bg-[#E55472] scale-110' : 'bg-[#CCCCCC] hover:bg-[#E55472]'
        }"></button>
      `).join('');
      topDotsEl.querySelectorAll('[data-top-dot]').forEach((btn) => {
        btn.addEventListener('click', () => {
          topIdx = Number(btn.getAttribute('data-top-dot'));
          syncTopCarousel();
        });
      });
    }
  };

  const syncBlogCarousel = () => {
    if (!blogTrackEl) return;
    const vis = getBlogVisible();
    const maxIdx = Math.max(0, BLOG_POSTS.length - vis);
    blogIdx = Math.min(blogIdx, maxIdx);
    blogTrackEl.style.transform = `translateX(-${(blogIdx * 100) / vis}%)`;
    if (blogDotsEl) {
      blogDotsEl.innerHTML = Array.from({ length: maxIdx + 1 }, (_, i) => `
        <button type="button" data-blog-dot="${i}" aria-label="Blog slide ${i + 1}" class="h-2.5 w-2.5 rounded-full transition-all duration-300 cursor-pointer ${
          i === blogIdx ? 'bg-[#E55472] scale-110' : 'bg-[#CCCCCC] hover:bg-[#E55472]'
        }"></button>
      `).join('');
      blogDotsEl.querySelectorAll('[data-blog-dot]').forEach((btn) => {
        btn.addEventListener('click', () => {
          blogIdx = Number(btn.getAttribute('data-blog-dot'));
          syncBlogCarousel();
        });
      });
    }
  };

  const renderHomeGrids = () => {
    if (newArrivalsEl) {
      newArrivalsEl.innerHTML = PRODUCTS.slice(0, 8)
        .map((p) => renderProductCardHtml(p))
        .join('');
    }
    if (topTrackEl) {
      topTrackEl.innerHTML = topProductsList
        .map((p) => `<div class="w-1/2 md:w-1/3 lg:w-1/4 shrink-0 px-2 sm:px-[15px]">${renderProductCardHtml(p)}</div>`)
        .join('');
      syncTopCarousel();
    }
  };

  renderHomeGrids();
  window.addEventListener('fiama:store-updated', renderHomeGrids);

  document.getElementById('top-products-prev')?.addEventListener('click', () => {
    const maxIdx = Math.max(0, topProductsList.length - getTopVisible());
    topIdx = topIdx <= 0 ? maxIdx : topIdx - 1;
    syncTopCarousel();
  });
  document.getElementById('top-products-next')?.addEventListener('click', () => {
    const maxIdx = Math.max(0, topProductsList.length - getTopVisible());
    topIdx = topIdx >= maxIdx ? 0 : topIdx + 1;
    syncTopCarousel();
  });

  if (blogTrackEl) {
    blogTrackEl.innerHTML = BLOG_POSTS.map(
      (post) => `
      <article class="group w-full md:w-1/2 lg:w-1/3 shrink-0 px-2 sm:px-[15px]">
        <a href="/index.html#latest-news" class="block aspect-[16/10.5] overflow-hidden bg-[#F5F5F5]">
          <img src="${post.image}" alt="${escapeHtml(post.title)}" class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        </a>
        <div class="pt-4">
          <div class="flex items-center gap-4 text-[12px] text-[#777777]">
            <span>${post.date}</span>
            <span class="inline-flex items-center gap-1">
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              ${post.comments}
            </span>
          </div>
          <h3 class="mt-2.5 text-[16px] font-semibold leading-snug text-[#010101]">
            <a href="/index.html#latest-news" class="hover:text-[#E55472] transition-colors duration-200">${escapeHtml(post.title)}</a>
          </h3>
          <div class="mt-4 h-[1.5px] w-14 bg-[#E55472]/60 group-hover:w-28 transition-all duration-300"></div>
        </div>
      </article>
    `
    ).join('');
    syncBlogCarousel();
  }

  document.getElementById('blog-prev')?.addEventListener('click', () => {
    const maxIdx = Math.max(0, BLOG_POSTS.length - getBlogVisible());
    blogIdx = blogIdx <= 0 ? maxIdx : blogIdx - 1;
    syncBlogCarousel();
  });
  document.getElementById('blog-next')?.addEventListener('click', () => {
    const maxIdx = Math.max(0, BLOG_POSTS.length - getBlogVisible());
    blogIdx = blogIdx >= maxIdx ? 0 : blogIdx + 1;
    syncBlogCarousel();
  });

  window.addEventListener('resize', () => {
    syncTopCarousel();
    syncBlogCarousel();
  });

  let cdSecs = 394 * 86400 + 8 * 3600 + 18 * 60 + 38;
  setInterval(() => {
    cdSecs = cdSecs > 0 ? cdSecs - 1 : 0;
    const strip = document.getElementById('countdown-strip');
    if (!strip) return;
    const d = Math.floor(cdSecs / 86400);
    const h = Math.floor((cdSecs % 86400) / 3600);
    const m = Math.floor((cdSecs % 3600) / 60);
    const s = cdSecs % 60;
    const dEl = strip.querySelector('[data-cd="days"]');
    const hEl = strip.querySelector('[data-cd="hrs"]');
    const mEl = strip.querySelector('[data-cd="mins"]');
    const sEl = strip.querySelector('[data-cd="secs"]');
    if (dEl) dEl.textContent = String(d);
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

/* =========================================================
   2. SHOP LEFT SIDEBAR PAGE
   ========================================================= */
if (page === 'shop') {
  const params = new URLSearchParams(window.location.search);
  const state = {
    search: params.get('q') || '',
    maxPrice: 65,
    category: 'All Categories',
    color: null,
    size: null,
    tag: null,
    sortBy: 'default',
    viewMode: 'grid',
    pageNum: 1,
  };

  const searchInput = document.getElementById('shop-search-input');
  const priceRange = document.getElementById('shop-price-range');
  const priceLabel = document.getElementById('shop-price-label');
  const sortSelect = document.getElementById('shop-sort-select');
  const gridBtn = document.getElementById('shop-view-grid');
  const listBtn = document.getElementById('shop-view-list');
  const resetBtn = document.getElementById('shop-reset-btn');

  if (searchInput) searchInput.value = state.search;

  const renderSidebarOptions = () => {
    const catList = document.getElementById('shop-categories');
    if (catList) {
      catList.innerHTML = SHOP_CATEGORIES.map(
        (cat) => `
        <li>
          <button type="button" data-cat="${escapeHtml(cat)}" class="text-[13px] transition-colors cursor-pointer ${
            state.category === cat ? 'font-semibold text-[#E55472]' : 'text-[#666666] hover:text-[#E55472]'
          }">${escapeHtml(cat)}</button>
        </li>`
      ).join('');
    }

    const colorList = document.getElementById('shop-colors');
    if (colorList) {
      colorList.innerHTML = SHOP_COLORS.map(
        (c) => `
        <button type="button" data-color="${c.hex}" title="${c.label}" style="background-color:${c.hex}" class="h-6 w-6 rounded-full border transition-transform cursor-pointer ${
          state.color === c.hex ? 'ring-2 ring-[#E55472] ring-offset-2 scale-110 border-[#CCCCCC]' : 'border-[#DCDCDC]'
        }"></button>`
      ).join('');
    }

    const sizeList = document.getElementById('shop-sizes');
    if (sizeList) {
      sizeList.innerHTML = SHOP_SIZES.map(
        (sz) => `
        <button type="button" data-size="${sz}" class="text-[13px] font-medium transition-colors cursor-pointer ${
          state.size === sz ? 'font-bold text-[#E55472] underline underline-offset-4' : 'text-[#666666] hover:text-[#010101]'
        }">${sz}</button>`
      ).join('');
    }

    const tagList = document.getElementById('shop-tags');
    if (tagList) {
      tagList.innerHTML = SHOP_TAGS.map(
        (tag, i) => `
        <span class="inline-flex items-center gap-1.5">
          <button type="button" data-tag="${escapeHtml(tag)}" class="transition-colors cursor-pointer ${
            state.tag === tag ? 'font-semibold text-[#E55472]' : 'hover:text-[#E55472]'
          }">${escapeHtml(tag)}</button>
          ${i < SHOP_TAGS.length - 1 ? '<span class="text-[#CCCCCC]">/</span>' : ''}
        </span>`
      ).join('');
    }
  };

  const renderShopResults = () => {
    let list = [...PRODUCTS];
    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    list = list.filter((p) => p.price <= state.maxPrice);
    if (state.category !== 'All Categories') {
      list = list.filter((p) => p.category.toLowerCase() === state.category.toLowerCase());
    }
    if (state.color) list = list.filter((p) => p.colors.includes(state.color));
    if (state.size) list = list.filter((p) => p.sizes.includes(state.size));
    if (state.tag) {
      list = list.filter((p) => p.tags.some((t) => t.toLowerCase() === state.tag.toLowerCase()));
    }

    if (state.sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (state.sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (state.sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);

    const pageSize = 9;
    const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
    state.pageNum = Math.min(state.pageNum, totalPages);
    const visible = list.slice((state.pageNum - 1) * pageSize, state.pageNum * pageSize);

    const countEl = document.getElementById('shop-results-count');
    if (countEl) {
      countEl.textContent = `Showing ${visible.length} of ${list.length} results`;
    }

    const container = document.getElementById('shop-products-container');
    if (container) {
      if (visible.length === 0) {
        container.className = '';
        container.innerHTML = `
          <div class="border border-[#F0F0F0] bg-[#FAFAFA] py-20 text-center">
            <p class="text-[15px] text-[#565656]">No floral arrangements matched your active filters.</p>
            <button type="button" id="shop-empty-reset" class="mt-4 bg-[#E55472] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#d13f5e] cursor-pointer">Clear Filters</button>
          </div>
        `;
      } else if (state.viewMode === 'grid') {
        container.className = 'grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10';
        container.innerHTML = visible.map((p) => renderProductCardHtml(p)).join('');
      } else {
        container.className = 'space-y-6';
        container.innerHTML = visible.map((p) => renderProductCardHtml(p, { variant: 'list' })).join('');
      }
    }

    const pagEl = document.getElementById('shop-pagination');
    if (pagEl) {
      let btns = `<button type="button" data-page="${Math.max(1, state.pageNum - 1)}" class="flex h-10 w-10 items-center justify-center rounded-full border border-[#EDEDED] text-[#565656] hover:border-[#E55472] hover:text-[#E55472] cursor-pointer">‹</button>`;
      for (let i = 1; i <= totalPages; i++) {
        btns += `<button type="button" data-page="${i}" class="flex h-10 w-10 items-center justify-center rounded-full border text-[13px] font-semibold tabular-nums transition-colors cursor-pointer ${
          state.pageNum === i ? 'border-[#E55472] bg-[#E55472] text-white' : 'border-[#EDEDED] bg-white text-[#565656] hover:border-[#E55472] hover:text-[#E55472]'
        }">${i}</button>`;
      }
      btns += `<button type="button" data-page="${Math.min(totalPages, state.pageNum + 1)}" class="flex h-10 w-10 items-center justify-center rounded-full border border-[#EDEDED] text-[#565656] hover:border-[#E55472] hover:text-[#E55472] cursor-pointer">›</button>`;
      pagEl.innerHTML = btns;
    }

    const hasFilters =
      state.search ||
      state.maxPrice < 65 ||
      state.category !== 'All Categories' ||
      state.color ||
      state.size ||
      state.tag;
    resetBtn?.classList.toggle('hidden', !hasFilters);

    if (gridBtn && listBtn) {
      gridBtn.className = `flex h-10 w-10 items-center justify-center border transition-colors cursor-pointer ${
        state.viewMode === 'grid' ? 'border-[#E55472] bg-[#E55472] text-white' : 'border-[#EDEDED] bg-white text-[#565656] hover:border-[#E55472]'
      }`;
      listBtn.className = `flex h-10 w-10 items-center justify-center border transition-colors cursor-pointer ${
        state.viewMode === 'list' ? 'border-[#E55472] bg-[#E55472] text-white' : 'border-[#EDEDED] bg-white text-[#565656] hover:border-[#E55472]'
      }`;
    }
  };

  const resetAll = () => {
    state.search = '';
    state.maxPrice = 65;
    state.category = 'All Categories';
    state.color = null;
    state.size = null;
    state.tag = null;
    state.sortBy = 'default';
    state.pageNum = 1;
    if (searchInput) searchInput.value = '';
    if (priceRange) priceRange.value = '65';
    if (priceLabel) priceLabel.textContent = '$10 - $65';
    if (sortSelect) sortSelect.value = 'default';
    renderSidebarOptions();
    renderShopResults();
  };

  searchInput?.addEventListener('input', (e) => {
    state.search = e.target.value;
    state.pageNum = 1;
    renderShopResults();
  });
  priceRange?.addEventListener('input', (e) => {
    state.maxPrice = Number(e.target.value);
    if (priceLabel) priceLabel.textContent = `$10 - $${state.maxPrice}`;
    state.pageNum = 1;
    renderShopResults();
  });
  sortSelect?.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderShopResults();
  });
  gridBtn?.addEventListener('click', () => {
    state.viewMode = 'grid';
    renderShopResults();
  });
  listBtn?.addEventListener('click', () => {
    state.viewMode = 'list';
    renderShopResults();
  });
  resetBtn?.addEventListener('click', resetAll);

  document.addEventListener('click', (e) => {
    const cat = e.target.closest('[data-cat]');
    if (cat) {
      state.category = cat.getAttribute('data-cat');
      state.pageNum = 1;
      renderSidebarOptions();
      renderShopResults();
      return;
    }
    const color = e.target.closest('[data-color]');
    if (color) {
      const val = color.getAttribute('data-color');
      state.color = state.color === val ? null : val;
      state.pageNum = 1;
      renderSidebarOptions();
      renderShopResults();
      return;
    }
    const size = e.target.closest('[data-size]');
    if (size) {
      const val = size.getAttribute('data-size');
      state.size = state.size === val ? null : val;
      state.pageNum = 1;
      renderSidebarOptions();
      renderShopResults();
      return;
    }
    const tag = e.target.closest('[data-tag]');
    if (tag) {
      const val = tag.getAttribute('data-tag');
      state.tag = state.tag === val ? null : val;
      state.pageNum = 1;
      renderSidebarOptions();
      renderShopResults();
      return;
    }
    const pg = e.target.closest('[data-page]');
    if (pg) {
      state.pageNum = Number(pg.getAttribute('data-page'));
      renderShopResults();
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }
    if (e.target.closest('#shop-empty-reset')) {
      resetAll();
    }
  });

  renderSidebarOptions();
  renderShopResults();
  window.addEventListener('fiama:store-updated', renderShopResults);
}

/* =========================================================
   3. PRODUCT DETAILS PAGE
   ========================================================= */
if (page === 'product-details') {
  const id = new URLSearchParams(window.location.search).get('id') || '9';
  const product = getProductById(id);
  let activeImage = product.gallery[0] || product.image;
  let selectedColor = product.colors[0] || '#E55472';
  let selectedSize = product.sizes[1] || product.sizes[0] || 'M';
  let qty = 2;
  let activeTab = 'description';
  let reviewRating = 5;

  const renderPdpTop = () => {
    const root = document.getElementById('pdp-top-container');
    if (!root) return;
    root.innerHTML = `
      <div class="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
        <div class="flex sm:flex-col gap-3 sm:w-[96px] shrink-0">
          ${product.gallery
            .map(
              (img, i) => `
            <button type="button" data-pdp-thumb="${img}" class="aspect-square w-20 sm:w-full bg-[#F7F7F7] overflow-hidden border transition-all duration-200 cursor-pointer ${
              activeImage === img ? 'border-[#E55472]' : 'border-transparent hover:border-[#DDDDDD]'
            }">
              <img src="${img}" alt="${escapeHtml(product.name)} ${i + 1}" class="h-full w-full object-cover" />
            </button>`
            )
            .join('')}
        </div>
        <div class="flex-1 bg-[#F7F7F7] aspect-[3/3.4] overflow-hidden flex items-center justify-center">
          <img src="${activeImage}" alt="${escapeHtml(product.name)}" class="h-full w-full object-cover transition-opacity duration-300" />
        </div>
      </div>

      <div class="lg:col-span-6">
        <h2 class="text-[26px] md:text-[30px] font-semibold text-[#010101]">${escapeHtml(product.name)}</h2>
        <div class="mt-2.5 flex flex-wrap items-center gap-3">
          <span class="text-[22px] font-bold text-[#E55472] tabular-nums">$${product.price.toFixed(2)}</span>
          ${product.oldPrice ? `<del class="text-[16px] text-[#E55472]/50 tabular-nums">$${product.oldPrice.toFixed(2)}</del>` : ''}
          <div class="flex items-center gap-0.5 ml-1">
            ${renderStars(product.rating, 'h-3.5 w-3.5')}
            <span class="ml-1.5 text-[12px] text-[#FFB800]">( ${product.reviewCount} Reviews )</span>
          </div>
        </div>
        <p class="mt-5 text-[13px] leading-relaxed text-[#666666] border-b border-[#F0F0F0] pb-6">
          ${escapeHtml(product.shortDescription)}
        </p>

        <div class="mt-5">
          <div class="text-[13px] font-medium text-[#010101] mb-2.5">Color</div>
          <div class="flex flex-wrap items-center gap-2.5">
            ${product.colors
              .map(
                (hex) => `<button type="button" data-pdp-color="${hex}" style="background-color:${hex}" class="h-6 w-6 rounded-full border transition-transform cursor-pointer ${
                  selectedColor === hex ? 'ring-2 ring-[#E55472] ring-offset-2 scale-110 border-[#CCCCCC]' : 'border-[#DDDDDD]'
                }"></button>`
              )
              .join('')}
          </div>
        </div>

        <div class="mt-5">
          <div class="text-[13px] font-medium text-[#010101] mb-2.5">Size</div>
          <div class="flex flex-wrap items-center gap-5">
            ${product.sizes
              .map(
                (sz) => `<button type="button" data-pdp-size="${sz}" class="text-[13px] font-medium transition-colors cursor-pointer ${
                  selectedSize === sz ? 'text-[#E55472] font-bold underline underline-offset-4' : 'text-[#666666] hover:text-[#010101]'
                }">${sz}</button>`
              )
              .join('')}
          </div>
        </div>

        <div class="mt-6 flex flex-wrap items-center gap-3 border-b border-[#F0F0F0] pb-6">
          <div class="flex h-[46px] items-center border border-[#EAEAEA] bg-[#F7F7F7]">
            <button type="button" id="pdp-minus" class="h-full w-10 text-[15px] text-[#333333] hover:text-[#E55472] cursor-pointer">-</button>
            <span class="w-10 text-center text-[13px] font-semibold text-[#010101] tabular-nums">${String(qty).padStart(2, '0')}</span>
            <button type="button" id="pdp-plus" class="h-full w-10 text-[15px] text-[#333333] hover:text-[#E55472] cursor-pointer">+</button>
          </div>
          <button type="button" id="pdp-add-cart" class="h-[46px] bg-[#E55472] px-8 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#d13f5e] transition-colors cursor-pointer">ADD TO CART</button>
          <button type="button" id="pdp-add-wish" aria-label="Add to wishlist" class="flex h-[46px] w-[46px] items-center justify-center border border-[#EAEAEA] text-[#565656] hover:border-[#E55472] hover:text-[#E55472] transition-colors cursor-pointer">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>
        </div>

        <div class="mt-5 space-y-2.5 text-[13px] text-[#666666]">
          <div class="flex items-center gap-4">
            <span class="w-24 font-medium text-[#010101]">Share:</span>
            <div class="flex items-center gap-4 text-[#565656]">
              <span class="hover:text-[#E55472] cursor-pointer">f</span>
              <span class="hover:text-[#E55472] cursor-pointer">𝕏</span>
              <span class="hover:text-[#E55472] cursor-pointer">P</span>
              <span class="hover:text-[#E55472] cursor-pointer">IG</span>
            </div>
          </div>
          <div class="flex items-center gap-4"><span class="w-24 font-medium text-[#010101]">SKU:</span><span>${product.sku}</span></div>
          <div class="flex items-center gap-4"><span class="w-24 font-medium text-[#010101]">Categories:</span><span>${escapeHtml(product.category)}</span></div>
          <div class="flex items-center gap-4"><span class="w-24 font-medium text-[#010101]">Tags:</span><span>${product.tags.join(' , ')}</span></div>
        </div>
      </div>
    `;

    root.querySelectorAll('[data-pdp-thumb]').forEach((b) =>
      b.addEventListener('click', () => {
        activeImage = b.getAttribute('data-pdp-thumb');
        renderPdpTop();
      })
    );
    root.querySelectorAll('[data-pdp-color]').forEach((b) =>
      b.addEventListener('click', () => {
        selectedColor = b.getAttribute('data-pdp-color');
        renderPdpTop();
      })
    );
    root.querySelectorAll('[data-pdp-size]').forEach((b) =>
      b.addEventListener('click', () => {
        selectedSize = b.getAttribute('data-pdp-size');
        renderPdpTop();
      })
    );
    root.querySelector('#pdp-minus')?.addEventListener('click', () => {
      qty = Math.max(1, qty - 1);
      renderPdpTop();
    });
    root.querySelector('#pdp-plus')?.addEventListener('click', () => {
      qty += 1;
      renderPdpTop();
    });
    root.querySelector('#pdp-add-cart')?.addEventListener('click', () => {
      addToCart(product, qty, selectedColor, selectedSize);
      openAddToCartModal(product);
    });
    root.querySelector('#pdp-add-wish')?.addEventListener('click', () => {
      addToWishlist(product);
      openWishlistModal(product);
    });
  };

  const renderTabs = () => {
    const tabContainer = document.getElementById('pdp-tabs-container');
    if (!tabContainer) return;
    const reviews = getReviews(product.id);

    tabContainer.innerHTML = `
      <div class="flex flex-wrap items-center justify-center gap-2 mb-8">
        ${[
          ['description', 'Description'],
          ['reviews', 'Reviews'],
          ['shipping', 'Shipping'],
        ]
          .map(
            ([k, lbl]) => `
          <button type="button" data-pdp-tab="${k}" class="px-6 py-2.5 text-[13px] font-semibold transition-colors cursor-pointer ${
            activeTab === k ? 'bg-[#E55472] text-white' : 'bg-[#3B3C3D] text-white hover:bg-[#E55472]'
          }">${lbl}</button>`
          )
          .join('')}
      </div>
      ${
        activeTab === 'description'
          ? `<div class="mx-auto max-w-[960px] text-center text-[14px] leading-[1.9] text-[#666666]">${escapeHtml(product.description)}</div>`
          : activeTab === 'shipping'
          ? `<div class="mx-auto max-w-[820px] space-y-3 text-[14px] leading-relaxed text-[#666666]">
              <h4 class="text-[17px] font-semibold text-[#010101]">Shipping & Freshness Policy</h4>
              <p>All orders placed before 2:00 PM EST are hand-tied the same day and dispatched in insulated hydration sleeves to ensure blooms arrive crisp and vibrant.</p>
              <p>Standard local & national delivery is $15.00 flat rate, or free for orders over $49.00. Returns and replacements are covered under our 15-day satisfaction guarantee.</p>
            </div>`
          : `<div class="mx-auto max-w-[820px] space-y-8">
              <h4 class="text-[18px] font-bold text-[#010101]">Customer Reviews (${reviews.length})</h4>
              <div class="divide-y divide-[#F0F0F0]">
                ${reviews
                  .map(
                    (r) => `
                  <div class="py-5">
                    <div class="flex items-center justify-between">
                      <h6 class="text-[15px] font-semibold text-[#010101]">${escapeHtml(r.author)}</h6>
                      <span class="text-[12px] text-[#888888]">${escapeHtml(r.date)}</span>
                    </div>
                    <div class="mt-1 flex items-center gap-0.5">${renderStars(r.rating, 'h-3.5 w-3.5')}</div>
                    <p class="mt-2.5 text-[13px] leading-relaxed text-[#666666]">${escapeHtml(r.comment)}</p>
                  </div>`
                  )
                  .join('')}
              </div>
              <form id="pdp-review-form" class="bg-[#F9F9F9] p-6 border border-[#EDEDED] space-y-4">
                <h5 class="text-[16px] font-semibold text-[#010101]">Add a Review</h5>
                <div class="flex items-center gap-2 text-[13px]">
                  <span class="text-[#565656]">Your Ratings:</span>
                  <div class="flex items-center gap-1">
                    ${[1, 2, 3, 4, 5]
                      .map(
                        (s) => `<button type="button" data-rev-star="${s}" class="cursor-pointer"><svg viewBox="0 0 24 24" class="h-4 w-4 ${
                          s <= reviewRating ? 'fill-[#FFB800] text-[#FFB800]' : 'fill-none text-[#CCCCCC]'
                        }" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></button>`
                      )
                      .join('')}
                  </div>
                </div>
                <input id="rev-name" type="text" required placeholder="Type your name...." class="w-full h-11 border border-[#E5E5E5] bg-white px-4 text-[13px] focus:border-[#E55472] focus:outline-none" />
                <textarea id="rev-comment" rows="4" required placeholder="Type your comments...." class="w-full border border-[#E5E5E5] bg-white p-4 text-[13px] focus:border-[#E55472] focus:outline-none"></textarea>
                <button type="submit" class="bg-[#E55472] px-7 py-3 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#d13f5e] transition-colors cursor-pointer">Submit</button>
              </form>
            </div>`
      }
    `;

    tabContainer.querySelectorAll('[data-pdp-tab]').forEach((b) =>
      b.addEventListener('click', () => {
        activeTab = b.getAttribute('data-pdp-tab');
        renderTabs();
      })
    );
    tabContainer.querySelectorAll('[data-rev-star]').forEach((b) =>
      b.addEventListener('click', () => {
        reviewRating = Number(b.getAttribute('data-rev-star'));
        renderTabs();
      })
    );
    tabContainer.querySelector('#pdp-review-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('rev-name').value.trim();
      const comment = document.getElementById('rev-comment').value.trim();
      if (!author || !comment) return;
      addReview(product.id, {
        author,
        comment,
        rating: reviewRating,
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      });
      renderTabs();
    });
  };

  const relatedEl = document.getElementById('pdp-related-grid');
  if (relatedEl) {
    relatedEl.innerHTML = PRODUCTS.filter((p) => p.id !== product.id)
      .slice(0, 4)
      .map((p) => renderProductCardHtml(p, { showRating: true }))
      .join('');
  }

  renderPdpTop();
  renderTabs();
}

/* =========================================================
   4. CART PAGE
   ========================================================= */
if (page === 'cart') {
  let couponFeedback = '';
  let cartNotice = '';

  const renderCart = () => {
    const root = document.getElementById('cart-page-container');
    if (!root) return;
    const { cart, subtotal, coupon, discount } = getCartMetrics();
    const shipping = cart.length > 0 ? 15.0 : 0;
    const orderTotal = Math.max(0, subtotal - discount + shipping);

    if (cart.length === 0) {
      root.innerHTML = `
        <div class="border border-[#EDEDED] bg-[#F9F9F9] py-20 text-center">
          <h3 class="text-[20px] font-semibold text-[#010101]">Your shopping cart is empty</h3>
          <p class="mt-2 text-[14px] text-[#666666]">Explore our seasonal bouquets and fresh stems to add items.</p>
          <a href="/shop-left-sidebar.html" class="mt-6 inline-block bg-[#E55472] px-8 py-3 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#d13f5e] transition-colors">Continue Shopping</a>
        </div>
      `;
      return;
    }

    root.innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full min-w-[700px] border-collapse">
          <tbody class="divide-y divide-[#EDEDED] border-t border-b border-[#EDEDED]">
            ${cart
              .map(
                (item) => `
              <tr>
                <td class="w-10 py-6 text-center">
                  <button type="button" data-cart-remove="${item.productId}" class="text-[14px] text-[#565656] hover:text-[#E55472] cursor-pointer">x</button>
                </td>
                <td class="w-28 py-6">
                  <a href="/product-details.html?id=${item.productId}" class="block h-20 w-20 bg-[#F7F7F7] overflow-hidden">
                    <img src="${item.image}" alt="${escapeHtml(item.name)}" class="h-full w-full object-cover" />
                  </a>
                </td>
                <td class="py-6"><span class="text-[15px] font-semibold text-[#010101]">${escapeHtml(item.name)}</span></td>
                <td class="py-6 text-[14px] text-[#565656] tabular-nums">$${item.price.toFixed(2)}</td>
                <td class="py-6">
                  <div class="inline-flex h-11 items-center border border-[#EDEDED] bg-[#F7F7F7]">
                    <button type="button" data-cart-dec="${item.productId}" class="h-full w-9 text-[15px] text-[#333333] hover:text-[#E55472] cursor-pointer">-</button>
                    <span class="w-10 text-center text-[13px] font-semibold text-[#010101] tabular-nums">${String(item.quantity).padStart(2, '0')}</span>
                    <button type="button" data-cart-inc="${item.productId}" class="h-full w-9 text-[15px] text-[#333333] hover:text-[#E55472] cursor-pointer">+</button>
                  </div>
                </td>
                <td class="py-6 text-right text-[15px] font-bold text-[#010101] tabular-nums">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#EDEDED] pb-8">
        <form id="cart-coupon-form" class="flex flex-wrap items-center">
          <input id="cart-coupon-input" type="text" value="${escapeHtml(coupon)}" placeholder="Coupon code" class="h-12 w-full sm:w-56 border border-[#EDEDED] bg-[#F7F7F7] px-4 text-[13px] text-[#010101] placeholder:text-[#888888] focus:border-[#E55472] focus:bg-white focus:outline-none" />
          <button type="submit" class="h-12 bg-[#565656] px-6 text-[13px] font-semibold text-white hover:bg-[#E55472] transition-colors cursor-pointer">Apply Coupon</button>
        </form>
        <button id="cart-update-btn" type="button" class="h-12 border border-[#CCCCCC] bg-white px-7 text-[13px] font-medium text-[#565656] hover:border-[#E55472] hover:text-[#E55472] transition-colors cursor-pointer">Update Cart</button>
      </div>

      ${couponFeedback ? `<p class="mt-3 text-[13px] text-[#E55472]">${escapeHtml(couponFeedback)}</p>` : ''}
      ${cartNotice ? `<p class="mt-2 text-[13px] text-[#565656]">${escapeHtml(cartNotice)}</p>` : ''}

      <div class="mt-10 flex justify-end">
        <div class="w-full max-w-[440px]">
          <h4 class="mb-4 text-[18px] font-semibold text-[#010101]">Cart Totals</h4>
          <div class="divide-y divide-[#EDEDED] border-t border-b border-[#EDEDED] text-[14px]">
            <div class="flex items-center justify-between py-3.5"><span class="text-[#565656]">Cart Subtotal</span><span class="font-medium text-[#010101] tabular-nums">$${subtotal.toFixed(2)}</span></div>
            ${discount > 0 ? `<div class="flex items-center justify-between py-3.5 text-[#E55472]"><span>Discount (${escapeHtml(coupon)})</span><span class="tabular-nums">-$${discount.toFixed(2)}</span></div>` : ''}
            <div class="flex items-center justify-between py-3.5"><span class="text-[#565656]">Shipping and Handling</span><span class="font-medium text-[#010101] tabular-nums">$${shipping.toFixed(2)}</span></div>
            <div class="flex items-center justify-between py-3.5"><span class="text-[#565656]">Vat</span><span class="font-medium text-[#010101] tabular-nums">$00.00</span></div>
            <div class="flex items-center justify-between py-4"><strong class="text-[15px] font-bold text-[#010101]">Order Total</strong><strong class="text-[16px] font-bold text-[#010101] tabular-nums">$${orderTotal.toFixed(2)}</strong></div>
          </div>
          <a href="/checkout.html" class="mt-5 block w-full bg-[#E55472] py-3.5 text-center text-[13px] font-semibold text-white hover:bg-[#d13f5e] transition-colors">Proceed to checkout</a>
        </div>
      </div>
    `;

    root.querySelectorAll('[data-cart-remove]').forEach((b) =>
      b.addEventListener('click', () => {
        removeFromCart(Number(b.getAttribute('data-cart-remove')));
        renderCart();
      })
    );
    root.querySelectorAll('[data-cart-dec]').forEach((b) =>
      b.addEventListener('click', () => {
        const id = Number(b.getAttribute('data-cart-dec'));
        const item = getCartMetrics().cart.find((i) => i.productId === id);
        if (item) updateCartQuantity(id, item.quantity - 1);
        renderCart();
      })
    );
    root.querySelectorAll('[data-cart-inc]').forEach((b) =>
      b.addEventListener('click', () => {
        const id = Number(b.getAttribute('data-cart-inc'));
        const item = getCartMetrics().cart.find((i) => i.productId === id);
        if (item) updateCartQuantity(id, item.quantity + 1);
        renderCart();
      })
    );
    root.querySelector('#cart-coupon-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const res = applyCouponCode(document.getElementById('cart-coupon-input').value);
      couponFeedback = res.message;
      renderCart();
    });
    root.querySelector('#cart-update-btn')?.addEventListener('click', () => {
      cartNotice = 'Cart quantities and totals updated.';
      renderCart();
    });
  };

  renderCart();
  window.addEventListener('fiama:store-updated', renderCart);
}

/* =========================================================
   5. WISHLIST PAGE
   ========================================================= */
if (page === 'wishlist') {
  const renderWishlist = () => {
    const root = document.getElementById('wishlist-page-container');
    if (!root) return;
    const list = getWishlist();
    if (list.length === 0) {
      root.innerHTML = `
        <div class="border border-[#EDEDED] bg-[#F9F9F9] py-20 text-center">
          <h3 class="text-[20px] font-semibold text-[#010101]">Your wishlist is empty</h3>
          <p class="mt-2 text-[14px] text-[#666666]">Save your favorite bouquets while browsing the shop.</p>
          <a href="/shop-left-sidebar.html" class="mt-6 inline-block bg-[#E55472] px-8 py-3 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#d13f5e] transition-colors">Browse Flowers</a>
        </div>
      `;
      return;
    }

    root.innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full min-w-[680px] border-collapse">
          <tbody class="divide-y divide-[#EDEDED] border-t border-b border-[#EDEDED]">
            ${list
              .map(
                (item) => `
              <tr>
                <td class="w-10 py-6 text-center">
                  <button type="button" data-wl-remove="${item.id}" class="text-[14px] text-[#565656] hover:text-[#E55472] cursor-pointer">x</button>
                </td>
                <td class="w-28 py-6">
                  <a href="/product-details.html?id=${item.id}" class="block h-20 w-20 bg-[#F7F7F7] overflow-hidden">
                    <img src="${item.image}" alt="${escapeHtml(item.name)}" class="h-full w-full object-cover" />
                  </a>
                </td>
                <td class="py-6">
                  <a href="/product-details.html?id=${item.id}" class="text-[15px] font-semibold text-[#010101] hover:text-[#E55472]">${escapeHtml(item.name)}</a>
                </td>
                <td class="py-6 text-[14px] text-[#565656] tabular-nums">$${item.price.toFixed(2)}</td>
                <td class="py-6 text-[13px] font-medium text-[#565656]">${item.inStock ? 'In Stock' : 'Out of Stock'}</td>
                <td class="py-6 text-right">
                  <button type="button" data-wl-add="${item.id}" class="bg-[#565656] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[#E55472] transition-colors cursor-pointer">Add to Cart</button>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    root.querySelectorAll('[data-wl-remove]').forEach((b) =>
      b.addEventListener('click', () => {
        removeFromWishlist(Number(b.getAttribute('data-wl-remove')));
        renderWishlist();
      })
    );
    root.querySelectorAll('[data-wl-add]').forEach((b) =>
      b.addEventListener('click', () => {
        const prod = getProductById(b.getAttribute('data-wl-add'));
        addToCart(prod, 1);
        openAddToCartModal(prod);
      })
    );
  };

  renderWishlist();
}

/* =========================================================
   6. CHECKOUT PAGE
   ========================================================= */
if (page === 'checkout') {
  document.getElementById('toggle-login-box')?.addEventListener('click', () => {
    document.getElementById('checkout-login-box')?.classList.toggle('hidden');
  });
  document.getElementById('toggle-coupon-box')?.addEventListener('click', () => {
    document.getElementById('checkout-coupon-box')?.classList.toggle('hidden');
  });

  document.getElementById('checkout-coupon-btn')?.addEventListener('click', () => {
    const code = document.getElementById('checkout-coupon-input')?.value || '';
    const res = applyCouponCode(code);
    const msg = document.getElementById('checkout-coupon-msg');
    if (msg) {
      msg.textContent = res.message;
      msg.classList.remove('hidden');
    }
    renderCheckoutTotals();
  });

  document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const val = e.target.value;
      document.getElementById('pm-desc-check')?.classList.toggle('hidden', val !== 'check');
      document.getElementById('pm-desc-cod')?.classList.toggle('hidden', val !== 'cod');
      document.getElementById('pm-desc-paypal')?.classList.toggle('hidden', val !== 'paypal');
    });
  });

  const renderCheckoutTotals = () => {
    const box = document.getElementById('checkout-totals-list');
    if (!box) return;
    const { cart, subtotal, coupon, discount } = getCartMetrics();
    const shipping = cart.length > 0 ? 15.0 : 0;
    const total = Math.max(0, subtotal - discount + shipping);

    box.innerHTML = `
      ${cart
        .map(
          (item) => `
        <div class="flex items-center justify-between py-3.5">
          <span class="text-[#333333]">${escapeHtml(item.name)} <strong class="font-semibold">× ${item.quantity}</strong></span>
          <span class="text-[#565656] tabular-nums">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>`
        )
        .join('')}
      ${discount > 0 ? `<div class="flex items-center justify-between py-3.5 text-[#E55472]"><span>Coupon (${escapeHtml(coupon)})</span><span class="tabular-nums">-$${discount.toFixed(2)}</span></div>` : ''}
      <div class="flex items-center justify-between py-3.5"><span class="text-[#565656]">Shipping and Handling</span><span class="text-[#565656] tabular-nums">$${shipping.toFixed(2)}</span></div>
      <div class="flex items-center justify-between py-3.5"><span class="text-[#565656]">Vat</span><span class="text-[#565656] tabular-nums">$00.00</span></div>
      <div class="flex items-center justify-between py-4"><strong class="text-[15px] font-bold text-[#010101]">Order Total</strong><strong class="text-[16px] font-bold text-[#010101] tabular-nums">$${total.toFixed(2)}</strong></div>
    `;
  };

  renderCheckoutTotals();

  document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const { cart } = getCartMetrics();
    if (cart.length === 0) return;
    const ord = placeOrder();
    const section = document.getElementById('checkout-main-section');
    if (section) {
      section.innerHTML = `
        <div class="mx-auto max-w-[680px] border border-[#EDEDED] bg-[#F9F9F9] p-10 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#8FB339] text-white text-xl font-bold">✓</div>
          <h2 class="mt-4 text-[24px] font-bold text-[#010101]">Order #${ord.id} Confirmed</h2>
          <p class="mt-2 text-[14px] text-[#666666]">Thank you for your order. Your floral arrangement is being prepared for dispatch (${ord.date}).</p>
          <div class="mt-6 inline-block border border-[#EDEDED] bg-white px-6 py-3 text-[14px] font-semibold text-[#010101] tabular-nums">Total Paid: $${ord.total.toFixed(2)}</div>
          <div class="mt-7 flex flex-wrap justify-center gap-3">
            <a href="/account.html" class="bg-[#E55472] px-7 py-3 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#d13f5e] transition-colors">View My Orders</a>
            <a href="/shop-left-sidebar.html" class="bg-[#272829] px-7 py-3 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#E55472] transition-colors">Continue Shopping</a>
          </div>
        </div>
      `;
    }
  });
}

/* =========================================================
   7. LOGIN PAGE
   ========================================================= */
if (page === 'login') {
  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value.trim();
    if (!email) return;
    const user = getUser();
    saveUser({
      ...user,
      email,
      displayName: email.split('@')[0] || 'UserName',
      isLoggedIn: true,
    });
    window.location.href = '/account.html';
  });
  document.getElementById('forgot-pw-btn')?.addEventListener('click', () => {
    document.getElementById('forgot-pw-msg')?.classList.remove('hidden');
  });
}

/* =========================================================
   8. REGISTER PAGE
   ========================================================= */
if (page === 'register') {
  document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const first = document.getElementById('reg-first')?.value.trim() || '';
    const last = document.getElementById('reg-last')?.value.trim() || '';
    const email = document.getElementById('reg-email')?.value.trim() || '';
    const pw = document.getElementById('reg-pw')?.value || '';
    const cpw = document.getElementById('reg-cpw')?.value || '';
    const errEl = document.getElementById('reg-error');

    if (pw !== cpw) {
      if (errEl) {
        errEl.textContent = 'Passwords do not match.';
        errEl.classList.remove('hidden');
      }
      return;
    }

    const user = getUser();
    saveUser({
      ...user,
      firstName: first || user.firstName,
      lastName: last || user.lastName,
      displayName: `${first} ${last}`.trim() || email.split('@')[0],
      email,
      isLoggedIn: true,
    });
    window.location.href = '/account.html';
  });
}

/* =========================================================
   9. ACCOUNT PAGE
   ========================================================= */
if (page === 'account') {
  let activeTab = 'dashboard';

  const renderAccount = () => {
    const user = getUser();
    const orders = getOrders();

    document.querySelectorAll('[data-acc-tab]').forEach((btn) => {
      const key = btn.getAttribute('data-acc-tab');
      const isAct = key === activeTab;
      btn.className = `flex w-full items-center justify-between px-6 py-4 text-left text-[14px] font-medium transition-colors cursor-pointer ${
        isAct ? 'bg-[#071C1F] text-white' : 'bg-white text-[#565656] hover:bg-[#F9F9F9] hover:text-[#010101]'
      }`;
    });

    const panel = document.getElementById('account-content-panel');
    if (!panel) return;

    if (activeTab === 'dashboard') {
      panel.innerHTML = `
        <div class="space-y-4">
          <div class="bg-[#F5F5F5] px-6 py-4 text-[14px] text-[#333333]">
            Hello <strong>${escapeHtml(user.displayName)}</strong> (not <strong>${escapeHtml(user.displayName)}</strong>?
            <button type="button" id="acc-dash-logout" class="text-[#E55472] hover:underline cursor-pointer">Log out</button>)
          </div>
          <div class="bg-[#F5F5F5] px-6 py-5 text-[14px] leading-relaxed text-[#565656]">
            From your account dashboard you can view your
            <button type="button" data-jump-tab="orders" class="text-[#010101] underline hover:text-[#E55472] cursor-pointer">recent orders</button>,
            manage your
            <button type="button" data-jump-tab="address" class="text-[#010101] underline hover:text-[#E55472] cursor-pointer">shipping and billing addresses</button>,
            and
            <button type="button" data-jump-tab="details" class="text-[#010101] underline hover:text-[#E55472] cursor-pointer">edit your password and account details</button>.
          </div>
        </div>
      `;
    } else if (activeTab === 'orders') {
      panel.innerHTML = `
        <div class="overflow-x-auto border border-[#EDEDED]">
          <table class="w-full min-w-[540px] border-collapse text-left text-[14px]">
            <thead class="bg-[#F7F7F7] text-[#010101]">
              <tr class="border-b border-[#EDEDED]">
                <th class="px-5 py-3.5 font-semibold">Order</th>
                <th class="px-5 py-3.5 font-semibold">Date</th>
                <th class="px-5 py-3.5 font-semibold">Status</th>
                <th class="px-5 py-3.5 font-semibold">Total</th>
                <th class="px-5 py-3.5 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EDEDED]">
              ${orders
                .map(
                  (o) => `
                <tr>
                  <td class="px-5 py-4 tabular-nums">${o.id}</td>
                  <td class="px-5 py-4 text-[#565656]">${escapeHtml(o.date)}</td>
                  <td class="px-5 py-4 text-[#565656]">${escapeHtml(o.status)}</td>
                  <td class="px-5 py-4 font-semibold text-[#010101] tabular-nums">$${o.total}</td>
                  <td class="px-5 py-4"><a href="/cart.html" class="text-[#E55472] hover:underline">View</a></td>
                </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (activeTab === 'downloads') {
      panel.innerHTML = `
        <div class="overflow-x-auto border border-[#EDEDED]">
          <table class="w-full min-w-[560px] border-collapse text-left text-[14px]">
            <thead class="bg-[#F7F7F7] text-[#010101]">
              <tr class="border-b border-[#EDEDED]">
                <th class="px-5 py-3.5 font-semibold">Product</th>
                <th class="px-5 py-3.5 font-semibold">Date</th>
                <th class="px-5 py-3.5 font-semibold">Expire</th>
                <th class="px-5 py-3.5 font-semibold">Download</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EDEDED]">
              ${INITIAL_DOWNLOADS.map(
                (d) => `
                <tr>
                  <td class="px-5 py-4 text-[#010101]">${escapeHtml(d.product)}</td>
                  <td class="px-5 py-4 text-[#565656]">${escapeHtml(d.date)}</td>
                  <td class="px-5 py-4 text-[#565656]">${escapeHtml(d.expire)}</td>
                  <td class="px-5 py-4"><a href="/shop-left-sidebar.html" class="text-[#E55472] hover:underline">Download File</a></td>
                </tr>`
              ).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (activeTab === 'address') {
      panel.innerHTML = `
        <div class="space-y-6">
          <p class="text-[14px] text-[#666666]">The following addresses will be used on the checkout page by default.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="border border-[#EDEDED] p-6">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-[16px] font-semibold text-[#010101]">Billing Address</h4>
                <button type="button" data-jump-tab="details" class="text-[13px] text-[#E55472] hover:underline cursor-pointer">edit</button>
              </div>
              <p class="font-semibold text-[14px] text-[#010101]">${escapeHtml(user.billingAddress.name)}</p>
              <p class="mt-1 text-[13px] text-[#666666]">${escapeHtml(user.billingAddress.street)}<br/>${escapeHtml(user.billingAddress.cityStateZip)}</p>
              <p class="mt-2 text-[13px] text-[#666666]">Mobile: ${escapeHtml(user.billingAddress.mobile)}</p>
            </div>
            <div class="border border-[#EDEDED] p-6">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-[16px] font-semibold text-[#010101]">Shipping Address</h4>
                <button type="button" data-jump-tab="details" class="text-[13px] text-[#E55472] hover:underline cursor-pointer">edit</button>
              </div>
              <p class="font-semibold text-[14px] text-[#010101]">${escapeHtml(user.shippingAddress.name)}</p>
              <p class="mt-1 text-[13px] text-[#666666]">${escapeHtml(user.shippingAddress.street)}<br/>${escapeHtml(user.shippingAddress.cityStateZip)}</p>
              <p class="mt-2 text-[13px] text-[#666666]">Mobile: ${escapeHtml(user.shippingAddress.mobile)}</p>
            </div>
          </div>
        </div>
      `;
    } else if (activeTab === 'details') {
      panel.innerHTML = `
        <form id="acc-details-form" class="border border-[#EDEDED] p-6 md:p-8 space-y-5">
          <p class="text-[14px] text-[#666666]">The following addresses will be used on the checkout page by default.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label class="block text-[13px] font-medium text-[#010101] mb-2">First name:</label><input id="acc-fn" type="text" value="${escapeHtml(user.firstName)}" class="h-11 w-full border border-[#EDEDED] bg-[#F7F7F7] px-4 text-[13px] focus:border-[#E55472] focus:bg-white focus:outline-none" /></div>
            <div><label class="block text-[13px] font-medium text-[#010101] mb-2">Last name:</label><input id="acc-ln" type="text" value="${escapeHtml(user.lastName)}" class="h-11 w-full border border-[#EDEDED] bg-[#F7F7F7] px-4 text-[13px] focus:border-[#E55472] focus:bg-white focus:outline-none" /></div>
            <div><label class="block text-[13px] font-medium text-[#010101] mb-2">Display Name:</label><input id="acc-dn" type="text" value="${escapeHtml(user.displayName)}" class="h-11 w-full border border-[#EDEDED] bg-[#F7F7F7] px-4 text-[13px] focus:border-[#E55472] focus:bg-white focus:outline-none" /></div>
            <div><label class="block text-[13px] font-medium text-[#010101] mb-2">Display Email:</label><input id="acc-em" type="email" value="${escapeHtml(user.email)}" class="h-11 w-full border border-[#EDEDED] bg-[#F7F7F7] px-4 text-[13px] focus:border-[#E55472] focus:bg-white focus:outline-none" /></div>
          </div>
          <fieldset class="border border-[#EDEDED] p-5 space-y-4">
            <legend class="px-2 text-[14px] font-semibold text-[#010101]">Password change</legend>
            <div><label class="block text-[13px] text-[#565656] mb-1.5">Current password (leave blank to leave unchanged):</label><input type="password" class="h-11 w-full border border-[#EDEDED] bg-[#F7F7F7] px-4 text-[13px] focus:border-[#E55472] focus:bg-white focus:outline-none" /></div>
            <div><label class="block text-[13px] text-[#565656] mb-1.5">New password (leave blank to leave unchanged):</label><input type="password" class="h-11 w-full border border-[#EDEDED] bg-[#F7F7F7] px-4 text-[13px] focus:border-[#E55472] focus:bg-white focus:outline-none" /></div>
            <div><label class="block text-[13px] text-[#565656] mb-1.5">Confirm new password:</label><input type="password" class="h-11 w-full border border-[#EDEDED] bg-[#F7F7F7] px-4 text-[13px] focus:border-[#E55472] focus:bg-white focus:outline-none" /></div>
          </fieldset>
          <p id="acc-saved-msg" class="hidden text-[13px] text-[#E55472]">Account details updated successfully.</p>
          <button type="submit" class="bg-[#E55472] px-8 py-3 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-[#d13f5e] transition-colors cursor-pointer">Save Changes</button>
        </form>
      `;

      panel.querySelector('#acc-details-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        saveUser({
          ...user,
          firstName: document.getElementById('acc-fn').value,
          lastName: document.getElementById('acc-ln').value,
          displayName: document.getElementById('acc-dn').value,
          email: document.getElementById('acc-em').value,
        });
        document.getElementById('acc-saved-msg')?.classList.remove('hidden');
      });
    }

    panel.querySelectorAll('[data-jump-tab]').forEach((b) =>
      b.addEventListener('click', () => {
        activeTab = b.getAttribute('data-jump-tab');
        renderAccount();
      })
    );
    panel.querySelector('#acc-dash-logout')?.addEventListener('click', () => {
      saveUser({ ...user, isLoggedIn: false });
      window.location.href = '/login.html';
    });
  };

  document.querySelectorAll('[data-acc-tab]').forEach((btn) =>
    btn.addEventListener('click', () => {
      activeTab = btn.getAttribute('data-acc-tab');
      renderAccount();
    })
  );
  document.getElementById('acc-logout-btn')?.addEventListener('click', () => {
    const u = getUser();
    saveUser({ ...u, isLoggedIn: false });
    window.location.href = '/login.html';
  });

  renderAccount();
}

/* =========================================================
   10. CONTACT PAGE
   ========================================================= */
if (page === 'contact') {
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('contact-success')?.classList.remove('hidden');
    e.target.reset();
  });
}
