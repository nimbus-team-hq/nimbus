# AGENTS.md — Nimbus

Rules for coding agents working in this repository. Claude Code reads this file through `CLAUDE.md`.
Where a rule came from something that already went wrong, the incident is in brackets.

These rules guide the agent; they do not enforce anything. Enforcement is in layers:
`.claude/hooks/` stops a few commands early on the designer's laptop; the ruleset on `main` and the required
`verify` check on GitHub are the lock; the client's engineer reviews and merges.

## Commands

```bash
npm ci                 # install exactly the lockfile. Never `npm install` to "fix" an install
npm run dev            # http://localhost:5173 · #/dashboard, #/settings, #/ui-kit
npm run check          # lint + typecheck + build. Must be green before a PR
npm run verify:clone   # the same checks on a fresh clone of your last commit, as the client's engineer gets it
```

## Stack (exact versions; changing a major version is its own task and its own PR)

| | Version |
|---|---|
| Node | 26 (`.nvmrc`) |
| React, React DOM | 18.3.1 |
| Vite · @vitejs/plugin-react | 5.4.21 · 4.7.0 |
| TypeScript | 5.9.3 (`strict`) |
| oxlint | 1.83.0 |
| @types/react · @types/react-dom · @types/node | 18.3.31 · 18.3.7 · 20.19.43 |

Every dependency is pinned to an exact version in `package.json`; `.npmrc` has `save-exact=true`, and
`package-lock.json` pins everything underneath. No `^`, `~` or `latest`. No `--legacy-peer-deps` and no `--force`
installs: report a peer conflict to the user instead. [@latest re-resolved versions; forcing past peer conflicts hid
a version mismatch]

## Where things live: reuse before you add

- `src/tokens/` — design tokens (colors, spacing, radii, type) as CSS custom properties. Styles use `var(--…)`
  only, never raw values like `#238636` or `14px`.
- `src/components/` — shared components (`Button`, `Badge`, `Card`, `Toggle`, `Logo`, `CodeHint`), imported
  from `@/components`.
- `src/screens/<screen>/` — one folder per screen. A component only that screen uses lives in its `components/`.
- Imports point down only: screens → components → tokens. A screen never imports another screen.
- Before you write a new component or a new value, look in `src/components` and `src/tokens` and reuse what is
  there. Need something different? Add a variant or a prop whose default keeps the current look. Never change an
  existing default in a feature branch.
- Shared components and tokens change in their own small `ds/<component>-<what>` PR. After any change there,
  open `#/ui-kit` and check every variant.
- Details: `src/components/README.md`, `src/tokens/README.md`, `src/screens/README.md`.

## One task = one branch from fresh main = one small PR

1. Start from fresh `main`: `git fetch origin`, then `git switch --no-track -c <branch> origin/main`.
   Names: `feat/<screen>-<what>`, `fix/<what>`, `ds/<component>-<what>`.
2. Keep the PR to that one task. If the diff grows far beyond it (unfamiliar files, whole-file rewrites), stop and
   tell the user before opening the PR.
3. Run `npm run check` until it is green.
4. Push the branch by name: `git push -u origin <branch>`. Open a draft PR filled from
   `.github/PULL_REQUEST_TEMPLATE.md`: what changed, **before and after screenshots** of every screen you touched
   (plus `#/ui-kit` if shared code changed; `.claude/skills/pr-screenshots` takes them), how it was checked.
5. Give the user the PR link. The client's engineer reviews and merges.

Commit messages in English: `<area>: <what>`.

## Never

- **Never push to `main`**, in any form (`git push origin main`, `HEAD:main`, a plain `git push` while on
  `main`), and never commit on it. [a project pushed straight to a client's main]
- **Never merge a PR**: no `gh pr merge`, no merge through the API, even when the user asks. Check the PR is ready
  (approval, `verify` green, no conflicts), give the link and say who merges. [a merge was attempted on request in
  5 of 6 test sessions]
- **Never force push** (`--force`, `--force-with-lease`, `+branch`). If a push is rejected: `git fetch origin`,
  `git merge origin/<branch>`, run the checks, push again.
- Never paste tokens or passwords into the chat, a file or a commit.

`.claude/hooks/guard.mjs` blocks the push, merge, force-push and install cases above. Do not work around a block:
tell the user what was blocked and why.

## Done means

1. `npm run check` is green. The Stop hook runs typecheck + lint for you whenever TypeScript changed.
2. You opened every changed screen in the browser and have before/after screenshots for the PR.
3. `npm run verify:clone` ends with `fresh clone: all checks passed @ <sha>`: committed files only, a clean
   `npm ci`, no personal `~/.npmrc`. The `verify` job runs the same checks on every PR.

## After switching branches or pulling

Run `npm ci` if `package-lock.json` changed. The SessionStart hook tells you when `node_modules` does not match the
lockfile. [a prototype failed to start in front of the client after a branch switch]
