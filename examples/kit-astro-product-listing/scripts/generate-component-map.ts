import fs from "fs";
import path from "path";

const EXCLUDE_DIRS = ["shared", "content-sdk", "ui"];

interface ComponentInfo {
  name: string;
  importName: string;
  importPath: string;
}

export function generateComponentMap(): void {
  const projectRoot = path.resolve(import.meta.dirname, "..");
  const componentsDir = path.join(projectRoot, "src", "components");
  const outputFile = path.join(projectRoot, ".sitecore", "component-map.ts");

  const entries = fs.readdirSync(componentsDir, {
    recursive: true,
    withFileTypes: true,
  });

  const components: ComponentInfo[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".astro")) continue;

    const parentPath =
      typeof entry.parentPath === "string"
        ? entry.parentPath
        : (entry as any).path;
    const relativePath = path.relative(componentsDir, parentPath);
    const parts = relativePath.split(path.sep);

    if (parts.some((part) => EXCLUDE_DIRS.includes(part))) continue;

    const name = entry.name.replace(".astro", "");
    const importName = name.includes('-') ? name.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) : name;
    const importPath = `@/components/${parts.join("/")}/${entry.name}`;

    components.push({ name, importName, importPath });
  }

  components.sort((a, b) => a.name.localeCompare(b.name));

  // Handle duplicate component names (e.g. AccordionBlock in both accordion-block/ and site-three/)
  // Later entries (e.g. site-three) override earlier ones. Use suffixed import names to avoid conflicts.
  const seenNames = new Map<string, number>();
  for (const c of components) {
    const count = seenNames.get(c.importName) || 0;
    if (count > 0) {
      c.importName = `${c.importName}_${count}`;
    }
    seenNames.set(c.importName.replace(/_\d+$/, ''), count + 1);
  }

  const imports = components
    .map((c) => `import ${c.importName} from "${c.importPath}";`)
    .join("\n");

  const mapEntries = components
    .map((c) => `  ["${c.name}", ${c.importName}],`)
    .join("\n");

  const output = `${imports}

const components = new Map<string, any>([
${mapEntries}
]);

export default components;
`;

  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, output, "utf8");
  console.log(`Component map generated: ${outputFile}`);
}

if (process.argv[1]?.includes("generate-component-map")) {
  generateComponentMap();
}
