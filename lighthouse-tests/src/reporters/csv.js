import fs from 'node:fs';

const COLUMNS = [
  'framework',
  'group',
  'siteId',
  'pageLabel',
  'pagePath',
  'url',
  'formFactor',
  'performance',
  'accessibility',
  'best-practices',
  'seo',
  'largest-contentful-paint',
  'total-blocking-time',
  'cumulative-layout-shift',
  'server-response-time',
  'first-contentful-paint',
  'speed-index',
];

function csvCell(value) {
  if (value == null) return '';
  const s = typeof value === 'number' ? String(value) : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function writeCsvReport(rows, outPath) {
  const lines = [COLUMNS.join(',')];
  for (const row of rows) {
    lines.push(COLUMNS.map((c) => csvCell(row[c])).join(','));
  }
  fs.writeFileSync(outPath, lines.join('\n'));
}
