import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reportsDir = path.resolve(__dirname, '..', '..', 'reports');

function relFromReports(absPath) {
  return path.relative(reportsDir, absPath).split(path.sep).join('/');
}

function tally(tests) {
  const total = tests.length;
  const fail = tests.filter((t) => t.status === 'fail').length;
  const pass = total - fail;
  const passRate = total === 0 ? null : (pass / total) * 100;
  return { total, pass, fail, passRate };
}

function fmtRate(rate) {
  return rate === null ? '—' : `${rate.toFixed(1)}%`;
}

export function renderMarkdown({ results, generatedAt }) {
  const lines = [];
  lines.push('# Backstop Visual Regression Summary');
  lines.push('');
  lines.push(`Generated: ${generatedAt.toISOString()}`);
  lines.push('');

  // Overall
  const allTests = results.flatMap((r) => r.tests);
  const overall = tally(allTests);
  lines.push('## Overall');
  lines.push('');
  lines.push('| Scenarios | Pass | Fail | Pass rate |');
  lines.push('|---|---|---|---|');
  lines.push(`| ${overall.total} | ${overall.pass} | ${overall.fail} | ${fmtRate(overall.passRate)} |`);
  lines.push('');

  // Per kit
  lines.push('## Per kit');
  lines.push('');
  lines.push('| Kit | Run | Scenarios | Pass | Fail | Pass rate | HTML report |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const r of results) {
    if (r.error) {
      lines.push(`| ${r.site} | — | — | — | — | — | _${r.error}_ |`);
      continue;
    }
    const t = tally(r.tests);
    const link = `[open](${relFromReports(r.htmlReport)})`;
    lines.push(`| ${r.site} | ${r.runTimestamp} | ${t.total} | ${t.pass} | ${t.fail} | ${fmtRate(t.passRate)} | ${link} |`);
  }
  lines.push('');

  // Failed scenarios
  const failed = results.flatMap((r) =>
    r.tests.filter((t) => t.status === 'fail').map((t) => ({ ...t, site: r.site }))
  );
  lines.push('## Failed scenarios');
  lines.push('');
  if (failed.length === 0) {
    lines.push('_None — all scenarios passed._');
  } else {
    lines.push('| Kit | Label | Viewport | Mismatch % | URL |');
    lines.push('|---|---|---|---|---|');
    for (const f of failed) {
      lines.push(`| ${f.site} | ${f.label} | ${f.viewport} | ${f.mismatch ?? '—'} | ${f.url} |`);
    }
  }
  lines.push('');

  return lines.join('\n');
}
