import type { APIRoute } from "astro";
import scConfig from "sitecore.config";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const siteName = scConfig.defaultSite || "site";

  const content = [
    `# ${siteName}`,
    "",
    `> Welcome to ${siteName}. This document provides information about the site for large language models.`,
    "",
    "## About",
    "",
    `${siteName} is a website powered by Sitecore XM Cloud and Astro.`,
    "",
    "## Endpoints",
    "",
    `- [Sitemap](${baseUrl}/api/sitemap)`,
    `- [Robots.txt](${baseUrl}/api/robots)`,
    `- [AI Summary](${baseUrl}/api/ai/summary)`,
    `- [AI FAQ](${baseUrl}/api/ai/faq)`,
    `- [AI Services](${baseUrl}/api/ai/service)`,
    `- [AI Sitemap](${baseUrl}/api/sitemap-llm)`,
    `- [AI Metadata](${baseUrl}/.well-known/ai-txt)`,
    "",
    "## Content",
    "",
    "This site contains articles, services information, frequently asked questions, and more.",
    "Use the AI endpoints above for structured data access.",
    "",
  ].join("\n");

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
};
