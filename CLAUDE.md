@HANDOFF.md

# Working on Profiley

- `HANDOFF.md` (imported above) is the project's memory across sessions. Start from it.
- **After every change, update `HANDOFF.md` before replying**: Status, Next steps, Open questions, Decisions, and a dated line in the Session log. Never edit inside the `handoff:auto` block; `scripts/handoff.mjs` rewrites it on each commit.
- A Stop hook (`.claude/settings.json`) blocks finishing a turn if project files are newer than `HANDOFF.md`.
- Git hooks live in `.githooks/` (`git config core.hooksPath .githooks`; re-run after a fresh clone).
- Deploy = push to `main` (Vercel auto-deploys). Run `npm run build` first.
- The old domain `lakshp.live` is expired. Never add it back; use `lakshpradhwani.com`.
