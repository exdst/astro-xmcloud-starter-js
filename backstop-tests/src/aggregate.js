import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sites } from '../sites.config.js';
import { renderMarkdown } from './reporters/markdown.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const reportsDir = path.resolve(__dirname, '..', 'reports');

async function findLatestRun(kitDir) {
  const bitmapsDir = path.resolve(repoRoot, kitDir, 'backstop', 'backstop_data', 'bitmaps_test');
  let entries;
  try {
    entries = await fs.readdir(bitmapsDir);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
  // Folder names are timestamps (YYYYMMDD-HHMMSS) — lexical sort matches chronological.
  const sorted = entries.filter((e) => /^\d{8}-\d{6}$/.test(e)).sort();
  const latest = sorted[sorted.length - 1];
  if (!latest) return null;
  return path.join(bitmapsDir, latest, 'report.json');
}

async function loadKitResult(site) {
  const reportPath = await findLatestRun(site.kitDir);
  if (!reportPath) {
    return { site: site.id, kitDir: site.kitDir, error: 'no test runs found', tests: [] };
  }
  let raw;
  try {
    raw = await fs.readFile(reportPath, 'utf8');
  } catch (err) {
    return { site: site.id, kitDir: site.kitDir, error: `cannot read ${reportPath}: ${err.message}`, tests: [] };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return { site: site.id, kitDir: site.kitDir, error: `invalid JSON: ${err.message}`, tests: [] };
  }
  const tests = (parsed.tests ?? []).map((t) => ({
    label: t.pair?.label ?? '(unlabeled)',
    viewport: t.pair?.viewportLabel ?? '',
    url: t.pair?.url ?? '',
    mismatch: t.pair?.diff?.misMatchPercentage ?? null,
    status: t.status,
  }));
  const htmlReport = path.resolve(repoRoot, site.kitDir, 'backstop', 'backstop_data', 'html_report', 'index.html');
  return {
    site: site.id,
    kitDir: site.kitDir,
    reportPath,
    htmlReport,
    runTimestamp: path.basename(path.dirname(reportPath)),
    tests,
  };
}

export async function aggregate({ siteIds = null } = {}) {
  const targets = siteIds ? sites.filter((s) => siteIds.includes(s.id)) : sites;
  const results = [];
  for (const site of targets) {
    results.push(await loadKitResult(site));
  }

  await fs.mkdir(reportsDir, { recursive: true });
  const summaryPath = path.join(reportsDir, 'summary.md');
  const md = renderMarkdown({ results, generatedAt: new Date() });
  await fs.writeFile(summaryPath, md, 'utf8');
  return summaryPath;
}

// Allow direct invocation: `node src/aggregate.js`
const isDirect = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirect) {
  aggregate()
    .then((p) => console.log(`summary written: ${p}`))
    .catch((err) => {
      console.error('aggregate failed:', err);
      process.exit(1);
    });
}
