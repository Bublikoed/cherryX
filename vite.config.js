import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Корінь проєкту
  root: '.',

  // Базовий шлях для офлайн-сумісності
  base: './',

  // Налаштування сервера розробки
  server: {
    port: 3000,
    open: true,
    host: true
  },

  // Налаштування збірки
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // Організація вихідних файлів
        assetFileNames: assetInfo => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash][extname]`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|mp4|mp3|wav|ogg)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      }
    }
  },

  // Налаштування для статичних ресурсів
  publicDir: 'public',

  // Оптимізація
  optimizeDeps: {
    include: []
  }
});
