// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.tezukayuji.jp',
  server: {
    port: 4321,
  },
  devToolbar: {
    enabled: false,
  },
});
