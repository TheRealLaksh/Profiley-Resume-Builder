// Download PDF: the page is drawn with html2canvas (exact design), then assembled into an A4 PDF with
//   - page breaks placed in the gaps between lines, never through text,
//   - the sidebar/background carried onto every page, with margins on continuation pages,
//   - an invisible text layer and link annotations, so the PDF can be selected, searched and read by ATS,
//   - optional "fit to one page" (a small shrink when the content only just overflows).
// html2canvas and jsPDF are ~400 kB, so everything is loaded lazily on click.

export const PDF_SCALE = { screen: 2, print: 3 };
export const FIT_FLOOR = 0.85; // never shrink the content by more than 15%

const MM_PX = 96 / 25.4;
const PAGE_W_MM = 210;
const PAGE_H_MM = 297;
const MARGIN_MM = 11; // top margin on continuation pages, and bottom margin on every page that continues
const TOLERANCE_PX = 3;

// The editor, the mobile layout and the print copy each render a paper.
// Export the one that is actually on screen.
const findVisiblePaper = () =>
  Array.from(document.querySelectorAll('#root [data-resume-paper="main"]')).find(
    (el) => el.getClientRects().length > 0
  );

const buildFileName = (name) => {
  const safe = (name || '').trim().replace(/[^\w.-]+/g, '_').replace(/^_+|_+$/g, '');
  return `${safe ? `${safe}_Resume` : 'Resume'}.pdf`;
};

/** An off-screen, export-ready copy of the paper that can be re-laid-out at any scale. */
const createStage = (paper) => {
  const clone = paper.cloneNode(true);
  clone.querySelectorAll('[data-editor-only]').forEach((el) => el.remove());
  // A contact line whose only text was an editor placeholder would leave a bare icon behind.
  clone.querySelectorAll('[data-contact]').forEach((el) => { if (!el.textContent.trim()) el.remove(); });
  Object.assign(clone.style, { margin: '0', transform: 'none', boxShadow: 'none', backgroundColor: '#ffffff', height: 'auto' });

  const container = document.createElement('div');
  Object.assign(container.style, { position: 'fixed', top: '-20000px', left: '-20000px', zIndex: '-100' });
  container.appendChild(clone);
  document.body.appendChild(container);

  const minHeightEls = [clone, ...clone.querySelectorAll('[class*="min-h-[297mm]"]')];

  // Lays the page out as if it were 210mm / s wide (and 297mm / s tall). Drawing that onto an A4 page
  // scales it by s, which re-wraps the text like a smaller font instead of just cropping the paper.
  const layoutAt = (s) => {
    clone.style.width = `${PAGE_W_MM / s}mm`;
    minHeightEls.forEach((el) => { el.style.minHeight = `${PAGE_H_MM / s}mm`; });
    return clone.getBoundingClientRect().height;
  };

  return { clone, layoutAt, destroy: () => container.remove() };
};

/**
 * Finds the scale (FIT_FLOOR..1) at which the resume just fits one page, or 1 when it cannot fit
 * (then it simply runs to more pages) or already fits.
 */
const findFitScale = (layoutAt) => {
  const pagePx = PAGE_H_MM * MM_PX;
  const fits = (s) => layoutAt(s) * s <= pagePx + TOLERANCE_PX;
  if (fits(1)) return 1;
  if (!fits(FIT_FLOOR)) return 1;
  let lo = FIT_FLOOR; // fits
  let hi = 1; // does not fit
  for (let i = 0; i < 9; i += 1) {
    const mid = (lo + hi) / 2;
    if (fits(mid)) lo = mid; else hi = mid;
  }
  // Text wrapping is not monotonic in the scale, so back off a little and confirm the value we return really fits.
  let s = Math.max(FIT_FLOOR, Math.floor((lo - 0.004) * 1000) / 1000);
  while (!fits(s) && s > FIT_FLOOR) s = Math.max(FIT_FLOOR, Math.round((s - 0.005) * 1000) / 1000);
  return fits(s) ? s : 1;
};

/** Scale the browser's print dialog should use too, so both PDFs agree. */
export const measureFitScale = () => {
  const paper = findVisiblePaper();
  if (!paper) return 1;
  const stage = createStage(paper);
  try {
    return findFitScale(stage.layoutAt);
  } finally {
    stage.destroy();
  }
};

// ---------------------------------------------------------------------------
// Geometry read from the laid-out clone (before any drawing tweaks)
// ---------------------------------------------------------------------------

