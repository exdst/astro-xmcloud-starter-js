// Astro kits with BackstopJS configs. Skate-park has no backstop config and is excluded.
// All three kits share ports (Astro 3005, Next.js 3004), so the runner executes them sequentially.

export const sites = [
  {
    id: 'product-listing',
    kitDir: 'examples/kit-astro-product-listing',
    nextKitDir: 'examples/kit-nextjs-product-listing',
    astroPort: 3005,
    nextPort: 3004,
  },
  {
    id: 'article-starter',
    kitDir: 'examples/kit-astro-article-starter',
    nextKitDir: 'examples/kit-nextjs-article-starter',
    astroPort: 3005,
    nextPort: 3004,
  },
  {
    id: 'location-finder',
    kitDir: 'examples/kit-astro-location-finder',
    nextKitDir: 'examples/kit-nextjs-location-finder',
    astroPort: 3005,
    nextPort: 3004,
  },
];
