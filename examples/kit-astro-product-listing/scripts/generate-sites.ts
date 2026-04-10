import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { defineConfig } = require("@sitecore-content-sdk/core/config");
const { generateSites } = require("@sitecore-content-sdk/core/tools");

const config = defineConfig({
  defaultSite:
    process.env.SITECORE_DEFAULT_SITE_NAME || "",
  api: {
    edge: {
      contextId: process.env.SITECORE_EDGE_CONTEXT_ID || "",
    },
    local: {
      apiHost: process.env.SITECORE_API_HOST,
      apiKey: process.env.SITECORE_API_KEY,
    },
  },
});

const fn = generateSites({ scConfig: config });
await fn();
