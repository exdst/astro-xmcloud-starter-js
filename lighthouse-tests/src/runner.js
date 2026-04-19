import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch as launchChrome } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { sites, formFactors } from '../sites.config.js';
import { pageSlug } from './slugify.js';
import { runAggregation } from './aggregate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(ROOT, 'reports');

function parseArgs(argv) {
  const args = { site: null, framework: null, group: null, skipReport: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--site') args.site = argv[++i];
    else if (a === '--only-framework') args.framework = argv[++i];
    else if (a === '--group') args.group = argv[++i];
    else if (a === '--no-report') args.skipReport = true;
  }
  return args;
}

function filterSites(args) {
  return sites.filter((s) => {
    if (args.site && s.id !== args.site) return false;
    if (args.framework && s.framework !== args.framework) return false;
    if (args.group && s.group !== args.group) return false;
    return true;
  });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function configForFormFactor(formFactor) {
  if (formFactor === 'desktop') return desktopConfig;
  return undefined;
}

function settingsForFormFactor(formFactor) {
  return {
    output: ['html', 'json'],
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor,
  };
}

async function runLighthouseOnce({ url, port, formFactor }) {
  const settings = settingsForFormFactor(formFactor);
  const config = configForFormFactor(formFactor);
  const flags = { ...settings, port };
  const runnerResult = await lighthouse(url, flags, config);
  if (!runnerResult) throw new Error(`Lighthouse returned no result for ${url}`);
  return runnerResult;
}

async function runAll() {
  const args = parseArgs(process.argv.slice(2));
  const targets = filterSites(args);
  if (targets.length === 0) {
    console.error('No sites matched the given filters.');
    process.exit(1);
  }

  const totalRuns = targets.reduce((sum, s) => sum + s.pages.length * formFactors.length, 0);
  console.log(`Starting Lighthouse sweep: ${targets.length} site(s), ${totalRuns} run(s) total.`);

  const chrome = await launchChrome({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  });

  let done = 0;
  const startedAt = Date.now();
  try {
    for (const site of targets) {
      for (const page of site.pages) {
        for (const formFactor of formFactors) {
          done++;
          const url = site.baseUrl + page.path;
          const outDir = path.join(REPORTS_DIR, site.id, pageSlug(page.path), formFactor);
          ensureDir(outDir);
          const htmlPath = path.join(outDir, 'report.html');
          const jsonPath = path.join(outDir, 'lhr.json');
          const metaPath = path.join(outDir, 'meta.json');

          console.log(`[${done}/${totalRuns}] ${formFactor.padEnd(7)} ${url}`);
          try {
            const result = await runLighthouseOnce({ url, port: chrome.port, formFactor });
            const [htmlReport, jsonReport] = result.report;
            fs.writeFileSync(htmlPath, htmlReport);
            fs.writeFileSync(jsonPath, jsonReport);
            fs.writeFileSync(
              metaPath,
              JSON.stringify(
                {
                  siteId: site.id,
                  framework: site.framework,
                  group: site.group,
                  pageLabel: page.label,
                  pagePath: page.path,
                  url,
                  formFactor,
                  finishedAt: new Date().toISOString(),
                },
                null,
                2
              )
            );
          } catch (err) {
            console.error(`  ✗ failed: ${err.message}`);
            fs.writeFileSync(
              path.join(outDir, 'error.txt'),
              `${new Date().toISOString()}\n${err.stack || err.message}\n`
            );
          }
        }
      }
    }
  } finally {
    try {
      await chrome.kill();
    } catch (err) {
      // chrome-launcher on Windows can throw EPERM while clearing Chrome's temp user-data dir.
      // The runs have already been written to disk by this point, so treat it as non-fatal.
      if (err?.code !== 'EPERM') {
        console.warn(`chrome.kill() warning: ${err.message}`);
      }
    }
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`\nSweep complete in ${elapsed}s. Reports in ${REPORTS_DIR}`);

  if (!args.skipReport) {
    console.log('Aggregating results...');
    await runAggregation();
  }
}

runAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
