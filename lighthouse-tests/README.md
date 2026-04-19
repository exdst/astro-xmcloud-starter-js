# Lighthouse tests — Astro vs Next.js sample sites

Runs Google Lighthouse against the 8 deployed Netlify sample sites (4 Astro + 4 Next.js pairs) and emits aggregated reports so we can compare Astro and Next.js head-to-head.

## Install

```sh
cd lighthouse-tests
npm install
```

## Run

```sh
# Full sweep: every site × every page × mobile + desktop (~68 runs, 30–60 min).
npm run test

# One site only (skip to skatepark to smoke-test quickly).
npm run test:site -- sitecore-content-sdk-astro-skatepark

# One framework only.
npm run test:astro
npm run test:nextjs

# Regenerate summary.md + summary.csv from existing lhr.json files (no Lighthouse runs).
npm run report
```

CLI flags accepted by `src/runner.js`:
- `--site <id>` — run only the matching site id (e.g. `sitecore-content-sdk-astro-article`).
- `--only-framework astro|nextjs` — restrict to one framework.
- `--group product|article|location|skatepark` — restrict to one sample group (runs both frameworks of that group).
- `--no-report` — skip aggregation after the sweep.

## Output

```
reports/
  <site-id>/
    <page-slug>/
      <mobile|desktop>/
        report.html   # human-readable Lighthouse report
        lhr.json      # raw Lighthouse result (used by aggregator)
        meta.json     # site/page/framework metadata
  summary.md          # grouped report (generated)
  summary.csv         # one row per (site, page, formFactor) (generated)
```

`summary.md` contains four sections in this order:
1. **Astro vs Next.js head-to-head** — per sample group, scores + timings side by side with deltas.
2. **Per framework total** — averages across all Astro pages vs all Next.js pages.
3. **Per site** — averages across each site's pages.
4. **Per page** — one row per (site, page, form factor) — the raw data table.

## Adjusting page coverage

Pages come from `sites.config.js`. Add or remove entries per site — the runner and aggregator pick up changes automatically. The Skatepark entries intentionally test only the homepage because the source repo has no BackstopJS config enumerating its pages.

## Notes

- Runs are sequential on purpose: parallel Lighthouse runs on the same machine contend for CPU and skew performance scores.
- Chrome is launched once and reused across all runs.
- If a single run fails, the error is written to `error.txt` in its report folder and the sweep continues.
