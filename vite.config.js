import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/scss/main.scss', 'resources/js/main.js', 'resources/js/modal.js', 'resources/js/account.js'],
      refresh: true,
    }),
  ],
  server: {
    cors: {
      origin: '*',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204
    }
  },
});
