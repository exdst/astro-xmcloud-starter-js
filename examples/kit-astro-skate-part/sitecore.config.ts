import { defineConfig } from "@exdst-sitecore-content-sdk/astro/config";
/**
 * See the documentation for `defineConfig`:
 * https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 */
export default defineConfig({
  defaultSite: import.meta.env?.SITECORE_DEFAULT_SITE_NAME || process.env?.SITECORE_DEFAULT_SITE_NAME || '',
  api: {
    edge: {
      contextId: import.meta.env?.SITECORE_EDGE_CONTEXT_ID || "",
    },
    local: {
      apiHost: import.meta.env?.SITECORE_API_HOST || process.env?.SITECORE_API_HOST,
      apiKey: import.meta.env?.SITECORE_API_KEY || process.env?.SITECORE_API_KEY,
    }
  }
});