const isHidden = (el) => {
  const cs = getComputedStyle(el);
  return cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0;
};

const transformText = (text, el) => {
  const t = getComputedStyle(el).textTransform;
  return t === 'uppercase' ? text.toUpperCase() : t === 'lowercase' ? text.toLowerCase() : t === 'capitalize' ? text.replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : text;
};

// Standard PDF fonts only cover Latin-1 plus a few punctuation marks; map the rest to something extractable.
const EXTRA = { '–': '-', '—': '-', '‘': "'", '’': "'", '“': '"', '”': '"', '•': '*', '·': '.', '…': '...', '→': '->', '₹': 'Rs', ' ': ' ' };
const toLatin = (text) => Array.from(text).map((ch) => (ch.charCodeAt(0) <= 255 && ch.charCodeAt(0) >= 32 ? ch : EXTRA[ch] ?? (ch.charCodeAt(0) < 32 ? '' : '?'))).join('');

const collectGeometry = (clone) => {
  const origin = clone.getBoundingClientRect();
  const rel = (r) => ({ x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height });

  const words = [];
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent || !node.nodeValue.trim() || isHidden(parent)) continue;
    const fontPx = parseFloat(getComputedStyle(parent).fontSize) || 12;
    const value = node.nodeValue;
    for (const match of value.matchAll(/\S+/g)) {
      range.setStart(node, match.index);
      range.setEnd(node, match.index + match[0].length);
      const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0.5 && r.height > 0.5);
      if (!rects.length) continue;
      if (rects.length === 1) {
        words.push({ text: transformText(match[0], parent), ...rel(rects[0]), fontPx });
      } else {
        // A long token that wrapped (an e-mail address, a URL): place it character by character.
        let current = null;
        for (let i = 0; i < match[0].length; i += 1) {
          range.setStart(node, match.index + i);
          range.setEnd(node, match.index + i + 1);
          const r = range.getClientRects()[0];
          if (!r) continue;
          const g = rel(r);
          if (current && Math.abs(current.y - g.y) < current.h / 2) {
            current.text += transformText(match[0][i], parent);
            current.w = g.x + g.w - current.x;
          } else {
            current = { text: transformText(match[0][i], parent), ...g, fontPx };
            words.push(current);
          }
        }
      }
    }
  }

  const links = [];
  clone.querySelectorAll('a[href]').forEach((a) => {
    Array.from(a.getClientRects()).forEach((r) => { if (r.width > 1 && r.height > 1) links.push({ url: a.href, ...rel(r) }); });
  });

  // Spans a page break must not cut through: text lines, chips and entries, pictures and icons, and
  // section headings (which also keep the first lines of their section with them).
  const atoms = words.map((w) => [w.y, w.y + w.h]);
  clone.querySelectorAll('[class*="break-inside-avoid"], img, svg').forEach((el) => {
    const r = rel(el.getBoundingClientRect());
    if (r.h > 0 && r.h < 220) atoms.push([r.y, r.y + r.h]);
  });
  // Boxes, rules and decorations drawn with a background or border must not be cut either.
  clone.querySelectorAll('*').forEach((el) => {
    if (el.tagName === 'IMG' || el.tagName === 'SVG') return;
    const cs = getComputedStyle(el);
    const painted = cs.backgroundImage !== 'none' || Number(cs.backgroundColor.match(/[\d.]+/g)?.[3] ?? 1) > 0.02 && cs.backgroundColor !== 'rgba(0, 0, 0, 0)'
      || ['Top', 'Bottom'].some((side) => parseFloat(cs[`border${side}Width`]) > 0 && cs[`border${side}Style`] !== 'none');
    if (!painted) return;
    const r = rel(el.getBoundingClientRect());
    if (r.h > 0 && r.h < 220 && r.w < origin.width * 0.98) atoms.push([r.y, r.y + r.h]);
  });
  clone.querySelectorAll('h3').forEach((h) => {
    const box = h.parentElement && h.parentElement !== clone && h.parentElement.getBoundingClientRect().height < 50 ? h.parentElement : h;
    const r = rel(box.getBoundingClientRect());
    atoms.push([r.y, r.y + r.h + 22]);
  });

  return { words, links, atoms, height: origin.height, width: origin.width };
};

