import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sites, formFactors } from '../sites.config.js';
import { pageSlug } from './slugify.js';
import { writeMarkdownReport } from './reporters/markdown.js';
import { writeCsvReport } from './reporters/csv.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(ROOT, 'reports');

const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const AUDITS = ['largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'server-response-time', 'first-contentful-paint', 'speed-index'];

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function extractRow(lhr, meta) {
  const row = {
    siteId: meta.siteId,
    framework: meta.framework,
    group: meta.group,
    pageLabel: meta.pageLabel,
    pagePath: meta.pagePath,
    url: meta.url,
    formFactor: meta.formFactor,
  };
  for (const cat of CATEGORIES) {
    const score = lhr.categories?.[cat]?.score;
    row[cat] = score == null ? null : Math.round(score * 100);
  }
  for (const audit of AUDITS) {
    const a = lhr.audits?.[audit];
    row[audit] = a?.numericValue ?? null;
  }
  return row;
}

export function collectRows() {
  const rows = [];
  for (const site of sites) {
    for (const page of site.pages) {
      for (const formFactor of formFactors) {
        const dir = path.join(REPORTS_DIR, site.id, pageSlug(page.path), formFactor);
        const lhrPath = path.join(dir, 'lhr.json');
        const metaPath = path.join(dir, 'meta.json');
        if (!fs.existsSync(lhrPath) || !fs.existsSync(metaPath)) continue;
        try {
          const lhr = readJson(lhrPath);
          const meta = readJson(metaPath);
          rows.push(extractRow(lhr, meta));
        } catch (err) {
          console.warn(`Skipping ${lhrPath}: ${err.message}`);
        }
      }
    }
  }
  return rows;
}

function avg(values) {
  const nums = values.filter((v) => v != null && !Number.isNaN(v));
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function rollup(rows, keyFn) {
  const buckets = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(row);
  }
  const out = [];
  for (const [key, bucket] of buckets) {
    const entry = { key, count: bucket.length };
    for (const cat of CATEGORIES) entry[cat] = avg(bucket.map((r) => r[cat]));
    for (const audit of AUDITS) entry[audit] = avg(bucket.map((r) => r[audit]));
    out.push(entry);
  }
  return out;
}

export function buildSummary(rows) {
  const perSite = {};
  for (const ff of formFactors) {
    perSite[ff] = rollup(rows.filter((r) => r.formFactor === ff), (r) => r.siteId);
  }

  const perFramework = {};
  for (const ff of formFactors) {
    perFramework[ff] = rollup(rows.filter((r) => r.formFactor === ff), (r) => r.framework);
  }

  const headToHead = {};
  for (const ff of formFactors) {
    const astroByGroup = rollup(rows.filter((r) => r.formFactor === ff && r.framework === 'astro'), (r) => r.group);
    const nextByGroup = rollup(rows.filter((r) => r.formFactor === ff && r.framework === 'nextjs'), (r) => r.group);
    const mapN = new Map(nextByGroup.map((e) => [e.key, e]));
    headToHead[ff] = astroByGroup.map((a) => ({ group: a.key, astro: a, nextjs: mapN.get(a.key) }));
  }

  return { rows, perSite, perFramework, headToHead };
}

export async function runAggregation() {
  const rows = collectRows();
  if (rows.length === 0) {
    console.warn('No LHR JSON files found. Run `npm run test` first.');
    return;
  }
  const summary = buildSummary(rows);
  writeMarkdownReport(summary, path.join(REPORTS_DIR, 'summary.md'));
  writeCsvReport(rows, path.join(REPORTS_DIR, 'summary.csv'));
  console.log(`Wrote ${path.join(REPORTS_DIR, 'summary.md')}`);
  console.log(`Wrote ${path.join(REPORTS_DIR, 'summary.csv')}`);
}

export const METRIC_KEYS = { CATEGORIES, AUDITS };

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('aggregate.js')) {
  runAggregation().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
