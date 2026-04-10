import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { generateMetadata } = require("@sitecore-content-sdk/core/tools");

const fn = generateMetadata();
await fn();
