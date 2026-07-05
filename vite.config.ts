import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

import svgLoader from './plugins/svg-loader';
import svgComponents from './plugins/vite-plugin-svg-components';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VueI18nPlugin({
      include: [path.resolve(__dirname, './src/locales/**')],
    }),

    svgLoader(),
    svgComponents({
      dts: 'src/types/svg-components.d.ts',
      dirs: [	
        { dir: '@/assets/images/resources', prefix: 'Logo' },
        { dir: '@/assets/images/icons', prefix: 'Icon' },
        { dir: '@/assets/images/ui', prefix: 'UI' },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
					@use "@/styles/tokens" as *;
					@use "@/styles/functions" as *;
				`,
      },
    },
  },
});
