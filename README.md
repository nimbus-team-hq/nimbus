# Nimbus

A small practice app for "several designers in one repository". Three screens: Dashboard, Settings and UI kit.

```bash
npm ci
npm run dev        # http://localhost:5173
npm run check      # lint + typecheck + build, the same as the `verify` check on every PR
```

How we work here:
- One task = one branch = one pull request.
- `main` changes only through a PR, and a human merges it.
- Shared components (`src/components`) and tokens (`src/tokens`) go in a separate small PR: add a variant, keep the default.
- Rules for coding agents are in `AGENTS.md` (Claude Code reads it through `CLAUDE.md`).

Branch rules on `main` live in `.github/rulesets/main.json`, so they are reviewed like code. The repository owner turns
them on (Settings → Rules → Rulesets → Import a ruleset); only repository admins can change them. They hold for
everyone, admins included: no direct pushes, no force pushes, no deletion; a PR needs a green `verify` check and an
approval from `@nimbus-team-hq/engineers`; a new push dismisses earlier approvals; squash merge only.
