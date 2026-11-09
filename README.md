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
