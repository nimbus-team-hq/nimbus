#!/usr/bin/env node
// PreToolUse(Bash): stop the few commands that already went wrong for us in client repos.
// Exit 2 = the command does not run, and stderr goes to Claude as the reason. Exit 0 = normal flow.
// This is an early filter on the designer's laptop, not a security boundary: the ruleset on GitHub rejects
// a push to main from anyone, hook or no hook. Each rule names the incident that earned it (AGENTS.md § Never).
import { execFileSync } from 'node:child_process'
import path from 'node:path'

const PROTECTED = new Set(['main', 'master'])

let raw = ''; for await (const c of process.stdin) raw += c
let input
try { input = JSON.parse(raw) } catch { process.exit(0) } // unreadable input: a broken guard must not block all work
const cmd = String(input?.tool_input?.command ?? '')
const cwd = input?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd()

// Split a command line into segments on && || ; | & ( ) and newlines outside quotes, and each segment into words.
function segments(line) {
  const out = []; let words = [], cur = '', inWord = false, q = null
  const word = () => { if (inWord) words.push(cur); cur = ''; inWord = false }
  const seg = () => { word(); if (words.length) out.push(words); words = [] }
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (q) { if (c === q) q = null; else if (c === '\\' && q === '"' && i + 1 < line.length) cur += line[++i]; else cur += c; continue }
    if (c === "'" || c === '"') { q = c; inWord = true } else if (c === '\\' && i + 1 < line.length) { cur += line[++i]; inWord = true }
    else if ('\n;|&()'.includes(c)) seg()
    else if (c === ' ' || c === '\t') word()
    else { cur += c; inWord = true }
  }
  seg(); return out
}