/** Returns a function that picks, within a gap (clone px), the canvas row with the fewest colour changes. */
const cleanestRowFinder = (source, scale) => (a, b) => {
  const top = Math.max(0, Math.floor(a * scale));
  const bottom = Math.min(source.height - 1, Math.ceil(b * scale));
  if (bottom <= top) return (a + b) / 2;
  const w = source.width;
  const pixels = source.getContext('2d').getImageData(0, top, w, bottom - top + 1).data;
  const middle = (top + bottom) / 2;
  let best = Math.round(middle);
  let bestScore = Infinity;
  for (let row = 0; row <= bottom - top; row += 1) {
    let changes = 0;
    const base = row * w * 4;
    for (let x = 2; x < w; x += 2) {
      const i = base + x * 4;
      const j = i - 8;
      if (Math.abs(pixels[i] - pixels[j]) + Math.abs(pixels[i + 1] - pixels[j + 1]) + Math.abs(pixels[i + 2] - pixels[j + 2]) > 36) changes += 1;
    }
    const score = changes * 10000 + Math.abs(top + row - middle);
    if (score < bestScore) { bestScore = score; best = top + row; }
  }
  return (best + 0.5) / scale;
};

/**
 * Chooses where each page ends. A break goes in a gap with no text, chip, picture or heading across it
 * in any column, preferring roomy gaps (between entries) over tight ones (between wrapped lines).
 * `cleanest(a, b)` picks the row in a gap with the least ink, which is the row the margins are stretched from.
 */
