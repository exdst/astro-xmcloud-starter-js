import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { generateMetadata } = require("@exdst-sitecore-content-sdk/astro/tools");

const fn = generateMetadata();
await fn();
