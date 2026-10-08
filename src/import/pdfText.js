/**
 * Joins pdf.js text items into lines. Chrome and other generators often emit one item per
 * glyph run, so a space is only inserted where the page really has a gap, and a new line
 * starts when the baseline moves. Pure function: easy to test without a browser.
 */
export const joinTextItems = (items) => {
  let out = '';
  let prev = null;

  for (const item of items) {
    if (typeof item.str !== 'string') continue;
    const x = item.transform[4];
    const y = item.transform[5];
    const height = item.height || Math.abs(item.transform[3]) || 0;

    if (prev) {
      const sameLine = Math.abs(y - prev.y) < Math.max(prev.height, height, 1) * 0.45;
      if (!sameLine || prev.eol) {
        if (!out.endsWith('\n')) out += '\n';
      } else if (item.str.trim() !== '' && !/\s$/.test(out)) {
        const gap = x - (prev.x + prev.width);
        if (gap > Math.max(prev.height, height) * 0.14) out += ' ';
      }
    }

    out += item.str;
    if (item.str.trim() !== '') prev = { x, y, width: item.width, height, eol: item.hasEOL };
    else if (prev) prev = { ...prev, eol: prev.eol || item.hasEOL };
    if (item.hasEOL && prev) prev.eol = true;
  }
  return out;
};

export const tidyText = (pages) =>
  pages
    .join('\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

/**
 * Pulls the text out of a PDF in the browser. pdf.js is large, so it (and its worker)
 * are only fetched when someone actually imports a PDF.
 */
export const extractPdfText = async (file) => {
  const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
  const { default: workerUrl } = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const bytes = new Uint8Array(await file.arrayBuffer());
  let doc;
  try {
    doc = await pdfjs.getDocument({ data: bytes }).promise;
  } catch (error) {
    if (error?.name === 'PasswordException') throw new Error('That PDF is password protected.');
    throw new Error("That file doesn't look like a valid PDF.");
  }

  const pages = [];
  const links = [];
  for (let n = 1; n <= Math.min(doc.numPages, 6); n++) {
    const page = await doc.getPage(n);
    const content = await page.getTextContent();
    pages.push(joinTextItems(content.items));
    // Links such as "LinkedIn" show only a label in the text; the address lives in an annotation.
    (await page.getAnnotations()).forEach((a) => { if (a.url && /^https?:/i.test(a.url)) links.push(a.url); });
  }

  const text = tidyText(pages);
  if (text.length < 80) throw new Error('No readable text found. This looks like a scanned image. Try a PDF exported from Word, Google Docs or Profiley.');
  return { text, links: [...new Set(links)] };
};
