import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://pbvinge.com',
  output: 'static',
  integrations: [tailwind()]
});