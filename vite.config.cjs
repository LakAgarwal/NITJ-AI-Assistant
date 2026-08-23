const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

module.exports = defineConfig({
  plugins: [react()],
  cacheDir: '../.vite-cache',
  server: {
    port: 5173
  },
  build: {
    outDir: '../build-out',
    emptyOutDir: false
  }
});
