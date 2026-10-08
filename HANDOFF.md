# Profiley Resume Builder handoff

## Project
Profiley: a React resume builder with real-time WYSIWYG editing, 10+ templates, drag-and-drop layouts, Firebase persistence and client-side PDF export. Built by Laksh as a personal project (2025); his own resume is published at `/laksh`.

## Links
- Live: https://profiley.lakshpradhwani.com (old profiley.lakshp.live is dead)
- Repo: https://github.com/TheRealLaksh/Profiley-Resume-Builder (push to `main` auto-deploys on Vercel, project `profiley-resume-builder`)
- Local: `C:\Users\laksh\OneDrive\Documents\Personal Projects\Profiley-Resume-Builder`
- Obsidian: `05 Resources\Domains.md`, domain audit `05 Resources\lakshp.live Usage Audit.md`, `02 Projects\Past Projects (2025).md`

## Stack, run, deploy
React 19, Vite, Tailwind, Firebase, html2canvas + jsPDF/html2pdf, lucide-react.
`npm run dev` / `npm run build` / `npm run lint`. Deploy = push to `main`. `vercel.json` rewrites everything to `index.html` (SPA).

## Code map
- `index.html`: meta, canonical, og/twitter tags
- `Robots.txt` (repo root, not in `public/`, so it is not served as /robots.txt)
- `src/data/initialState.js`: default resume data (email, portfolio link)
- `src/components/Modals/ShareModal.jsx`: custom public-URL prefix shown to users
- `public/`: favicon, og-image.png, `_redirects`

## Status
Migrating off the expired lakshp.live. Site, canonical/meta, sitemap line, share prefix and default portfolio link now use lakshpradhwani.com. Default email `contact@lakshp.live` still to swap (waiting on email forwarding). `npm run build` not run here if `node_modules` is missing.

## Next steps
1. Replace `contact@lakshp.live` with `work@lakshpradhwani.com` in `src/data/initialState.js` once forwarding works.
2. Add `profiley.lakshpradhwani.com` to Firebase authorized domains (Auth settings), otherwise Google sign-in fails on the new domain.
3. Check the `/laksh` public resume page and the exported PDF carry the new links.

## Open questions / waiting on
- There is no `sitemap.xml` in `public/`; `/sitemap.xml` returns the SPA index page (200) because of the catch-all rewrite. `Robots.txt` also sits outside `public/`. Decide whether to add a real sitemap and move robots.txt.
- Email forwarding (ImprovMX) for work@ and me@lakshpradhwani.com: Laksh signs up first.

## Decisions not to undo
- Domain is lakshpradhwani.com. Never reintroduce lakshp.live.
- Laksh chose small commits, pushed after each (every push to `main` goes live). Session of 8 Oct 2026.

## Session log (newest first)
- 2026-10-08: added HANDOFF.md and the handoff hooks (Stop hook, pre-commit, `scripts/handoff.mjs`).

<!-- handoff:auto:start -->
## Auto: repo state

_Refreshed 8 Oct 2026, 11:59 pm IST by `scripts/handoff.mjs` (runs on every commit). Don't edit inside this block._

Branch: `main` · remote: https://github.com/TheRealLaksh/Profiley-Resume-Builder

### Last 15 commits

- `54d704b` 2026-02-01 18:04 Create vercel.json
- `ab28c1b` 2026-01-13 14:16 Update App.jsx
- `fa5bdae` 2026-01-13 14:12 zoomm
- `5b26b97` 2026-01-13 14:06 organising code
- `7b85c5a` 2026-01-13 13:56 Update App.jsx
- `da2e648` 2026-01-13 13:46 preview
- `c9d99ed` 2026-01-13 13:30 fork
- `04721bf` 2026-01-13 13:22 read only
- `6be9724` 2026-01-13 09:31 Update PreviewHelpers.jsx
- `a8d299c` 2026-01-13 09:29 Update PreviewHelpers.jsx
- `9b42bc1` 2025-12-30 22:10 seo update
- `dac9c8a` 2025-12-15 14:17 update
- `ee62761` 2025-12-15 14:04 added minor features
- `ace0ca5` 2025-12-15 13:57 some fixes
- `acfe30d` 2025-12-15 13:53 added Mobile UI

### Uncommitted changes at refresh time

```
A  .claude/settings.json
A  .githooks/pre-commit
A  CLAUDE.md
A  HANDOFF.md
A  scripts/handoff.mjs
```
<!-- handoff:auto:end -->
