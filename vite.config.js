import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    legacy(),
    viteStaticCopy({
      targets: [
        {
          // Copy all ionicons SVGs so Ionic Web Components can load them
          // on Android via Capacitor's local server at /svg/*.svg
          src: 'node_modules/ionicons/dist/ionicons/svg/*.svg',
          dest: 'svg'
        }
      ]
    })
  ],
  build: {
    target: 'es2017',
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 8100
  }
});
