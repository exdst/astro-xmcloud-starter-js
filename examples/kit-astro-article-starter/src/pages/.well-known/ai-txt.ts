import type { APIRoute } from "astro";
import scConfig from "sitecore.config";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const siteName = scConfig.defaultSite || "site";

  const content = [
    `# AI.txt for ${siteName}`,
    `# Learn more: https://site.spawning.ai/spawning-ai-txt`,
    "",
    "# Preferences",
    "User-Agent: *",
    "Allow: AI-Training",
    "Allow: AI-Scraping",
    "Allow: AI-Summarization",
    "Allow: AI-Search",
    "",
    "# AI Crawlers",
    "User-Agent: GPTBot",
    "Allow: /",
    "",
    "User-Agent: ChatGPT-User",
    "Allow: /",
    "",
    "User-Agent: Google-Extended",
    "Allow: /",
    "",
    "User-Agent: Anthropic-AI",
    "Allow: /",
    "",
    "User-Agent: ClaudeBot",
    "Allow: /",
    "",
    "User-Agent: PerplexityBot",
    "Allow: /",
    "",
    "User-Agent: Bytespider",
    "Allow: /",
    "",
    "# AI Endpoints",
    `AI-Summary: ${baseUrl}/api/ai/summary`,
    `AI-FAQ: ${baseUrl}/api/ai/faq`,
    `AI-Services: ${baseUrl}/api/ai/service`,
    `AI-Sitemap: ${baseUrl}/api/sitemap-llm`,
    `LLMs-Txt: ${baseUrl}/api/llms-txt`,
    "",
  ].join("\n");

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
};
