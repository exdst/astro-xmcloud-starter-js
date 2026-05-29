import { defineMiddleware, sequence } from "astro/middleware";
import { MultisiteMiddleware } from "@exdst-sitecore-content-sdk/astro/middleware/index.ts";
import sites from ".sitecore/sites.json";
import scConfig from "sitecore.config";

const requestFilterMiddleware = defineMiddleware(async (context, next) => {
  // Skip the multisite middleware for SSG
  if (context.isPrerendered) {
    context.locals.skipMiddleware = true;
    return next();
  }

  /*
   * Match all paths except for:
   * 1. /api routes
   * 2. /sitecore/api (Sitecore API routes)
   * 3. /- (Sitecore media)
   * 4. /healthz (Health check)
   * 5. all root files inside /public
   * 6. Astro files
   */
  const matcher = new RegExp(
    "(api/|_next/|healthz|sitecore/api/|-/|_astro|_image|favicon.ico|sc_logo.svg|_site_)"
  );

  const requestUrl = new URL(context.request.url.toLowerCase());
  if (matcher.test(requestUrl.pathname)) {
    context.locals.skipMiddleware = true;
    return next();
  }

  return next();
});

const multisite = new MultisiteMiddleware({
  sites,
  ...scConfig.api.edge,
  ...scConfig.multisite,
  skip: () => false,
});

export const onRequest = sequence(requestFilterMiddleware, multisite.handle);
