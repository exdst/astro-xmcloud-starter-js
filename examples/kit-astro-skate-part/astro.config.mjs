// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

const isNetlify = process.env.DEPLOY_TARGET === 'netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [
    {
      name: 'set-prerender',
      hooks: {
        'astro:route:setup': ({ route }) => {
          const { PRERENDER } = loadEnv(process.env.NODE_ENV, process.cwd(), '');
          if (route.component.endsWith('/[...path].astro')) {
            route.prerender = PRERENDER === 'true' ? true : false;
          }
        },
      },
    },
  ],
  security: {
    checkOrigin: false,
    allowedDomains: [
      { hostname: '*.sitecorecloud.io' },
      { hostname: '*.sitecore.cloud' },
    ],
  },
  server: {
    port: 3005,
    host: true,
  },
  output: 'server',
  adapter: isNetlify ? netlify() : node({ mode: 'standalone' }),
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      cors: {
        preflightContinue: true,
      },
    },
    ssr: {
      noExternal: [
        '@sitecore-content-sdk/core',
        '@sitecore-cloudsdk/events',
        '@sitecore-cloudsdk/core',
        '@sitecore-cloudsdk/utils',
        '@exdst-sitecore-content-sdk/astro',
      ],
    },
    resolve: {
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    },
  },
});
