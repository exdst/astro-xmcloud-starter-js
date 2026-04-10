import fs from "fs";
import path from "path";
import { generateComponentMap } from "./generate-component-map";

const componentsDir = path.resolve(
  import.meta.dirname,
  "..",
  "src",
  "components"
);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function debouncedGenerate() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    try {
      generateComponentMap();
    } catch (err) {
      console.error("Error generating component map:", err);
    }
  }, 300);
}

// Initial generation
generateComponentMap();

// Watch for changes
console.log(`Watching ${componentsDir} for .astro file changes...`);

fs.watch(componentsDir, { recursive: true }, (eventType, filename) => {
  if (filename && filename.endsWith(".astro")) {
    console.log(`Detected ${eventType}: ${filename}`);
    debouncedGenerate();
  }
});
