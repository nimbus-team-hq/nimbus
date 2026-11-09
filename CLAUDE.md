# CLAUDE.md

Project: Nimbus, a practice app for designers. Vite + React + TypeScript.
Layers, imports point down only: `src/screens → src/components → src/tokens`. Styles only through `var(--…)` tokens.
A component one screen needs lives in `src/screens/<screen>/components/`; `src/components` holds what two or more screens use.
Checks before a PR: `npm run lint && npm run typecheck && npm run build`. Commit messages in English: `<area>: <what>`.
Write PR descriptions in English using `.github/PULL_REQUEST_TEMPLATE.md`.
