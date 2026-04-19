import treeKill from 'tree-kill';
import { promisify } from 'node:util';

const treeKillAsync = promisify(treeKill);

export async function killTree(pid, signal = 'SIGKILL') {
  if (!pid) return;
  try {
    await treeKillAsync(pid, signal);
  } catch (err) {
    // Process tree may already be gone — that's fine.
    const msg = err?.message ?? '';
    const alreadyGone =
      err?.code === 'ESRCH' ||
      /not found/i.test(msg) ||
      /no such process/i.test(msg);
    if (!alreadyGone) {
      console.warn(`[kill-tree] pid ${pid}: ${msg}`);
    }
  }
}
