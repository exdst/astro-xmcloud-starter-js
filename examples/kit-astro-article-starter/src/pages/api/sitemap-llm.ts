import type { APIRoute } from "astro";
import { SiteResolver } from "@sitecore-content-sdk/core/site";
import client from "@/lib/sitecore-client";
import sites from ".sitecore/sites.json";
import type { SiteInfo } from "@sitecore-content-sdk/core";
import type { SitemapXmlOptions } from "@sitecore-content-sdk/core/client";

const EXCLUDED_PATTERNS = [
  /\/api\//,
  /\/404$/,
  /\/500$/,
  /\/_/,
  /\/sitecore\//,
];

interface SitemapEntry {
  url: string;
  lastmod?: string;
  priority?: string;
}

function parseSitemapXml(xml: string, baseUrl: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  const lastmodRegex = /<lastmod>(.*?)<\/lastmod>/g;

  let locMatch: RegExpExecArray | null;
  const lastmods: string[] = [];

  let lastmodMatch: RegExpExecArray | null;
  while ((lastmodMatch = lastmodRegex.exec(xml)) !== null) {
    lastmods.push(lastmodMatch[1]);
  }

  let i = 0;
  while ((locMatch = locRegex.exec(xml)) !== null) {
    const url = locMatch[1];
    entries.push({
      url,
      lastmod: lastmods[i] || undefined,
    });
    i++;
  }

  return entries;
}

function isExcluded(url: string): boolean {
  return EXCLUDED_PATTERNS.some((pattern) => pattern.test(url));
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    const siteResolver = new SiteResolver(sites as SiteInfo[]);
    const site = siteResolver.getByHost(url.hostname);

    if (!site) {
      return new Response(JSON.stringify({ error: "Site not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const options: SitemapXmlOptions = {
      site: site.name,
    };

    const sitemapXml = await client.getSiteMap(options);
    let pages: SitemapEntry[] = [];

    if (sitemapXml) {
      pages = parseSitemapXml(sitemapXml, baseUrl).filter(
        (entry) => !isExcluded(entry.url)
      );
    }

    // Add AI-specific endpoints
    const aiEndpoints: SitemapEntry[] = [
      { url: `${baseUrl}/api/ai/summary`, priority: "high" },
      { url: `${baseUrl}/api/ai/faq`, priority: "high" },
      { url: `${baseUrl}/api/ai/service`, priority: "high" },
      { url: `${baseUrl}/api/llms-txt`, priority: "medium" },
      { url: `${baseUrl}/.well-known/ai-txt`, priority: "medium" },
    ];

    const result = {
      site: site.name,
      generated: new Date().toISOString(),
      totalPages: pages.length,
      aiEndpoints,
      pages: pages.map((entry) => ({
        url: entry.url,
        lastmod: entry.lastmod || null,
      })),
    };

    return new Response(JSON.stringify(result, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("[sitemap-llm] Failed to generate LLM sitemap:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate sitemap" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
