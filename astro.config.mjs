// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/lib/site.ts';
import { contentLastmod } from './src/lib/content-dates.ts';

const lastmod = contentLastmod(process.cwd());

export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
    // The stylesheet is small; inlining it removes the render-blocking request that held LCP
    // above 1.5s on simulated mobile.
    inlineStylesheets: 'always',
  },
  markdown: {
    shikiConfig: {
      // The *-default variants keep comment tokens above 4.5:1; plain github-dark does not.
      themes: { light: 'github-light-default', dark: 'github-dark-default' },
    },
  },
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        const date = lastmod.get(path);
        return date ? { ...item, lastmod: date.toISOString() } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
