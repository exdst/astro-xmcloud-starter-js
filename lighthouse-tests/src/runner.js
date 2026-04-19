import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch as launchChrome } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { sites, formFactors } from '../sites.config.js';
import { pageSlug } from './slugify.js';
import { runAggregation, METRIC_KEYS } from './aggregate.js';
import { warmupUrl } from './warmup.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(ROOT, 'reports');

const DEFAULT_RUNS_PER_PAGE = 3;
const { CATEGORIES, AUDITS } = METRIC_KEYS;

function parseArgs(argv) {
  const args = {
    site: null,
    framework: null,
    group: null,
    skipReport: false,
    runs: DEFAULT_RUNS_PER_PAGE,
    warmup: true,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--site') args.site = argv[++i];
    else if (a === '--only-framework') args.framework = argv[++i];
    else if (a === '--group') args.group = argv[++i];
    else if (a === '--no-report') args.skipReport = true;
    else if (a === '--runs') {
      const n = Number(argv[++i]);
      if (!Number.isInteger(n) || n < 1) {
        console.error(`--runs must be a positive integer, got ${argv[i]}`);
        process.exit(1);
      }
      args.runs = n;
    } else if (a === '--no-warmup') args.warmup = false;
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

function extractMetrics(lhr) {
  const categories = {};
  for (const cat of CATEGORIES) {
    categories[cat] = lhr.categories?.[cat]?.score ?? null;
  }
  const audits = {};
  for (const audit of AUDITS) {
    audits[audit] = lhr.audits?.[audit]?.numericValue ?? null;
  }
  return { categories, audits };
}

function averageMetrics(metricsList) {
  const valid = metricsList.filter(Boolean);
  const avg = (vals) => {
    const nums = vals.filter((v) => v != null && !Number.isNaN(v));
    return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
  };
  const categories = {};
  for (const cat of CATEGORIES) categories[cat] = avg(valid.map((m) => m.categories[cat]));
  const audits = {};
  for (const audit of AUDITS) audits[audit] = avg(valid.map((m) => m.audits[audit]));
  return { categories, audits };
}

function buildSyntheticLhr(averaged) {
  const categories = {};
  for (const cat of CATEGORIES) categories[cat] = { score: averaged.categories[cat] };
  const audits = {};
  for (const audit of AUDITS) audits[audit] = { numericValue: averaged.audits[audit] };
  return { categories, audits };
}

async function runPageFormFactor({ url, port, formFactor, outDir, runsPerPage, warmup, label }) {
  if (warmup) {
    process.stdout.write(`${label} warm-up (load + scroll + fetch all images)... `);
    try {
      await warmupUrl({ url, port, formFactor });
      process.stdout.write('ok\n');
    } catch (err) {
      process.stdout.write(`failed (${err.message}) — continuing\n`);
    }
  }

  const runs = [];
  let lastResult = null;
  for (let i = 1; i <= runsPerPage; i++) {
    process.stdout.write(`${label} run ${i}/${runsPerPage}... `);
    try {
      const result = await runLighthouseOnce({ url, port, formFactor });
      runs.push(extractMetrics(result.lhr));
      lastResult = result;
      process.stdout.write('ok\n');
    } catch (err) {
      runs.push(null);
      process.stdout.write(`failed (${err.message})\n`);
    }
  }

  if (!lastResult) {
    throw new Error(`All ${runsPerPage} measurement runs failed for ${url}`);
  }

  const [htmlReport] = lastResult.report;
  fs.writeFileSync(path.join(outDir, 'report.html'), htmlReport);

  const averaged = averageMetrics(runs);
  fs.writeFileSync(
    path.join(outDir, 'lhr.json'),
    JSON.stringify(buildSyntheticLhr(averaged), null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, 'runs.json'),
    JSON.stringify({ warmup, runs, average: averaged }, null, 2)
  );
}

async function runAll() {
  const args = parseArgs(process.argv.slice(2));
  const targets = filterSites(args);
  if (targets.length === 0) {
    console.error('No sites matched the given filters.');
    process.exit(1);
  }

  const totalPageRuns = targets.reduce((sum, s) => sum + s.pages.length * formFactors.length, 0);
  const lighthouseLaunches = totalPageRuns * args.runs;
  console.log(
    `Starting Lighthouse sweep: ${targets.length} site(s), ${totalPageRuns} page×form-factor pair(s), ` +
      `${args.runs} measurement run(s) each = ${lighthouseLaunches} Lighthouse launch(es)` +
      `${args.warmup ? ` + ${totalPageRuns} cache-warming page load(s) (scroll + force-load images)` : ''}.`
  );

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
          const metaPath = path.join(outDir, 'meta.json');
          const label = `[${done}/${totalPageRuns}] ${formFactor.padEnd(7)} ${url}`;

          console.log(label);
          try {
            await runPageFormFactor({
              url,
              port: chrome.port,
              formFactor,
              outDir,
              runsPerPage: args.runs,
              warmup: args.warmup,
              label: '  ',
            });
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
                  runsPerPage: args.runs,
                  warmup: args.warmup,
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
