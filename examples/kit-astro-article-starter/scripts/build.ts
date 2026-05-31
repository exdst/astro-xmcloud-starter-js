import { createRequire } from "module";
import { generateComponentMap } from "./generate-component-map";

const require = createRequire(import.meta.url);
const { defineConfig } = require("@exdst-sitecore-content-sdk/astro/config");
const {
  generateSites,
  generateMetadata,
} = require("@exdst-sitecore-content-sdk/astro/tools");

// Step 1: Generate component map (sync)
generateComponentMap();

// Step 2: Generate sites and metadata (parallel async)
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

const sitesGen = generateSites();
const metadataGen = generateMetadata();

await Promise.all([sitesGen({ scConfig: config }), metadataGen()]);

console.log("Build generation complete.");
