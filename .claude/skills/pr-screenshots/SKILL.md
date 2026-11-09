---
name: pr-screenshots
description: Take "before" and "after" screenshots of a screen for a pull request description. Use when the designer asks for PR screenshots or opens a PR that changes the interface.
---

# Before and after screenshots for a PR

1. Ask which screen to capture (`#/dashboard`, `#/settings` or `#/ui-kit`) if the task does not make it clear.
2. "Before": a temporary copy of fresh `origin/main` in a `mktemp -d` folder (`git worktree add --detach <folder> origin/main`), `npm ci`, start it on a free port, screenshot at 1280×800.
3. "After": the current folder, started on another free port, the same screen and size.
4. Save both files in the temporary folder, not in the repository. Stop the servers and remove the temporary copy (`git worktree remove`).
5. Tell the designer where the files are and that they need to drag them into the Screenshots table in the PR description: images cannot be uploaded to a PR from the terminal.
