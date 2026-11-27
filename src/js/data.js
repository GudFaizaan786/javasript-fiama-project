export const HERO_SLIDES = [
  {
    id: 1,
    title: 'Fresh Flower',
    subtitle: 'Natural & Beautiful Flower Here',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.',
    ctaText: 'Shop Now',
    image: '/assets/aistudio/slider-img-1_5c7e2ccf.webp',
    bgClass: 'bg-[#F3EBE7]',
  },
  {
    id: 2,
    title: 'Fresh Flower',
    subtitle: 'Natural & Beautiful Flower Here',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.',
    ctaText: 'Shop Now',
    image: '/assets/aistudio/slider-img-2_f30bea53.webp',
    bgClass: 'bg-[#F8E2E6]',
  },
];

export const PROMO_BANNERS_TOP = [
  {
    id: 1,
    alt: "-30% Offer Happy Flower's Day Only $12",
    image: '/assets/aistudio/promo-banner-1_085be47e.jpg',
    href: '/shop-left-sidebar.html',
  },
  {
    id: 2,
    alt: "Happy Flower's Day 25% Offer",
    image: '/assets/aistudio/promo-banner-2_f0e9a7f4.jpg',
    href: '/shop-left-sidebar.html',
  },
  {
    id: 3,
    alt: "-40% Offer Happy Flower's Day Only $09",
    image: '/assets/aistudio/promo-banner-3_8302d673.jpg',
    href: '/shop-left-sidebar.html',
  },
];

export const SPLIT_BANNERS = [
  {
    id: 1,
    alt: 'Tulip Natural & Beautiful Flower From $12.01',
    image: '/img/banner/6.jpg',
    href: '/shop-left-sidebar.html',
  },
  {
    id: 2,
    alt: 'Bellflower Natural & Beautiful Flower From $12.01',
    image: '/img/banner/7.jpg',
    href: '/shop-left-sidebar.html',
  },
];

export const DEAL_BANNER = {
  alt: 'Deal of the day - Shop Your Flower Best Offer $12',
  image: '/img/banner/10.jpg',
  href: '/shop-left-sidebar.html',
};

export const BRAND_LOGOS = [
  { id: 1, alt: 'Florist Center Garden', image: '/assets/aistudio/Brand-logo-1_1017a567.png' },
  { id: 2, alt: 'Nature Vintage Logo', image: '/assets/aistudio/Brand-logo-2_8c4935c6.png' },
  { id: 3, alt: 'Anna & John Botanical Studio', image: '/assets/aistudio/Brand-logo-3_87a45a20.png' },
  { id: 4, alt: 'Anna & John Botanical Emblem', image: '/assets/aistudio/Brand-logo-4_e30f7e01.png' },
  { id: 5, alt: 'Claire & Smith Floral Atelier', image: '/assets/aistudio/Brand-logo-5_640c43fc.png' },
  { id: 6, alt: 'Florist Studio Partner', image: '/assets/aistudio/Brand-logo-1_1017a567.png' },
];

