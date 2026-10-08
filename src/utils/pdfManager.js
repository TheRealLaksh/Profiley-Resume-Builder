// html2pdf (and html2canvas/jsPDF with it) is ~400 kB and only needed on click, so it is loaded lazily.

export const PDF_SCALE = { screen: 2, print: 3 };

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

/** Renders the visible resume to an image-based A4 PDF. Rejects when export fails. */
export const downloadResumePdf = async ({ name, quality = 'screen' } = {}) => {
  const paper = findVisiblePaper();
  if (!paper) throw new Error('The resume preview is not visible.');

  const clone = paper.cloneNode(true);
  clone.querySelectorAll('[data-editor-only]').forEach((el) => el.remove());
  // A contact line whose only text was an editor placeholder would leave a bare icon behind.
  clone.querySelectorAll('[data-contact]').forEach((el) => { if (!el.textContent.trim()) el.remove(); });
  Object.assign(clone.style, {
    width: '210mm',
    minHeight: '297mm',
    height: 'auto',
    margin: '0',
    transform: 'none',
    boxShadow: 'none',
    backgroundColor: '#ffffff'
  });

  const container = document.createElement('div');
  Object.assign(container.style, { position: 'fixed', top: '-10000px', left: '-10000px', zIndex: '-100' });
  container.appendChild(clone);
  document.body.appendChild(container);

  // html2canvas draws text a few pixels lower than the browser lays it out (about 0.3 to 0.4em for the
  // fonts used here), which pushes labels out of chips and off their icons. Nudge every element
  // that directly holds text back up. This only touches the throwaway clone (and must run once it is attached, so computed styles exist).
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
  const holders = new Set();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeValue.trim() && node.parentElement) holders.add(node.parentElement);
  }
  holders.forEach((el) => {
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.top = '-0.36em';
  });

  try {
    // Capturing before web fonts finish loading would bake in the fallback font.
    await document.fonts?.ready;
    const { default: html2pdf } = await import('html2pdf.js');
    await html2pdf()
      .set({
        margin: 0,
        filename: buildFileName(name),
        image: { type: 'jpeg', quality: 0.98 },
        enableLinks: true,
        html2canvas: {
          scale: PDF_SCALE[quality] ?? PDF_SCALE.screen,
          useCORS: true,
          logging: false,
          scrollY: 0,
          letterRendering: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }
      })
      .from(clone)
      .save();
  } finally {
    container.remove();
  }
};

/** Native print dialog: produces a text-based PDF (selectable, ATS-parseable) via "Save as PDF". */
export const printResume = () => window.print();
