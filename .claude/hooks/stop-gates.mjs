#!/usr/bin/env node
// Stop: before Claude says it is done, run typecheck and lint, but only when TypeScript changed in the working tree
// (staged, unstaged or new files). Exit 2 keeps Claude working and hands it the errors on stderr.
// `stop_hook_active` is true when this hook already blocked once in this stop sequence: then we let Claude stop,
// so a gate it cannot fix never loops forever. Commits already made are not re-checked here; the `verify` CI job is.
// Why: `npm run dev` and `vite build` both stay green on a type error; only `tsc` catches it.
import { execFileSync, spawnSync } from 'node:child_process'

let raw = ''; for await (const c of process.stdin) raw += c
let input = {}
try { input = JSON.parse(raw || '{}') } catch {}
if (input.stop_hook_active) process.exit(0)
const dir = input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd()

let status = ''
try { status = execFileSync('git', ['-C', dir, 'status', '--porcelain', '-uall'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }) } catch { process.exit(0) }
const changed = status.split('\n').filter(Boolean).map((l) => l.slice(3).split(' -> ').pop().replace(/^"|"$/g, '')).filter((f) => /\.(ts|tsx)$/.test(f))
if (!changed.length) process.exit(0)

const failures = []
for (const script of ['typecheck', 'lint']) {
  const r = spawnSync('npm', ['run', '-s', script], { cwd: dir, encoding: 'utf8' })
  if (r.status !== 0) failures.push(`npm run ${script} failed:\n` + (r.stdout + r.stderr).split('\n').filter((l) => l.trim()).slice(0, 20).join('\n'))
}
if (failures.length) {
  console.error(`Gates failed with ${changed.length} changed TypeScript file(s) (${changed.slice(0, 5).join(', ')}). Fix before saying done:\n\n` + failures.join('\n\n'))
  process.exit(2)
}