const planPages = ({ atoms, height }, pageH, marginPx, cleanest) => {
  if (height <= pageH + TOLERANCE_PX) return [{ from: 0, to: height }];

  // Merge the blocked spans; the gaps between them are the places a break may go.
  const merged = [];
  atoms.filter(([a, b]) => b > a).sort((p, q) => p[0] - q[0]).forEach(([a, b]) => {
    const last = merged[merged.length - 1];
    if (last && a <= last[1]) last[1] = Math.max(last[1], b); else merged.push([a, b]);
  });
  const gaps = [];
  let cursor = 0;
  merged.forEach(([a, b]) => { if (a > cursor) gaps.push([cursor, a]); cursor = Math.max(cursor, b); });
  if (cursor < height) gaps.push([cursor, height]);

  const pages = [];
  let from = 0;
  while (height - from > (pages.length ? pageH - marginPx : pageH) + TOLERANCE_PX) {
    const room = (pages.length ? pageH - marginPx : pageH) - marginPx; // what a page that continues can hold
    const limit = from + room;
    const floor = from + room * 0.5;
    let cut = null;
    for (const minGap of [7, 3, 0.5]) {
      const found = gaps.filter(([a, b]) => b - a >= minGap && a < limit && Math.min(b, limit) > floor).pop();
      if (found) { cut = cleanest(Math.max(found[0], floor), Math.min(found[1], limit)); break; }
    }
    pages.push({ from, to: cut ?? limit }); // nothing clean: cut at the limit rather than overflow
    from = cut ?? limit;
  }
  pages.push({ from, to: height });
  return pages;
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

/**
 * Renders the visible resume to an A4 PDF and downloads it.
 * Resolves with { pages, scale } (scale < 1 when it was shrunk to fit one page). Rejects when export fails.
 */
export const downloadResumePdf = async ({ name, quality = 'screen', fitOnePage = true, meta = {} } = {}) => {
  const paper = findVisiblePaper();
  if (!paper) throw new Error('The resume preview is not visible.');

  // Capturing before web fonts finish loading would bake in the fallback font.
  await document.fonts?.ready;
  const stage = createStage(paper);

  try {
    const { clone, layoutAt } = stage;
    const fit = fitOnePage ? findFitScale(layoutAt) : 1;
    layoutAt(fit);

    const geometry = collectGeometry(clone);
    const pxToMm = PAGE_W_MM / geometry.width;
    const pageH = PAGE_H_MM / pxToMm;
    const marginPx = MARGIN_MM / pxToMm;
    // html2canvas draws text a few pixels lower than the browser lays it out (about 0.3 to 0.4em for the
    // fonts used here), which pushes labels out of chips and off their icons. Nudge every element
    // that directly holds text back up. This only touches the throwaway clone, after the geometry above was read.
    const holders = new Set();
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.nodeValue.trim() && node.parentElement) holders.add(node.parentElement);
    }
    holders.forEach((el) => {
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.style.top = '-0.36em';
    });

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
    const scale = PDF_SCALE[quality] ?? PDF_SCALE.screen;
    const source = await html2canvas(clone, {
      scale,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      backgroundColor: '#ffffff',
      width: Math.ceil(geometry.width),
      height: Math.ceil(geometry.height),
      windowWidth: Math.ceil(geometry.width)
    });

    const pages = planPages(geometry, pageH, marginPx, cleanestRowFinder(source, scale));

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    const fullName = (name || '').trim();
    pdf.setProperties({
      title: fullName ? `${fullName} - Resume` : 'Resume',
      subject: 'Resume',
      author: fullName,
      keywords: (meta.keywords || []).slice(0, 20).join(', '),
      creator: 'Profiley'
    });

    const pageWpx = source.width;
    const pagePxH = Math.round(pageH * scale);
    const marginCanvas = Math.round(marginPx * scale);
    const rowAt = (y) => Math.min(source.height - 1, Math.max(0, Math.round(y * scale)));

    pages.forEach((page, index) => {
      if (index > 0) pdf.addPage('a4', 'portrait');
      const canvas = document.createElement('canvas');
      canvas.width = pageWpx;
      canvas.height = pagePxH;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const sy = rowAt(page.from);
      const sh = Math.max(1, Math.min(source.height - sy, Math.round((page.to - page.from) * scale)));
      const top = index > 0 ? marginCanvas : 0;
      // Margins repeat the background row from the gap at the break, so a sidebar colour runs on unbroken.
      // Smoothing is off so a one-pixel row is copied as it is instead of being blended into bands.
      ctx.imageSmoothingEnabled = false;
      if (index > 0) ctx.drawImage(source, 0, rowAt(page.from), pageWpx, 1, 0, 0, pageWpx, top);
      ctx.drawImage(source, 0, sy, pageWpx, sh, 0, top, pageWpx, sh);
      const filled = top + sh;
      if (filled < pagePxH) ctx.drawImage(source, 0, rowAt(index === pages.length - 1 ? geometry.height - 3 : page.to), pageWpx, 1, 0, filled, pageWpx, pagePxH - filled);

      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, PAGE_W_MM, PAGE_H_MM, undefined, 'FAST');
      canvas.width = 0;
      canvas.height = 0;

      // Where this page's slice sits on the sheet, in clone pixels.
      const shift = (index > 0 ? marginPx : 0) - page.from;
      const onPage = (y, h) => { const mid = y + h / 2; return mid >= page.from && (mid < page.to || index === pages.length - 1); };

      pdf.setFont('helvetica', 'normal');
      geometry.words.filter((w) => onPage(w.y, w.h)).forEach((w) => {
        const text = toLatin(w.text);
        if (!text.trim()) return;
        const sizePt = w.fontPx * pxToMm * (72 / 25.4);
        pdf.setFontSize(sizePt);
        // Helvetica is narrower or wider than the design's font: stretch the word to the width it really has
        // on the page so selection boxes line up. Horizontal scaling keeps the letters one word to extractors.
        const natural = pdf.getTextWidth(text);
        const ratio = natural > 0 ? (w.w * pxToMm) / natural : 1;
        pdf.text(text, w.x * pxToMm, (w.y + w.h * 0.8 + shift) * pxToMm, { renderingMode: 'invisible', horizontalScale: Math.min(3, Math.max(0.3, ratio)) });
      });

      geometry.links.filter((l) => onPage(l.y, l.h)).forEach((l) => {
        pdf.link(l.x * pxToMm, (l.y + shift) * pxToMm, l.w * pxToMm, l.h * pxToMm, { url: l.url });
      });
    });

    pdf.save(buildFileName(name));
    return { pages: pages.length, scale: fit };
  } finally {
    stage.destroy();
  }
};

/**
 * Native print dialog: produces a text-based vector PDF via "Save as PDF".
 * The same fit-to-one-page shrink is applied through CSS zoom while the dialog is open.
 */
export const printResume = ({ fitOnePage = true } = {}) => {
  const root = document.documentElement;
  const clear = () => { root.style.removeProperty('--print-fit'); window.removeEventListener('afterprint', clear); };
  try {
    const s = fitOnePage ? measureFitScale() : 1;
    if (s < 1) {
      root.style.setProperty('--print-fit', String(s));
      window.addEventListener('afterprint', clear);
    }
  } catch { /* print at full size */ }
  window.print();
};
