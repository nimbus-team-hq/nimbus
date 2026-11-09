#!/usr/bin/env node
// SessionStart: is node_modules the tree package-lock.json describes? Compares every name@version in the lockfile
// with npm's own record of what is installed (node_modules/.package-lock.json). Silent when they match.
// Incident: a prototype failed to start in front of the client after switching to a branch with a different
// package.json and not reinstalling. Plain-text stdout from a SessionStart hook is added to Claude's context.
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

let input = {}
if (!process.stdin.isTTY) { let raw = ''; for await (const c of process.stdin) raw += c; try { input = JSON.parse(raw) } catch {} }
const dir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
const lockfile = path.join(dir, 'package-lock.json')
const hidden = path.join(dir, 'node_modules/.package-lock.json')
if (!existsSync(lockfile)) process.exit(0)

if (!existsSync(hidden)) {
  console.log('node_modules is missing or was not installed by npm. Run `npm ci` before running or editing anything.')
  process.exit(0)
}
let want, have
try {
  want = JSON.parse(readFileSync(lockfile, 'utf8')).packages ?? {}
  have = JSON.parse(readFileSync(hidden, 'utf8')).packages ?? {}
} catch { process.exit(0) } // a lockfile we cannot read is npm's problem to report, not a reason to block the session

const diff = []
for (const [p, meta] of Object.entries(want)) {
  if (!p.startsWith('node_modules/')) continue
  const got = have[p]
  if (!got && !meta.optional) diff.push(`${p.slice(13)} missing`)
  else if (got && got.version !== meta.version) diff.push(`${p.slice(13)} ${got.version} ≠ ${meta.version}`)
}
for (const p of Object.keys(have)) if (p.startsWith('node_modules/') && !(p in want)) diff.push(`${p.slice(13)} installed but not in the lockfile`)

if (diff.length) {
  console.log(`node_modules does not match package-lock.json (${diff.length} package(s), e.g. ${diff.slice(0, 3).join('; ')}). ` +
    'This is what stopped a prototype from starting in front of a client after a branch switch. Run `npm ci` before running or editing anything.')
}