const currentBranch = (dir) => {
  try { return execFileSync('git', ['-C', dir, 'symbolic-ref', '--short', '-q', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 3000 }).trim() } catch { return null }
}
const bare = (ref) => ref.replace(/^\+/, '').replace(/^refs\/heads\//, '')

// Drop `FOO=bar`, `env`, `command`, `exec`, `sudo` in front of the real program.
function strip(w) {
  let i = 0
  for (;;) {
    while (i < w.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(w[i])) i++
    if (['env', 'command', 'exec', 'sudo'].includes(w[i])) { i++; continue }
    return w.slice(i)
  }
}

// `git [-C dir] [-c k=v] [--no-pager …] <sub> <args>` → { dir, sub, args }
function parseGit(w, dir) {
  if (path.basename(w[0] ?? '') !== 'git') return null
  let i = 1
  while (i < w.length && w[i].startsWith('-')) {
    if (w[i] === '-C') { dir = path.resolve(dir, w[i + 1] ?? '.'); i += 2 } else if (w[i] === '-c') i += 2; else i++
  }
  return i < w.length ? { dir, sub: w[i], args: w.slice(i + 1) } : null
}

const RULES = {
  // Incident: a project pushed straight to a client's main.
  pushMain: 'main changes only through a reviewed pull request. Push your task branch by name (`git push -u origin <task-branch>`) and open a draft PR. Do not follow git\'s `HEAD:main` hint.',
  // No incident of ours yet: force push rewrites history other people already pulled, and the ruleset protects only main.
  force: 'force push rewrites history on GitHub and can erase other people\'s commits. If the push was rejected: `git fetch origin`, `git merge origin/<branch>`, run `npm run check`, push again.',
  // Incident: a merge was attempted on request in 5 of 6 test sessions.
  merge: 'merging a PR is the client engineer\'s decision, even when the user asks. Do not run or offer it: check the PR is ready (approval, `verify` green, no conflicts) and give the user the link.',
  // Incident: @latest re-resolved versions.
  latest: 'installing @latest re-resolves versions. Install an exact version (`npm i <pkg>@<x.y.z>`); see AGENTS.md § Stack.',
  // Incident: forcing past peer conflicts hid a version mismatch.
  peers: 'forcing past peer conflicts hides a version mismatch. Stop and report the conflict to the user instead.',
}

function checkPush(g) {
  const a = g.args
  if (a.some((w) => /^--force(-with-lease|-if-includes)?(=|$)/.test(w) || /^-[a-zA-Z]*f[a-zA-Z]*$/.test(w))) return RULES.force
  if (a.includes('--all') || a.includes('--mirror')) return RULES.pushMain // would push main too
  const pos = []
  for (let i = 0; i < a.length; i++) {
    if (['-o', '--push-option', '--repo', '--receive-pack', '--exec'].includes(a[i])) { i++; continue }
    if (!a[i].startsWith('-')) pos.push(a[i])
  }
  const refspecs = pos.slice(1) // pos[0] is the remote
  if (refspecs.some((r) => r.startsWith('+'))) return RULES.force
  const here = () => currentBranch(g.dir)
  // A plain `git push`, or a target built with $VAR / $(…) / `…` that we cannot read: on main it most likely is main.
  if (refspecs.length === 0 || refspecs.some((r) => /[$`]/.test(r))) return PROTECTED.has(here()) ? RULES.pushMain : null
  for (const r of refspecs) {
    const [src, dst = src] = r.split(':') // `:main` (delete main) has an empty src and dst = main
    const target = dst === 'HEAD' || dst === '@' ? here() : bare(dst)
    if (target && PROTECTED.has(target)) return RULES.pushMain
  }
  return null
}

function checkSegment(words, dir) {
  const w = strip(words)
  const exe = path.basename(w[0] ?? '')
  if (['bash', 'sh', 'zsh'].includes(exe) && w.includes('-c')) return analyze(w[w.indexOf('-c') + 1] ?? '', dir)
  if (exe === 'eval') return analyze(w.slice(1).join(' '), dir)
  if (exe === 'gh') {
    // gh takes flags before the subcommand (`gh -R owner/repo pr merge 1`), so match the positional words.
    // Found by the agent's own guard test on 09.11: `gh -R … pr merge` used to pass.
    const pos = []
    for (let i = 1; i < w.length; i++) {
      if (w[i] === '-R' || w[i] === '--repo') { i++; continue }
      if (!w[i].startsWith('-')) pos.push(w[i])
    }
    if (pos[0] === 'pr' && pos[1] === 'merge') return RULES.merge
    if (w[1] === 'api' && w.some((x) => /\/pulls\/\d+\/merge\b/.test(x) || /mergePullRequest|enablePullRequestAutoMerge/.test(x))) return RULES.merge
    return null
  }
  if (exe === 'curl' && w.some((x) => /\/pulls\/\d+\/merge\b/.test(x))) return RULES.merge
  if (['npm', 'pnpm', 'yarn', 'bun', 'npx'].includes(exe)) {
    if (w.some((x) => /^--legacy-peer-deps(=true)?$/.test(x) || /^legacy-peer-deps(=true)?$/.test(x))) return RULES.peers
    const sub = w[1]
    const installing = ['i', 'in', 'ins', 'install', 'add', 'ci', 'update', 'up'].includes(sub)
    if (installing && w.includes('--force')) return RULES.peers
    if (installing && w.slice(2).some((x) => /.@latest$/.test(x))) return RULES.latest
    return null
  }
  const g = parseGit(w, dir)
  if (g?.sub === 'push') return checkPush(g)
  return null
}

function analyze(line, dir) {
  // Backstop for wrappers the word parser does not follow (aliases, $(…)): any `git push …:main` text is a push to main.
  if (/\bgit\s+push\b[^;&|\n]*:(refs\/heads\/)?(main|master)(?=[\s"')]|$)/.test(line)) return RULES.pushMain
  for (const words of segments(line)) {
    if (words[0] === 'cd') { dir = path.resolve(dir, words[1] ?? process.env.HOME ?? '.'); continue }
    const why = checkSegment(words, dir)
    if (why) return why
  }
  return null
}

const why = analyze(cmd, cwd)
if (why) { console.error(`Blocked by .claude/hooks/guard.mjs: ${why}`); process.exit(2) }
