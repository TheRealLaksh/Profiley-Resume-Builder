# Profiley Resume Builder handoff

## Project
Profiley: a React resume builder with real-time WYSIWYG editing, 16 templates, drag-and-drop layouts, Firebase persistence and client-side PDF export. Built by Laksh as a personal project (2025); his own resume is published at `/laksh` (since 18 Oct 2026 a hand-built page, not a Firestore share; see Code map).

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
- `src/laksh/` (branch `feat/laksh-resume-custom`, pushed, not merged): Laksh's own resume at `/laksh`. **Default `/laksh` = the standard Profiley read-only view** (`LakshClassic.jsx` renders `App` with `preset` from `classic.js`). Since the 18 Oct research (vault note `01 About Me/Top Package Resume Research (Oct 2026).md`) it is the strict one-page version: ATS Friendly template, no photo, no summary, Education first (all schools, no marks), Experience, Projects (with visible URLs and proof: tests, audits), grouped Skills, Awards. New builder features it uses: `personal.github` field (editor + header) and the `showLinkUrls` config key (prints the real URL instead of the label "LinkedIn"). It overflows A4 by about 6%, which the app's fit-to-one-page print/PDF handles. Missing real numbers to add when Laksh has them: ShiftsDeal venues/bookings/users, freelance sites delivered, Unified Mentor users, Calibridge audit/Lighthouse result. A "Creative view" switch (`ViewSwitch.jsx`, `switch.css`; shown by TopBar and MobileLayout via the `viewSwitch` prop when read-only) goes to `/laksh?view=creative`, the hand-built page; its switch goes back. Strict readers therefore never see the creative page unless they opt in. `main.jsx` lazy-loads both (App and Firebase load only for the standard view and other paths). `content.js` holds all the facts + lens rules (client / recruiter / dev, `?lens=` param, saved in localStorage), `LakshResume.jsx` the page (hero, tinted sections, timeline, project cards with live up/down pings, changelog diff, live ATS card that runs `ats/analyze.js` on the print sheet), `Sheet.jsx` the A4 text version (table with repeating spacer rows so `@page` margin stays 0 and the browser adds no header/footer; printed via the PDF button), `hooks.js` (reveal-on-view, count-up, magnet, tilt, status, scroll progress), `laksh.css` (scoped to `.lk`, light + dark). Photo: `public/laksh/photo.webp`.
- `public/`: `favicon.svg` (adaptive tile, light/dark), `favicon.ico`, `apple-touch-icon.png`, `icon-192/512(.maskable).png` + `site.webmanifest`, og-image.png, `_redirects`, `robots.txt` (served; moved here by the merged PR #1 `claude/pensive-meitner-opz77b`, which also hardened sharing/saved data, fixed preview/PDF export and dropped unused dependencies)

## Status
Merged to `main` and deployed (9 Oct 2026): AI "tailor to job", ATS check, click-to-edit and import/export (PDF/text/backup/JSON Resume), on top of the PR #2 redesign (design system with light/dark, new editor, mobile fit/pinch, 16 templates). Lint, `npm run build`, API handler test (stubbed fetch) and Playwright suites pass. Real Anthropic calls and real Firestore shares are untested (no key / no Firestore in the sandbox). `ANTHROPIC_API_KEY` is deliberately NOT set (Laksh doesn't want to pay): with no server key and no user key, Job match runs in a free copy-paste mode (Copy prompt, run it in claude.ai or Claude in Chrome, paste the JSON reply back; `buildManualPrompt`/`parseManualReply` in `src/ai/tasks.js`, UI in `TailorPanel.jsx`). Import's AI read is still key-only; the basic reader is free. Print CSS caps letter-spacing at 0.05em so the text PDF extracts cleanly. `vercel.json` rewrite excludes `/api/`. Domain migration: the default email is `work@lakshpradhwani.com` (Cloudflare Email Routing forwards it to Laksh's Gmail).

## Next steps
000. Review `feat/laksh-resume-custom` at `/laksh` on a preview, then merge to `main` (push deploys live; Laksh said push only when he says). The old Firestore doc `laksh` is untouched (Laksh chose replace and delete; deleting it needs Firebase access, so it just stops being used). Not tested: window.print() in real Chrome PDF output beyond the on-screen sheet, Safari/Firefox.
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
- `/laksh` (18 Oct 2026): hand-built, not a template. Public data rules: no phone, no marks, no client names (Bestow's), shooting = just "National-level shooter", ShiftsDeal title = "Tech & Growth Intern" (matches LinkedIn), freelance listed without client names, Delhi NCR. Animation = entrance + hover micro-motion only (Laksh declined pinned scroll scenes, scroll-fill text and cursor effects). Light + dark. The ATS card downgrades two checks on purpose (phone left off; image-PDF tip n/a) and says so.
- Logo (9 Oct 2026): "Page-P", a P whose silhouette is a dog-eared page (spruce body, lighter fold), wordmark in Instrument Serif with an accent-coloured i-dot. Chosen over a document-icon-with-P (too generic) and a stacked-layers P (reads as a drop shadow). Source art and exports: Obsidian `05 Resources/Profiley Logo/`. The old glowing 3D neon favicon is retired; don't bring it back.
- Domain is lakshpradhwani.com. Never reintroduce lakshp.live.
- Laksh chose small commits, pushed after each (every push to `main` goes live). Session of 8 Oct 2026.

## Session log (newest first)
- 2026-10-18: deep research on ₹60L-1Cr CS/AI resumes (8 real resumes read; Reddit unreadable; report in the vault) and rebuilt the standard `/laksh` view from its blueprint; added the `github` field and `showLinkUrls`. Lint passes; checked in Chrome. Local commit only.
- 2026-10-18: `/laksh` now defaults to the standard Profiley view with the updated data; the creative page is behind a Creative view switch (`?view=creative`). Lint passes; checked both directions of the switch in Chrome. Not pushed since the first branch push.
- 2026-10-18: built the new `/laksh` resume on branch `feat/laksh-resume-custom` (content from LinkedIn + Obsidian, three lenses, live ATS badge, project status pings, changelog, A4 print sheet, light/dark). Lint and build pass; checked in Chrome desktop, mobile width, light and dark, print sheet on screen. Branch pushed to origin (not main) on Laksh's OK so Vercel can build a preview; main untouched.
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

_Refreshed 18 Oct 2026, 11:16 am IST by `scripts/handoff.mjs` (runs on every commit). Don't edit inside this block._

Branch: `feat/laksh-resume-custom` · remote: https://github.com/TheRealLaksh/Profiley-Resume-Builder

### Last 15 commits

- `c64fe95` 2026-10-18 11:16 Make the standard /laksh view a strict one-page resume; add GitHub field and visible link URLs
- `b57f6ad` 2026-10-18 10:49 HANDOFF: refresh auto block
- `4a49983` 2026-10-18 10:49 Default /laksh to the standard Profiley view with a Creative view switch
- `b07c26e` 2026-10-18 10:44 HANDOFF: note the pushed preview branch
- `b0f207c` 2026-10-18 10:43 Route /laksh to the custom page and update HANDOFF
- `6106795` 2026-10-18 10:43 Add the /laksh resume page: lenses, live ATS check, project status, changelog, print sheet
- `0be32a7` 2026-10-18 10:43 Add content and photo for Laksh's custom resume page
- `1a5f5a5` 2026-10-09 13:43 Refresh the social card with the new logo
- `fb7ad38` 2026-10-09 13:43 Replace the neon favicon with the Page-P icon set
- `9054d3b` 2026-10-09 13:40 Add the Page-P logo to the app header
- `9a3f78a` 2026-10-09 03:19 Merge pull request #4 from TheRealLaksh/claude/pensive-meitner-opz77b
- `4c00e99` 2026-10-08 20:50 Correct the Firebase domain note in HANDOFF (Firestore only, no Auth)
- `181c8d5` 2026-10-08 20:49 Fix the downloaded PDF: real text layer, clean page breaks, fit to one page
- `3ba52fb` 2026-10-09 01:48 Merge pull request #3 from TheRealLaksh/claude/pensive-meitner-opz77b
- `bd3bd50` 2026-10-08 20:18 Merge main into the AI features branch

### Uncommitted changes at refresh time

```
M  HANDOFF.md
```
<!-- handoff:auto:end -->
