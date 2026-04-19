import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { sites } from '../sites.config.js';
import { waitForUrl } from './wait-for-port.js';
import { killTree } from './kill-tree.js';
import { aggregate } from './aggregate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

function parseArgs(argv) {
  const args = { reference: false, site: null, aggregate: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--reference') args.reference = true;
    else if (a === '--site') args.site = argv[++i];
    else if (a === '--no-aggregate') args.aggregate = false;
    else if (a === '-h' || a === '--help') {
      printHelp();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${a}`);
      printHelp();
      process.exit(2);
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage: node src/runner.js [options]

Options:
  --reference          Regenerate reference screenshots from Next.js dev servers
                       (default: run backstop tests against Astro dev servers).
  --site <id>          Run only the named site (e.g. product-listing).
  --no-aggregate       Skip the aggregate step at the end.
  -h, --help           Show this help.
`);
}

let activeChild = null;
let interrupted = false;

async function shutdownActiveChild() {
  if (activeChild?.pid) {
    await killTree(activeChild.pid);
    activeChild = null;
  }
}

process.on('SIGINT', async () => {
  interrupted = true;
  console.log('\n[runner] SIGINT — killing active dev server…');
  await shutdownActiveChild();
  process.exit(130);
});

function spawnDevServer({ cwd, npmScript, label }) {
  const child = spawn('npm', ['run', npmScript], {
    cwd,
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '0' },
  });
  const prefix = `[${label}]`;
  child.stdout.on('data', (b) => process.stdout.write(`${prefix} ${b}`));
  child.stderr.on('data', (b) => process.stderr.write(`${prefix} ${b}`));
  child.on('error', (err) => console.error(`${prefix} spawn error: ${err.message}`));
  return child;
}

function runBackstop({ cwd, npmScript, label }) {
  return new Promise((resolve) => {
    const child = spawn('npm', ['run', npmScript], {
      cwd,
      shell: true,
      stdio: 'inherit',
    });
    child.on('exit', (code) => {
      console.log(`[${label}] backstop exited with code ${code}`);
      resolve(code ?? -1);
    });
    child.on('error', (err) => {
      console.error(`[${label}] backstop spawn error: ${err.message}`);
      resolve(-1);
    });
  });
}

async function runOne(site, mode) {
  const isReference = mode === 'reference';
  const kitRel = isReference ? site.nextKitDir : site.kitDir;
  const port = isReference ? site.nextPort : site.astroPort;
  const devScript = isReference ? 'next:dev' : 'dev';
  const backstopScript = isReference ? 'reference' : 'test';
  const kitDir = path.resolve(repoRoot, kitRel);
  const backstopDir = path.resolve(repoRoot, site.kitDir, 'backstop');
  const label = `${site.id}/${isReference ? 'next' : 'astro'}`;

  console.log(`\n=== ${label} ===`);
  console.log(`[${label}] starting dev server in ${kitRel} (port ${port})`);
  activeChild = spawnDevServer({ cwd: kitDir, npmScript: devScript, label });

  try {
    await waitForUrl(`http://localhost:${port}/`, { timeoutMs: 120_000 });
    console.log(`[${label}] dev server ready on :${port}`);
  } catch (err) {
    console.error(`[${label}] dev server never became ready: ${err.message}`);
    await shutdownActiveChild();
    return { site: site.id, mode, ok: false, exitCode: null, reason: 'dev-server-timeout' };
  }

  const exitCode = await runBackstop({ cwd: backstopDir, npmScript: backstopScript, label });

  console.log(`[${label}] killing dev server…`);
  await shutdownActiveChild();

  // backstop exits 0 = all scenarios pass, 1 = mismatches found (still ran cleanly),
  // anything else = real error (crash, bad config, dev server unreachable, …).
  const ran = exitCode === 0 || exitCode === 1;
  const status = exitCode === 0 ? 'pass' : exitCode === 1 ? 'mismatches' : 'error';
  return { site: site.id, mode, ran, status, exitCode };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const mode = args.reference ? 'reference' : 'test';

  const enabled = args.site ? sites.filter((s) => s.id === args.site) : sites;
  if (enabled.length === 0) {
    console.error(`No sites match --site ${args.site}. Known: ${sites.map((s) => s.id).join(', ')}`);
    process.exit(2);
  }

  console.log(`[runner] mode=${mode} sites=${enabled.map((s) => s.id).join(', ')}`);

  const results = [];
  for (const site of enabled) {
    if (interrupted) break;
    const result = await runOne(site, mode);
    results.push(result);
  }

  console.log('\n=== Run summary ===');
  for (const r of results) {
    if (r.status === 'pass') console.log(`  ${r.site}: PASS`);
    else if (r.status === 'mismatches') console.log(`  ${r.site}: completed (mismatches found — see summary.md)`);
    else console.log(`  ${r.site}: ERROR (${r.reason ?? `exit ${r.exitCode}`})`);
  }

  if (mode === 'test' && args.aggregate) {
    console.log('\n[runner] aggregating reports…');
    const summaryPath = await aggregate({ siteIds: enabled.map((s) => s.id) });
    console.log(`[runner] summary written: ${summaryPath}`);
  }
}

main().catch(async (err) => {
  console.error('[runner] fatal:', err);
  await shutdownActiveChild();
  process.exit(1);
});
