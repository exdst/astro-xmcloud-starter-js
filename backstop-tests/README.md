# backstop-tests

One-command orchestrator that runs BackstopJS visual-regression tests across the Astro example kits and aggregates a single summary report.

Tests three kits sequentially (they share localhost ports, so parallel runs aren't safe):

- `examples/kit-astro-product-listing`
- `examples/kit-astro-article-starter`
- `examples/kit-astro-location-finder`

Skate-park has no backstop config and is skipped.

## Install

```bash
cd backstop-tests
npm install
```

Each kit's own `backstop/` folder must already have its dependencies installed (run `npm install` inside it once, if you haven't). The orchestrator does not install kit dependencies for you.

## Usage

### Run tests against Astro (the common case)

```bash
npm test
```

For each kit, the orchestrator:
1. Starts the Astro dev server (`npm run dev` in the kit, port 3005).
2. Polls `http://localhost:3005/` until it responds (timeout: 120s).
3. Runs `npm run test` inside the kit's `backstop/` folder.
4. Tree-kills the dev server.
5. Moves to the next kit.

When all kits finish, it aggregates each kit's latest `report.json` into `reports/summary.md`.

### Run a single kit

```bash
npm test -- --site product-listing
```

Valid `--site` values: `product-listing`, `article-starter`, `location-finder`.

### Regenerate Next.js reference screenshots

Disabled by default. Only needed when the Next.js side has changed and you want fresh references for backstop to compare against.

```bash
npm run reference
```

Same loop as `npm test`, but starts the paired Next.js dev server (`npm run next:dev`, port 3004) and runs `backstop reference` instead of `backstop test`.

### Re-aggregate without re-running

```bash
npm run report
```

Reads each kit's most recent `report.json` from `examples/kit-astro-*/backstop/backstop_data/bitmaps_test/<latest>/` and rewrites `reports/summary.md`. Useful if you ran backstop manually and want the rollup.

## Output

- `reports/summary.md` — overall pass/fail, per-kit table, and failed-scenarios list with links to each kit's full BackstopJS HTML report.
- Each kit's BackstopJS HTML report stays in `examples/kit-astro-*/backstop/backstop_data/html_report/index.html` — open that for the full per-scenario diff view.

## Troubleshooting

**"Port 3005 already in use" on the second kit.** A previous Astro/Next dev server is still running. Kill it:

```bash
# Windows
netstat -ano | findstr :3005
taskkill /F /PID <pid>
```

Then re-run. The orchestrator uses `tree-kill` to take down npm + node + child processes, but if a previous run was hard-killed (e.g., the terminal closed), orphans can survive.

**Dev server never becomes ready.** The 120s timeout is generous — usually means the kit can't actually start. Try `cd examples/kit-astro-X && npm run dev` directly to see the real error.

**`Ctrl+C` during a run.** The runner traps `SIGINT`, kills the active dev server, and exits with code 130. If you see orphan node processes after a `Ctrl+C`, file an issue with the OS / shell info.
