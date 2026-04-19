// Catalog of deployed Netlify sample sites and the pages Lighthouse should test.
// Page lists are derived from the BackstopJS configs under examples/kit-astro-*/backstop/backstop.json.
// The Skatepark kits have no backstop config, so only the homepage is tested by default —
// add entries to the `pages` array if you want deeper coverage.

const groups = {
  product: [
    { label: 'Homepage', path: '/' },
    { label: 'Speakers', path: '/Speakers' },
    { label: 'Speakers - Heritage 10', path: '/Speakers/Heritage-10' },
  ],
  article: [
    { label: 'Homepage', path: '/' },
    { label: 'Article Page', path: '/Article-Page' },
    { label: 'Landing Page', path: '/Landing-Page' },
    { label: 'Article 1', path: '/Articles/Article-1' },
    { label: 'Article 2', path: '/Articles/Article-2' },
    { label: 'Article 3', path: '/Articles/Article-3' },
    { label: 'QA Article 1', path: '/Articles/QA-Article-1' },
    { label: 'QA Article 2', path: '/Articles/QA-Article-2' },
  ],
  location: [
    { label: 'Homepage', path: '/' },
    { label: 'Products - Aero', path: '/Products/Aero' },
    { label: 'Products - Nexa', path: '/Products/Nexa' },
    { label: 'Products - Terra', path: '/Products/Terra' },
    { label: 'Test Drive', path: '/Test-Drive' },
  ],
  skatepark: [
    { label: 'Homepage', path: '/' },
  ],
};

function site(framework, group) {
  const id = `sitecore-content-sdk-${framework}-${group}`;
  return {
    id,
    framework,
    group,
    baseUrl: `https://${id}.netlify.app`,
    pages: groups[group],
  };
}

export const sites = [
  site('astro', 'product'),
  site('astro', 'article'),
  site('astro', 'location'),
  site('astro', 'skatepark'),
  site('nextjs', 'product'),
  site('nextjs', 'article'),
  site('nextjs', 'location'),
  site('nextjs', 'skatepark'),
];

export const formFactors = ['mobile', 'desktop'];
