import type { APIRoute } from "astro";
import { SiteResolver } from "@sitecore-content-sdk/core/site";
import client from "@/lib/sitecore-client";
import sites from ".sitecore/sites.json";
import type { SiteInfo } from "@sitecore-content-sdk/core";
import type { SitemapXmlOptions } from "@sitecore-content-sdk/core/client";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const siteResolver = new SiteResolver(sites as SiteInfo[]);
  const site = siteResolver.getByHost(url.hostname);

  if (!site) {
    return new Response("Site not found", { status: 404 });
  }

  const options: SitemapXmlOptions = {
    site: site.name,
  };

  try {
    const sitemap = await client.getSiteMap(options);

    if (!sitemap) {
      return new Response("Sitemap not available", { status: 404 });
    }

    return new Response(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("[sitemap] Failed to generate sitemap:", error);
    return new Response("Internal server error", { status: 500 });
  }
};
