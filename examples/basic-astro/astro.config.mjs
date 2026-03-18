// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    ssr: {
      noExternal: ['@sitecore-content-sdk/core', 
        "@sitecore-cloudsdk/events", 
        "@sitecore-cloudsdk/core", 
        "@sitecore-cloudsdk/utils"],
    },
    resolve: {
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    },
  },
});