export const PRODUCTS = [
  {
    id: 1,
    slug: 'pink-flower-tree',
    name: 'Pink Flower Tree',
    price: 18.0,
    oldPrice: 21.0,
    badge: { text: '10%', type: 'discount' },
    image: '/assets/aistudio/product-1_19ccafa0.png',
    gallery: [
      '/assets/aistudio/product-1_19ccafa0.png',
      '/assets/aistudio/product-2_970f8d0b.png',
      '/assets/aistudio/product-3_7a5915e3.png',
      '/assets/aistudio/product-4_9ec97c46.png',
    ],
    category: 'Bouquets',
    colors: ['#E55472', '#9AC45C', '#6D5CC4', '#FFFFFF', '#FF0000', '#FFFF00'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['Love', 'Flower', 'Heart'],
    rating: 4.5,
    reviewCount: 95,
    sku: '12345',
    shortDescription:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos repellendus repudiandae incidunt quidem pariatur expedita, quo quis modi tempore non.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nost exercit ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    inStock: true,
  },
  {
    id: 2,
    slug: 'premium-joyful',
    name: 'Premium Joyful',
    price: 18.0,
    badge: { text: 'HOT', type: 'hot' },
    image: '/assets/aistudio/product-2_970f8d0b.png',
    gallery: [
      '/assets/aistudio/product-2_970f8d0b.png',
      '/assets/aistudio/product-1_19ccafa0.png',
      '/assets/aistudio/product-3_7a5915e3.png',
      '/assets/aistudio/product-4_9ec97c46.png',
    ],
    category: 'Tulips',
    colors: ['#E55472', '#FFFF00', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['Popular', 'Fresh', 'Gift Store'],
    rating: 5,
    reviewCount: 42,
    sku: '12346',
    shortDescription:
      'Fresh peach-toned blooms hand-tied for celebratory moments, birthdays, and thoughtful gestures.',
    description:
      'Carefully selected seasonal stems trimmed to length and wrapped for lasting freshness in any interior space.',
    inStock: true,
  },
  {
    id: 3,
    slug: 'the-white-rose',
    name: 'The White Rose',
    price: 16.0,
    oldPrice: 19.0,
    badge: { text: '12%', type: 'discount' },
    image: '/assets/aistudio/product-3_7a5915e3.png',
    gallery: [
      '/assets/aistudio/product-3_7a5915e3.png',
      '/assets/aistudio/product-1_19ccafa0.png',
      '/assets/aistudio/product-2_970f8d0b.png',
      '/assets/aistudio/product-4_9ec97c46.png',
    ],
    category: 'Roses',
    colors: ['#6D5CC4', '#E55472', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['Wedding', 'Bouquet', 'Flower'],
    rating: 4,
    reviewCount: 38,
    sku: '12347',
    shortDescription:
      'Velvet-petal wrapped bouquet with satin ribbon tie for romantic gifting and dining centerpieces.',
    description:
      'Vibrant violet and classic rose arrangements curated daily by our master florists for rich color and longevity.',
    inStock: true,
  },
  {
    id: 4,
    slug: 'red-rose-bouquet',
    name: 'Red Rose Bouquet',
    price: 20.0,
    badge: { text: 'HOT', type: 'hot' },
    image: '/assets/aistudio/product-4_9ec97c46.png',
    gallery: [
      '/assets/aistudio/product-4_9ec97c46.png',
      '/assets/aistudio/product-1_19ccafa0.png',
      '/assets/aistudio/product-2_970f8d0b.png',
      '/assets/aistudio/product-3_7a5915e3.png',
    ],
    category: 'Roses',
    colors: ['#FF0000', '#E55472', '#FFFFFF'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    tags: ['Love', 'Roses', 'Gift Store'],
    rating: 5,
    reviewCount: 84,
    sku: '12348',
    shortDescription:
      'Classic crimson roses presented in a fluted terracotta ceramic vessel ready to display immediately.',
    description:
      'Long-lasting crimson blooms arranged in hydrated floral foam inside a textured keepsake pot.',
    inStock: true,
  },
  {
    id: 5,
    slug: 'hearts-desire',
    name: "Heart's Desire",
    price: 15.0,
    badge: { text: 'HOT', type: 'hot' },
    image: '/assets/aistudio/product-5_76dc5727.png',
    gallery: [
      '/assets/aistudio/product-5_76dc5727.png',
      '/assets/aistudio/product-2_970f8d0b.png',
      '/assets/aistudio/product-7_8c1e75bf.png',
      '/assets/aistudio/product-1_19ccafa0.png',
    ],
    category: 'Tulips',
    colors: ['#E55472', '#FFFF00', '#6D5CC4'],
    sizes: ['S', 'M', 'L'],
    tags: ['Popular', 'Spring', 'Bouquet'],
    rating: 4.5,
    reviewCount: 29,
    sku: '12349',
    shortDescription:
      'Multi-hue spring tulip bunch bursting with magenta, golden yellow, and plum tones.',
    description:
      'A cheerful mixed seasonal bundle ideal for brightening desks, sunlit living rooms, and weekend gatherings.',
    inStock: true,
  },
  {
    id: 6,
    slug: 'assorted-roses',
    name: 'Assorted Roses',
    price: 17.0,
    badge: { text: '15%', type: 'discount' },
    image: '/assets/aistudio/product-6_60c41a9d.png',
    gallery: [
      '/assets/aistudio/product-6_60c41a9d.png',
      '/assets/aistudio/product-8_ae4f12b9.png',
      '/assets/aistudio/product-1_19ccafa0.png',
      '/assets/aistudio/product-4_9ec97c46.png',
    ],
    category: 'Gift Store',
    colors: ['#E55472', '#FFFFFF', '#9AC45C'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['Deal', 'Gift Store', 'Flower'],
    rating: 4.5,
    reviewCount: 51,
    sku: '12350',
    hasCountdown: true,
    shortDescription:
      'Delicate blush hyacinth and rose stems selected for fragrance and soft pastel elegance.',
    description:
      'Limited seasonal offer arrangement featuring fragrant pastel spikes and airy botanical greenery.',
    inStock: true,
  },
  {
    id: 7,
    slug: 'roses-surprise',
    name: 'Roses Surprise',
    price: 12.0,
    badge: { text: 'HOT', type: 'hot' },
    image: '/assets/aistudio/product-7_8c1e75bf.png',
    gallery: [
      '/assets/aistudio/product-7_8c1e75bf.png',
      '/assets/aistudio/product-2_970f8d0b.png',
      '/assets/aistudio/product-5_76dc5727.png',
      '/assets/aistudio/product-1_19ccafa0.png',
    ],
    category: 'Tulips',
    colors: ['#FF0000', '#FFFF00', '#9AC45C'],
    sizes: ['S', 'M', 'L'],
    tags: ['Popular', 'Fresh', 'Love'],
    rating: 4,
    reviewCount: 19,
    sku: '12351',
    shortDescription:
      'Sunlit crimson and saffron tulip trio with crisp sculptural green foliage.',
    description:
      'Minimalist botanical stems harvested at peak bud stage so they unfurl gracefully over several days.',
    inStock: true,
  },
  {
    id: 8,
    slug: 'tropical-peace-lily',
    name: 'Tropical Peace Lily',
    price: 14.0,
    oldPrice: 25.0,
    badge: { text: '12%', type: 'hot' },
    image: '/assets/aistudio/product-8_ae4f12b9.png',
    gallery: [
      '/assets/aistudio/product-8_ae4f12b9.png',
      '/assets/aistudio/product-4_9ec97c46.png',
      '/assets/aistudio/product-1_19ccafa0.png',
      '/assets/aistudio/product-6_60c41a9d.png',
    ],
    category: 'Plants',
    colors: ['#E55472', '#FFFFFF', '#9AC45C'],
    sizes: ['M', 'L', 'XL'],
    tags: ['Luxury', 'Gift Store', 'Flower'],
    rating: 5,
    reviewCount: 64,
    sku: '12352',
    shortDescription:
      'Blush garden roses nestled in a hand-woven rattan basket for timeless table styling.',
    description:
      'Artisanal woven basket arrangement overflowing with soft pink garden roses and lush seasonal greens.',
    inStock: true,
  },
  {
    id: 9,
    slug: 'pink-flower-tree-red',
    name: 'Pink Flower Tree Red',
    price: 49.0,
    oldPrice: 65.0,
    badge: { text: 'HOT', type: 'hot' },
    image: '/assets/aistudio/product-4_9ec97c46.png',
    gallery: [
      '/assets/aistudio/product-4_9ec97c46.png',
      '/assets/aistudio/product-1_19ccafa0.png',
      '/assets/aistudio/product-2_970f8d0b.png',
      '/assets/aistudio/product-3_7a5915e3.png',
    ],
    category: 'Flower',
    colors: ['#E55472', '#9AC45C', '#6D5CC4', '#FFFFFF', '#FF0000', '#FFFF00'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['Love', 'Flower', 'Heart'],
    rating: 4.5,
    reviewCount: 95,
    sku: '12345',
    shortDescription:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos repellendus repudiandae incidunt quidem pariatur expedita, quo quis modi tempore non.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nost exercit ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepte sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    inStock: true,
  },
  {
    id: 10,
    slug: 'sky-blue-bouquet',
    name: 'Sky Blue Bouquet',
    price: 20.0,
    badge: { text: 'HOT', type: 'hot' },
    image: '/assets/aistudio/product-1_19ccafa0.png',
    gallery: [
      '/assets/aistudio/product-1_19ccafa0.png',
      '/assets/aistudio/product-3_7a5915e3.png',
      '/assets/aistudio/product-6_60c41a9d.png',
      '/assets/aistudio/product-8_ae4f12b9.png',
    ],
    category: 'Bouquets',
    colors: ['#6D5CC4', '#FFFFFF', '#9AC45C'],
    sizes: ['M', 'L', 'XL'],
    tags: ['Wedding', 'Bouquet', 'Luxury'],
    rating: 4.5,
    reviewCount: 33,
    sku: '12353',
    shortDescription:
      'Curated seasonal dome arrangement styled for weddings, baby showers, and milestone dinners.',
    description:
      'Hand-packed botanical stems and crisp eucalyptus sprigs delivered in a crystal-clear cylinder vase.',
    inStock: true,
  },
];

export const SHOP_CATEGORIES = [
  'All Categories',
  'Bouquets',
  'Roses',
  'Tulips',
  'Plants',
  'Gift Store',
  'Flower',
  'Accessories',
  'Other',
];

export const SHOP_COLORS = [
  { label: 'Rose', hex: '#E55472' },
  { label: 'Sage', hex: '#9AC45C' },
  { label: 'Violet', hex: '#6D5CC4' },
  { label: 'White', hex: '#FFFFFF' },
  { label: 'Red', hex: '#FF0000' },
  { label: 'Yellow', hex: '#FFFF00' },
];

export const SHOP_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const SHOP_TAGS = [
  'Popular',
  'Flower',
  'Love',
  'Heart',
  'Bouquet',
  'Roses',
  'Fresh',
  'Gift Store',
  'Wedding',
  'Spring',
  'Deal',
  'Luxury',
];

export const BLOG_POSTS = [
  {
    id: 1,
    date: 'Nov 18, 2027',
    comments: 2,
    title: 'Lorem ipsum dolor sit amet con adipisicing elit sed',
    image: '/assets/aistudio/blog-1_7db32f7e.jpg',
  },
  {
    id: 2,
    date: 'Nov 18, 2027',
    comments: 2,
    title: 'Lorem ipsum dolor sit amet con adipisicing elit sed',
    image: '/assets/aistudio/blog-2_aae6ff1d.jpg',
  },
  {
    id: 3,
    date: 'Nov 18, 2027',
    comments: 2,
    title: 'Lorem ipsum dolor sit amet con adipisicing elit sed',
    image: '/assets/aistudio/blog-3_ace8cf64.jpg',
  },
  {
    id: 4,
    date: 'Nov 18, 2027',
    comments: 2,
    title: 'Lorem ipsum dolor sit amet con adipisicing elit sed',
    image: '/assets/aistudio/blog-4_50df605f.jpg',
  },
  {
    id: 5,
    date: 'Nov 18, 2027',
    comments: 2,
    title: 'Lorem ipsum dolor sit amet con adipisicing elit sed',
    image: '/assets/aistudio/blog-5_b2249df5.jpg',
  },
];

export const INITIAL_REVIEWS = [
  {
    id: 1,
    author: 'Adam Smit',
    date: 'September 3, 2027',
    rating: 4,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus, omnis fugit corporis iste magnam ratione.',
  },
  {
    id: 2,
    author: 'Adam Smit',
    date: 'September 2, 2027',
    rating: 5,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus, omnis fugit corporis iste magnam ratione.',
  },
  {
    id: 3,
    author: 'Adam Smit',
    date: 'September 2, 2027',
    rating: 4,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus, omnis fugit corporis iste magnam ratione.',
  },
];

export const INITIAL_ORDERS = [
  { id: 1, date: 'Jun 22, 2019', status: 'Pending', total: 3000, itemsCount: 3 },
  { id: 2, date: 'Nov 22, 2019', status: 'Approved', total: 200, itemsCount: 2 },
  { id: 3, date: 'Jan 12, 2027', status: 'On Hold', total: 990, itemsCount: 4 },
];

export const INITIAL_DOWNLOADS = [
  {
    id: 1,
    product: 'Fiama Floral Care Guide PDF',
    date: 'Nov 22, 2027',
    expire: 'Yes',
  },
  {
    id: 2,
    product: 'Seasonal Bouquet Arrangement Guide',
    date: 'Nov 10, 2027',
    expire: 'Yes',
  },
  {
    id: 3,
    product: 'Wedding Floristry Lookbook',
    date: 'Nov 12, 2027',
    expire: 'Yes',
  },
];
