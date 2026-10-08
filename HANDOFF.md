# Profiley Resume Builder handoff

## Project
Profiley: a React resume builder with real-time WYSIWYG editing, 16 templates, drag-and-drop layouts, Firebase persistence and client-side PDF export. Built by Laksh as a personal project (2025); his own resume is published at `/laksh`.

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
- `src/data/initialState.js`: default resume data (email, portfolio link)
- `src/components/Modals/ShareModal.jsx`: share dialog
- `src/App.jsx`: app shell (theme, history, shortcuts, share/PDF/print wiring); `src/components/Layout/` top bar, zoom dock, footer, skeleton; `src/hooks/useCanvasZoom.js` fit/zoom/pinch
- `src/components/Editor/`: `ContentTab.jsx` (sections list) + `editors/` per section, `DesignTab.jsx` + `TemplateThumb.jsx` (live thumbnails), `ExportTab.jsx`
- `src/components/Preview/ResumeDocument.jsx`: the A4 page; every look is driven by config keys (see `initialConfig` in `src/data/initialState.js`); `src/data/templates.js` has the 16 templates
- `src/index.css` + `tailwind.config.js`: design tokens (CSS variables, `.dark` class), button/input component classes
- `public/`: favicon, og-image.png, `_redirects`, `robots.txt` (served; moved here by the merged PR #1 `claude/pensive-meitner-opz77b`, which also hardened sharing/saved data, fixed preview/PDF export and dropped unused dependencies)

## Status
UI redesign (PR #2 `claude/pensive-meitner-opz77b`): new design system with light/dark themes, new editor (sections list, design gallery, export tab), mobile fit/pinch, six new templates (Nordic, Atlas, Swiss, Poster, Ledger, Blush) and richer resume style options; also removed a stray `}` after `</html>` and made the chosen template persist. Lint and `npm run build` pass; behaviour checked in headless Chromium (desktop + mobile) with a stubbed Firebase. Share-link creation/loading against real Firestore is untested. Migrating off the expired lakshp.live. Canonical/og/twitter tags, the robots.txt sitemap line and the default portfolio link now use lakshpradhwani.com (the old share-link prefix text was removed by PR #1). The default email is now `work@lakshpradhwani.com` (9 Oct 2026; Cloudflare Email Routing forwards it to Laksh's Gmail). `npm run build` not run in the domain-migration session.

## Next steps
1. Add `profiley.lakshpradhwani.com` to Firebase authorized domains (Auth settings), otherwise Google sign-in fails on the new domain.
3. After merging PR #2: create a share link on production and open it in a private window (never tested against real Firestore), and confirm the `/laksh` page still renders with the new `config.activeTemplate` (older shared docs have none and fall back to defaults).
4. Check the `/laksh` public resume page and the exported PDF carry the new links.

## Open questions / waiting on
- `public/robots.txt` points at `/sitemap.xml`, but there is no `sitemap.xml` in `public/`; that URL returns the SPA index page (200) because of the catch-all rewrite. Decide whether to add a real sitemap.
- Email forwarding for work@ and me@lakshpradhwani.com is set up (Cloudflare Email Routing); a real delivery test mail has not been sent yet.

## Decisions not to undo
- Domain is lakshpradhwani.com. Never reintroduce lakshp.live.
- Laksh chose small commits, pushed after each (every push to `main` goes live). Session of 8 Oct 2026.

## Session log (newest first)
- 2026-10-09: default email in `src/data/initialState.js` changed from `contact@lakshp.live` to `work@lakshpradhwani.com`.
- 2026-10-08: redesigned the editor UI and added six templates (PR #2); merged `main` into the branch (resolved `index.html`: kept the new font list and the lakshpradhwani.com canonical).
- 2026-10-08: replaced lakshp.live with lakshpradhwani.com in `index.html` (canonical, og, twitter), `public/robots.txt` and the default portfolio link; email default still pending. Rebased onto remote PR #1 (kept its ShareModal and index.html structure).
- 2026-10-08: added HANDOFF.md and the handoff hooks (Stop hook, pre-commit, `scripts/handoff.mjs`).

<!-- handoff:auto:start -->
## Auto: repo state

_Refreshed 9 Oct 2026, 12:33 am IST by `scripts/handoff.mjs` (runs on every commit). Don't edit inside this block._

Branch: `main` · remote: https://github.com/TheRealLaksh/Profiley-Resume-Builder

### Last 15 commits

- `fdb119a` 2026-10-09 00:14 Merge pull request #2 from TheRealLaksh/claude/pensive-meitner-opz77b
- `f5ee859` 2026-10-08 18:43 Merge main into the redesign branch
- `45f256b` 2026-10-08 23:59 Update HANDOFF after rebase onto PR #1
- `168ef15` 2026-10-08 23:59 Point Profiley URLs at lakshpradhwani.com
- `940c187` 2026-10-08 23:59 Add HANDOFF.md and handoff hooks
- `6f5ec88` 2026-10-08 18:26 Redesign the editor and add six new resume templates
- `61cf5ba` 2026-10-08 23:30 Merge pull request #1 from TheRealLaksh/claude/pensive-meitner-opz77b
- `97b7340` 2026-10-08 17:57 Define fonts, serve robots.txt, drop unused dependencies
- `ca9f4dc` 2026-10-08 17:57 Fix preview layout, zoom, undo, PDF export and printing
- `d2dded6` 2026-10-08 17:57 Harden sharing and saved data
- `54d704b` 2026-02-01 18:04 Create vercel.json
- `ab28c1b` 2026-01-13 14:16 Update App.jsx
- `fa5bdae` 2026-01-13 14:12 zoomm
- `5b26b97` 2026-01-13 14:06 organising code
- `7b85c5a` 2026-01-13 13:56 Update App.jsx

### Uncommitted changes at refresh time

```
M  HANDOFF.md
M  src/data/initialState.js
```
<!-- handoff:auto:end -->
