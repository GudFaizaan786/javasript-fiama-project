import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        shop: path.resolve(__dirname, 'shop-left-sidebar.html'),
        productDetails: path.resolve(__dirname, 'product-details.html'),
        cart: path.resolve(__dirname, 'cart.html'),
        wishlist: path.resolve(__dirname, 'wishlist.html'),
        checkout: path.resolve(__dirname, 'checkout.html'),
        login: path.resolve(__dirname, 'login.html'),
        register: path.resolve(__dirname, 'register.html'),
        account: path.resolve(__dirname, 'account.html'),
        contact: path.resolve(__dirname, 'contact.html'),
      },
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
