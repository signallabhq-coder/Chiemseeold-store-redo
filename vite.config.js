import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        shop: resolve(__dirname, 'shop.html'),
        product: resolve(__dirname, 'product.html'),
        bag: resolve(__dirname, 'bag.html'),
        wishlist: resolve(__dirname, 'wishlist.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        confirmation: resolve(__dirname, 'confirmation.html'),
        about: resolve(__dirname, 'ueber-chiemsee.html')
      }
    }
  }
});
