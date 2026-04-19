import fs from 'node:fs';

const CATEGORIES = [
  { key: 'performance', label: 'Perf' },
  { key: 'accessibility', label: 'A11y' },
  { key: 'best-practices', label: 'BP' },
  { key: 'seo', label: 'SEO' },
];

const AUDITS = [
  { key: 'largest-contentful-paint', label: 'LCP (ms)' },
  { key: 'total-blocking-time', label: 'TBT (ms)' },
  { key: 'cumulative-layout-shift', label: 'CLS' },
  { key: 'server-response-time', label: 'TTFB (ms)' },
  { key: 'first-contentful-paint', label: 'FCP (ms)' },
  { key: 'speed-index', label: 'SI (ms)' },
];

function fmtScore(v) {
  if (v == null) return '—';
  return Math.round(v).toString();
}

function fmtMs(v) {
  if (v == null) return '—';
  return Math.round(v).toString();
}

function fmtCls(v) {
  if (v == null) return '—';
  return v.toFixed(3);
}

function fmtAudit(key, v) {
  if (key === 'cumulative-layout-shift') return fmtCls(v);
  return fmtMs(v);
}

function fmtDelta(aVal, bVal, higherIsBetter = true) {
  if (aVal == null || bVal == null) return '—';
  const diff = aVal - bVal;
  const sign = diff > 0 ? '+' : '';
  const abs = Math.abs(diff);
  const formatted = abs >= 10 ? Math.round(diff).toString() : diff.toFixed(1);
  const signed = diff > 0 ? `+${formatted.replace('+', '')}` : formatted;
  void higherIsBetter;
  void sign;
  return signed;
}

function sectionPerPage(rows) {
  const header = [
    '| Framework | Site | Page | Form factor | Perf | A11y | BP | SEO | LCP (ms) | TBT (ms) | CLS | TTFB (ms) |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|',
  ];
  const sorted = [...rows].sort((a, b) => {
    return (
      a.framework.localeCompare(b.framework) ||
      a.group.localeCompare(b.group) ||
      a.siteId.localeCompare(b.siteId) ||
      a.pagePath.localeCompare(b.pagePath) ||
      a.formFactor.localeCompare(b.formFactor)
    );
  });
  const lines = sorted.map((r) =>
    `| ${r.framework} | ${r.siteId} | ${r.pageLabel} | ${r.formFactor} | ${fmtScore(r.performance)} | ${fmtScore(r.accessibility)} | ${fmtScore(r['best-practices'])} | ${fmtScore(r.seo)} | ${fmtMs(r['largest-contentful-paint'])} | ${fmtMs(r['total-blocking-time'])} | ${fmtCls(r['cumulative-layout-shift'])} | ${fmtMs(r['server-response-time'])} |`
  );
  return ['## 1. Per page', '', ...header, ...lines].join('\n');
}

function scoreCols(entry) {
  return CATEGORIES.map((c) => fmtScore(entry[c.key])).join(' | ');
}

function auditCols(entry) {
  return AUDITS.map((a) => fmtAudit(a.key, entry[a.key])).join(' | ');
}

function sectionPerSite(perSite) {
  const lines = ['## 2. Per site (averaged across that site\'s pages)', ''];
  for (const formFactor of Object.keys(perSite)) {
    lines.push(`### ${formFactor}`, '');
    lines.push('| Site | Runs | Perf | A11y | BP | SEO | LCP (ms) | TBT (ms) | CLS | TTFB (ms) | FCP (ms) | SI (ms) |');
    lines.push('|---|---|---|---|---|---|---|---|---|---|---|---|');
    const sorted = [...perSite[formFactor]].sort((a, b) => a.key.localeCompare(b.key));
    for (const entry of sorted) {
      lines.push(`| ${entry.key} | ${entry.count} | ${scoreCols(entry)} | ${auditCols(entry)} |`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function sectionPerFramework(perFramework) {
  const lines = ['## 3. Per framework total (averaged across all pages of all sites in that framework)', ''];
  for (const formFactor of Object.keys(perFramework)) {
    lines.push(`### ${formFactor}`, '');
    lines.push('| Framework | Runs | Perf | A11y | BP | SEO | LCP (ms) | TBT (ms) | CLS | TTFB (ms) | FCP (ms) | SI (ms) |');
    lines.push('|---|---|---|---|---|---|---|---|---|---|---|---|');
    const sorted = [...perFramework[formFactor]].sort((a, b) => a.key.localeCompare(b.key));
    for (const entry of sorted) {
      lines.push(`| ${entry.key} | ${entry.count} | ${scoreCols(entry)} | ${auditCols(entry)} |`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function sectionHeadToHead(headToHead) {
  const lines = ['## 4. Astro vs Next.js head-to-head (per sample group)', ''];
  for (const formFactor of Object.keys(headToHead)) {
    lines.push(`### ${formFactor}`, '');
    lines.push('| Sample | Metric | Astro | Next.js | Δ (Astro − Next.js) |');
    lines.push('|---|---|---|---|---|');
    const sorted = [...headToHead[formFactor]].sort((a, b) => a.group.localeCompare(b.group));
    for (const { group, astro, nextjs } of sorted) {
      if (!astro || !nextjs) {
        lines.push(`| ${group} | — | missing data | missing data | — |`);
        continue;
      }
      for (const cat of CATEGORIES) {
        lines.push(`| ${group} | ${cat.label} | ${fmtScore(astro[cat.key])} | ${fmtScore(nextjs[cat.key])} | ${fmtDelta(astro[cat.key], nextjs[cat.key])} |`);
      }
      for (const audit of AUDITS) {
        lines.push(`| ${group} | ${audit.label} | ${fmtAudit(audit.key, astro[audit.key])} | ${fmtAudit(audit.key, nextjs[audit.key])} | ${fmtDelta(astro[audit.key], nextjs[audit.key])} |`);
      }
    }
    lines.push('');
  }
  return lines.join('\n');
}

export function writeMarkdownReport(summary, outPath) {
  const now = new Date().toISOString();
  const { rows, perSite, perFramework, headToHead } = summary;
  const out = [
    '# Lighthouse summary',
    '',
    `Generated: ${now}`,
    `Runs included: ${rows.length}`,
    '',
    'Scores are 0–100 (higher is better). Timings are milliseconds (lower is better). CLS is unitless (lower is better).',
    '',
    sectionHeadToHead(headToHead),
    sectionPerFramework(perFramework),
    sectionPerSite(perSite),
    sectionPerPage(rows),
  ].join('\n');
  fs.writeFileSync(outPath, out);
}
