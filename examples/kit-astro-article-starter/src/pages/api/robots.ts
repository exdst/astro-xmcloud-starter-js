import type { APIRoute } from "astro";
import { SiteResolver } from "@sitecore-content-sdk/core/site";
import client from "@/lib/sitecore-client";
import sites from ".sitecore/sites.json";
import type { SiteInfo } from "@sitecore-content-sdk/core";

function generateDefaultRobotsTxt(baseUrl: string): string {
  return [
    "# Robots.txt - Allow all crawlers",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    "# AI Crawlers",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    "User-agent: ChatGPT-User",
    "Allow: /",
    "",
    "User-agent: Google-Extended",
    "Allow: /",
    "",
    "User-agent: Anthropic-AI",
    "Allow: /",
    "",
    "User-agent: ClaudeBot",
    "Allow: /",
    "",
    "User-agent: Bytespider",
    "Allow: /",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
    "",
    `Sitemap: ${baseUrl}/api/sitemap`,
    "",
  ].join("\n");
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    const siteResolver = new SiteResolver(sites as SiteInfo[]);
    const site = siteResolver.getByHost(url.hostname);

    if (site) {
      const robotsTxt = await client.getData<string | null>(
        `query RobotsQuery($siteName: String!) {
          site {
            siteInfo(site: $siteName) {
              robots
            }
          }
        }`,
        { siteName: site.name }
      );

      if (robotsTxt) {
        return new Response(String(robotsTxt), {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      }
    }
  } catch (error) {
    console.warn("[robots] Failed to fetch from Sitecore, using fallback:", error);
  }

  const content = generateDefaultRobotsTxt(baseUrl);

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
