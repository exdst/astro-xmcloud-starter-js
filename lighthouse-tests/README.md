# Lighthouse tests — Astro vs Next.js sample sites

Runs Google Lighthouse against the 8 deployed Netlify sample sites (4 Astro + 4 Next.js pairs) and emits aggregated reports so we can compare Astro and Next.js head-to-head.

## Install

```sh
cd lighthouse-tests
npm install
```

## Run

```sh
# Full sweep: every site × every page × mobile + desktop.
# Each (page, form factor) does 1 warm-up run + 3 measurement runs (averaged) by default.
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
- `--runs <n>` — number of measurement runs per (page, form factor). Default 3. Their values are averaged.
- `--no-warmup` — skip the warm-up Lighthouse run that precedes the measurement runs.
- `--no-report` — skip aggregation after the sweep.

### Why warm-up + multiple runs?

The first request to each Netlify URL hits a cold CDN edge and downloads all assets fresh. That cold-cache run has very different timings than steady-state navigation. To get representative numbers:

1. A **warm-up** browser page load is performed first against each (page, form factor) using Puppeteer and the matching viewport. The warm-up:
   - navigates to the URL, waits for `networkidle2`,
   - scrolls the page from top to bottom in steps so `loading="lazy"` and IntersectionObserver-driven images all fire,
   - then explicitly `fetch()`es every `<img>` `currentSrc` (handles `srcset`) as a belt-and-braces measure for any image the DOM-based load missed.
   - All of this primes Netlify's edge cache for the HTML, CSS, JS, fonts, **and every image on the page** before measurement starts.
2. Then **N Lighthouse measurement runs** are taken (default 3) and their per-category scores and key audit timings are averaged.

The warm-up's metrics themselves are discarded — only the cache it populates matters. The aggregated report (`summary.md` / `summary.csv`) reflects the averaged Lighthouse numbers. The `runs.json` file in each report folder preserves per-run values if you want to inspect variance.

## Output

```
reports/
  <site-id>/
    <page-slug>/
      <mobile|desktop>/
        report.html   # human-readable Lighthouse report (from the last measurement run)
        lhr.json      # synthesized Lighthouse result with averaged scores+timings (used by aggregator)
        runs.json     # per-run scores+timings + computed average (for transparency / variance inspection)
        meta.json     # site/page/framework metadata + runs/warmup config used
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
- If a single measurement run fails, it's recorded as `null` in `runs.json` and the average is taken across the surviving runs. If *all* measurement runs for a (page, form factor) fail, an `error.txt` is written and the sweep continues.
- A full sweep with the default 3 runs + warm-up takes ~4× longer than a single-run sweep. Use `--runs 1 --no-warmup` for fast iteration during development.
