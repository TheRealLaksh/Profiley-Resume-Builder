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
- `src/ai/`: `tasks.js` (shared prompts/schemas/limits for tailor + parse, used by server and browser), `client.js` (server first, falls back to the user's own key), `useAiStatus.js`; `api/ai.js` is the Vercel function (same-origin check, size caps, per-IP in-memory rate limit)
- `src/ats/analyze.js`: ATS reading emulation and scored checks; UI in `Editor/ReviewTab.jsx` + `Editor/review/` (AtsPanel, TailorPanel, AiSetup)
- `src/import/`: `formats.js` (backup, JSON Resume), `pdfText.js` (pdf.js, lazy), `heuristic.js` (no-AI reader), `fromAi.js`; UI in `Modals/ImportModal.jsx`
- `src/components/Preview/Editable.jsx` + `editContext.js`: click-to-edit on the main canvas only (not shared/read-only, thumbs or print)
- `src/utils/pdfManager.js`: Download PDF (html2canvas image per page + invisible text layer + link annotations, page breaks planned in text gaps, fit-to-one-page shrink up to 15%, margins and sidebar colour on continuation pages) and `printResume` (browser print with the same fit via the `--print-fit` CSS variable)
- `src/components/UI/Logo.jsx`: the logo (page-shaped P + outlined Instrument Serif wordmark, inline SVG, colours from theme tokens incl. `--c-accent-fold`); used by TopBar, AppSkeleton, MobileLayout
- `public/`: `favicon.svg` (adaptive tile, light/dark), `favicon.ico`, `apple-touch-icon.png`, `icon-192/512(.maskable).png` + `site.webmanifest`, og-image.png, `_redirects`, `robots.txt` (served; moved here by the merged PR #1 `claude/pensive-meitner-opz77b`, which also hardened sharing/saved data, fixed preview/PDF export and dropped unused dependencies)

## Status
Merged to `main` and deployed (9 Oct 2026): AI "tailor to job", ATS check, click-to-edit and import/export (PDF/text/backup/JSON Resume), on top of the PR #2 redesign (design system with light/dark, new editor, mobile fit/pinch, 16 templates). Lint, `npm run build`, API handler test (stubbed fetch) and Playwright suites pass. Real Anthropic calls and real Firestore shares are untested (no key / no Firestore in the sandbox). `ANTHROPIC_API_KEY` is deliberately NOT set (Laksh doesn't want to pay): with no server key and no user key, Job match runs in a free copy-paste mode (Copy prompt, run it in claude.ai or Claude in Chrome, paste the JSON reply back; `buildManualPrompt`/`parseManualReply` in `src/ai/tasks.js`, UI in `TailorPanel.jsx`). Import's AI read is still key-only; the basic reader is free. Print CSS caps letter-spacing at 0.05em so the text PDF extracts cleanly. `vercel.json` rewrite excludes `/api/`. Domain migration: the default email is `work@lakshpradhwani.com` (Cloudflare Email Routing forwards it to Laksh's Gmail).

## Next steps
00. PDF audit fixes (9 Oct 2026) are on branch `claude/pensive-meitner-opz77b`, not yet merged: after merging, download a PDF from production in a few templates and check the text selects/searches.
0. Do NOT set `ANTHROPIC_API_KEY` unless Laksh decides to pay. Try Review > Job match (copy-paste mode) on production.
1. The app uses Firestore only (no Firebase Auth, so no authorized-domains step). If the Firebase browser API key has HTTP-referrer restrictions in Google Cloud Console (APIs & Services > Credentials), add `https://profiley.lakshpradhwani.com/*` or share links will fail on the new domain.
3. After merging PR #2: create a share link on production and open it in a private window (never tested against real Firestore), and confirm the `/laksh` page still renders with the new `config.activeTemplate` (older shared docs have none and fall back to defaults).
4. Check the `/laksh` public resume page and the exported PDF carry the new links.

## Open questions / waiting on
- Server key stays off (cost); AI is copy-paste or bring-your-own-key only. Firestore security rules are not in the repo; check them.
- Old domain `profiley.lakshp.live` must be removed by hand in the Vercel dashboard (Domains); no tool available for it.
- `public/robots.txt` points at `/sitemap.xml`, but there is no `sitemap.xml` in `public/`; that URL returns the SPA index page (200) because of the catch-all rewrite. Decide whether to add a real sitemap.
- Email forwarding for work@ and me@lakshpradhwani.com is set up (Cloudflare Email Routing); a real delivery test mail has not been sent yet.

## Decisions not to undo
- Logo (9 Oct 2026): "Page-P", a P whose silhouette is a dog-eared page (spruce body, lighter fold), wordmark in Instrument Serif with an accent-coloured i-dot. Chosen over a document-icon-with-P (too generic) and a stacked-layers P (reads as a drop shadow). Source art and exports: Obsidian `05 Resources/Profiley Logo/`. The old glowing 3D neon favicon is retired; don't bring it back.
- Domain is lakshpradhwani.com. Never reintroduce lakshp.live.
- Laksh chose small commits, pushed after each (every push to `main` goes live). Session of 8 Oct 2026.

## Session log (newest first)
- 2026-10-09: new 1200x630 social card (`public/og-image.png`, logo lockup + tagline) replacing the old one. Link-preview scrapers cache the old image; re-scrape with the Facebook Sharing Debugger / LinkedIn Post Inspector if it doesn't update.
- 2026-10-09: new favicon set (SVG + ICO + apple-touch + 192/512/maskable PNG + `site.webmanifest`) wired in `index.html`; removed the 4 MB neon `favicon.png` and unused `vite.svg`.
- 2026-10-09: PDF audit. Download PDF used to be image-only (no selectable/ATS text), sliced lines and columns at the page edge, left continuation pages without margins or sidebar colour, and had no metadata. Rewrote `pdfManager.js` (dropped html2pdf.js for direct html2canvas + jsPDF), added "Fit to one page" toggle in Export, print path fit/break rules in `index.css`. Verified on all 16 templates plus an 11-role stress resume with a photo: text extracts cleanly, links kept, no cut lines.
- 2026-10-09: merged the AI/ATS/click-to-edit/import branch into `main` (merged `main` first; kept both sides of HANDOFF).
- 2026-10-09: new logo. `Logo.jsx` now draws the Page-P mark + outlined wordmark as inline SVG; added `--c-accent-fold` token (light/dark).
- 2026-10-09: default email in `src/data/initialState.js` changed from `contact@lakshp.live` to `work@lakshpradhwani.com`.
- 2026-10-08: added the free copy-paste Job match mode (no API key needed); Playwright-verified clipboard prompt, fenced reply parsing, bogus-id suggestions dropped.
- 2026-10-08: added AI tailor-to-job (`api/ai.js`, `src/ai/`), ATS check (`src/ats/`), click-to-edit (`Editable.jsx`), import/export (`src/import/`), Review tab and mobile 5-item nav; export-clone text-drift fix and ATS-safe print tracking.
- 2026-10-08: redesigned the editor UI and added six templates (PR #2); merged `main` into the branch (resolved `index.html`: kept the new font list and the lakshpradhwani.com canonical).
- 2026-10-08: replaced lakshp.live with lakshpradhwani.com in `index.html` (canonical, og, twitter), `public/robots.txt` and the default portfolio link; email default still pending. Rebased onto remote PR #1 (kept its ShareModal and index.html structure).
- 2026-10-08: added HANDOFF.md and the handoff hooks (Stop hook, pre-commit, `scripts/handoff.mjs`).

<!-- handoff:auto:start -->
## Auto: repo state

_Refreshed 9 Oct 2026, 1:43 pm IST by `scripts/handoff.mjs` (runs on every commit). Don't edit inside this block._

Branch: `main` · remote: https://github.com/TheRealLaksh/Profiley-Resume-Builder

### Last 15 commits

- `fb7ad38` 2026-10-09 13:43 Replace the neon favicon with the Page-P icon set
- `9054d3b` 2026-10-09 13:40 Add the Page-P logo to the app header
- `9a3f78a` 2026-10-09 03:19 Merge pull request #4 from TheRealLaksh/claude/pensive-meitner-opz77b
- `4c00e99` 2026-10-08 20:50 Correct the Firebase domain note in HANDOFF (Firestore only, no Auth)
- `181c8d5` 2026-10-08 20:49 Fix the downloaded PDF: real text layer, clean page breaks, fit to one page
- `3ba52fb` 2026-10-09 01:48 Merge pull request #3 from TheRealLaksh/claude/pensive-meitner-opz77b
- `bd3bd50` 2026-10-08 20:18 Merge main into the AI features branch
- `b887246` 2026-10-08 19:53 Add free copy-paste Job match for people without an API key
- `895cb20` 2026-10-08 19:38 Add AI job tailoring, ATS check, click-to-edit and resume import
- `3f7cd39` 2026-10-09 00:33 Default resume email to work@lakshpradhwani.com
- `fdb119a` 2026-10-09 00:14 Merge pull request #2 from TheRealLaksh/claude/pensive-meitner-opz77b
- `f5ee859` 2026-10-08 18:43 Merge main into the redesign branch
- `45f256b` 2026-10-08 23:59 Update HANDOFF after rebase onto PR #1
- `168ef15` 2026-10-08 23:59 Point Profiley URLs at lakshpradhwani.com
- `940c187` 2026-10-08 23:59 Add HANDOFF.md and handoff hooks

### Uncommitted changes at refresh time

```
M  HANDOFF.md
M  public/og-image.png
```
<!-- handoff:auto:end -->
