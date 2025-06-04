import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
export default defineConfig({
  server: {
    https: true
  },
  plugins: [
    laravel({
      input: ['resources/scss/main.scss', 'resources/js/main.js', 'resources/js/modal.js', 'resources/js/account.js'],
      refresh: true,
    }),
  ],
});