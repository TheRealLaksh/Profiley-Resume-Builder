// "What does an applicant tracking system actually see?"
//
// 1. readPaper() walks the rendered resume the way a naive parser reads a PDF: every
//    word with its position, grouped into rows, left to right, top to bottom. In a
//    multi-column layout that mixes columns, which is exactly the failure to catch.
// 2. runChecks() turns that plus the resume data into a scored list of checks.

const A4_HEIGHT_PX = 1122.5; // 297mm at 96dpi

// ---------------------------------------------------------------------------
// Reading the rendered page
// ---------------------------------------------------------------------------

export const readPaper = (paper) => {
  if (!paper) return null;

  const words = [];
  const walker = document.createTreeWalker(paper, NodeFilter.SHOW_TEXT);
  const range = document.createRange();

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue;
    if (!text.trim()) continue;
    const parent = node.parentElement;
    if (!parent || parent.closest('[data-editor-only]')) continue;

    const pattern = /\S+/g;
    for (let m = pattern.exec(text); m; m = pattern.exec(text)) {
      range.setStart(node, m.index);
      range.setEnd(node, m.index + m[0].length);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      words.push({ text: m[0], left: rect.left, right: rect.right, mid: rect.top + rect.height / 2, height: rect.height });
    }
  }
  range.detach?.();

  // Group into rows by vertical position.
  words.sort((a, b) => a.mid - b.mid || a.left - b.left);
  const rows = [];
  for (const word of words) {
    const row = rows[rows.length - 1];
    if (row && Math.abs(word.mid - row.mid) <= Math.max(word.height, row.height) * 0.45) {
      row.words.push(word);
      row.mid = (row.mid * (row.words.length - 1) + word.mid) / row.words.length;
      row.height = Math.max(row.height, word.height);
    } else {
      rows.push({ words: [word], mid: word.mid, height: word.height });
    }
  }

  const basic = rows.map((row) => {
    row.words.sort((a, b) => a.left - b.left);
    let merged = false;
    let line = row.words[0].text;
    for (let i = 1; i < row.words.length; i++) {
      const gap = row.words[i].left - row.words[i - 1].right;
      if (gap > row.height * 2.2) {
        merged = true;
        line += '  ▏  ';
      } else {
        line += ' ';
      }
      line += row.words[i].text;
    }
    return { text: line, merged };
  });

  // innerText follows layout; hide editor-only hints for the read, then restore them.
  const hints = Array.from(paper.querySelectorAll('[data-editor-only]'));
  hints.forEach((el) => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
  const smartText = paper.innerText || '';
  hints.forEach((el) => { el.style.display = el.dataset.prevDisplay; delete el.dataset.prevDisplay; });

  const smart = smartText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return {
    basic,
    smart,
    mergedLines: basic.filter((l) => l.merged).length,
    pageHeight: paper.offsetHeight,
    pages: Math.max(1, Math.ceil(paper.offsetHeight / A4_HEIGHT_PX - 0.04))
  };
};

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

const STANDARD_HEADING = /(experience|employment|work|career|professional|education|academic|qualification|skill|competenc|technolog|summary|profile|objective|about|achievement|award|honou?r|accomplishment|project|certif|licen[cs]e|volunteer|community|leadership|activit|publication|language|interest|reference|training|course)/i;

const WORDS = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);

const check = (id, status, title, detail, action) => ({ id, status, title, detail, action });

export const runChecks = ({ data, config, sectionOrder, reading }) => {
  const checks = [];
  const personal = data.personal;
  const visible = sectionOrder.filter((s) => s.visible);
  const layout = config.layoutType || 'sidebar';

  // 1. Contact basics
  const missing = [
    !personal.name.trim() && 'name',
    !personal.email.trim() && 'email',
    !personal.phone.trim() && 'phone number'
  ].filter(Boolean);
  checks.push(
    missing.length === 0
      ? check('contact', 'pass', 'Contact details are present', 'Name, email and phone are all there for a recruiter to find.')
      : check('contact', missing.includes('name') || missing.includes('email') ? 'fail' : 'warn', `Add your ${missing.join(' and ')}`, 'An ATS builds the candidate record from these. Without them the application can be filed under the wrong person or not at all.', { id: 'personal', label: 'Edit details' })
  );

  // 2. Reading order / columns
  if (reading) {
    const merged = reading.mergedLines;
    if (layout === 'single' && merged < 3) {
      checks.push(check('columns', 'pass', 'Single column reads in order', 'A basic parser reads your resume top to bottom without mixing sections.'));
    } else if (merged >= 8) {
      checks.push(check('columns', 'fail', 'Columns get mixed together', `Reading left to right, ${merged} lines blend two columns into one (see the parser view below). Some systems will scramble your sections or lose your skills.`, { id: 'template-ats', label: 'Use a single-column template' }));
    } else if (merged >= 3) {
      checks.push(check('columns', 'warn', 'Some lines mix columns', `${merged} lines read across two columns. Most modern systems cope, older ones may not.`, { id: 'template-ats', label: 'Use a single-column template' }));
    } else {
      checks.push(check('columns', 'pass', 'Layout reads cleanly', 'Even with this layout, sections stay in a sensible order.'));
    }
  }

  // 3. PDF export
  checks.push(check('pdf', 'info', 'Your PDF keeps real, selectable text', '"Download PDF" carries a hidden text layer, so applicant tracking systems can read it. "Print or save as PDF" is a little sharper and smaller if you prefer that.', { id: 'export', label: 'Open export' }));

  // 4. Section headings
  const odd = visible.filter((s) => !STANDARD_HEADING.test(data.custom?.[s.id]?.title || s.label));
  checks.push(
    odd.length === 0
      ? check('headings', 'pass', 'Section names are recognisable', 'Standard headings help the system file each part into the right field.')
      : check('headings', 'warn', `Unusual section ${odd.length > 1 ? 'names' : 'name'}: ${odd.map((s) => `"${data.custom?.[s.id]?.title || s.label}"`).join(', ')}`, 'Parsers look for familiar headings like Experience, Education and Skills. Creative names may leave that content unfiled.', { id: 'sections', label: 'Rename sections' })
  );

  // 5. Dates on experience
  const undated = data.experience.filter((e) => !/(19|20)\d{2}|present|current/i.test(e.year || ''));
  if (data.experience.length > 0) {
    checks.push(
      undated.length === 0
        ? check('dates', 'pass', 'Every role has dates', 'Dates let the system calculate your years of experience.')
        : check('dates', 'warn', `${undated.length} ${undated.length > 1 ? 'roles are' : 'role is'} missing a year`, 'Use a year or a range like "Jun 2022 – Present" so tenure can be calculated.', { id: 'experience', label: 'Edit experience' })
    );
  } else {
    checks.push(check('experience', 'warn', 'No work experience listed', 'Experience is the section ATS scoring leans on most. Add roles, internships or projects.', { id: 'experience', label: 'Add experience' }));
  }

  // 6. Bullets vs walls of text
  const wall = data.experience.filter((e) => (e.details || '').length > 320 && !/^\s*[-*•–]\s/m.test(e.details));
  if (wall.length > 0) {
    checks.push(check('bullets', 'info', 'Long paragraphs are hard to scan', `${wall.length} ${wall.length > 1 ? 'entries are' : 'entry is'} one dense paragraph. Short bullet points (start a line with "- ") are easier for both parsers and people.`, { id: 'experience', label: 'Edit experience' }));
  }

  // 7. Summary
  const summaryWords = WORDS(personal.summary);
  if (summaryWords === 0) {
    checks.push(check('summary', 'info', 'No summary', 'Two or three sentences at the top give matching software more of your keywords and give a recruiter a reason to keep reading.', { id: 'summary', label: 'Write a summary' }));
  } else if (summaryWords > 120) {
    checks.push(check('summary', 'info', `Summary is long (${summaryWords} words)`, 'Around 40 to 80 words is easier to take in.', { id: 'summary', label: 'Edit summary' }));
  }

  // 8. Skills as graphics
  if (['bars', 'dots'].includes(config.skillStyle) && data.skills.length > 0) {
    checks.push(check('levels', 'info', 'Skill levels are graphics', 'A parser reads the skill names but not the bars or dots, and recruiters often distrust self-rated levels. Tags or an inline list say more.', { id: 'design', label: 'Change skill style' }));
  }

  // 9. Photo
  if (config.showPhoto && personal.photoUrl) {
    checks.push(check('photo', 'info', 'Photo included', 'Parsers ignore it, and in some regions (the US, UK, Canada) employers prefer resumes without one. Keep it for markets where it is expected.', { id: 'design', label: 'Hide photo' }));
  }

  // 10. Length
  if (reading) {
    if (reading.pages > 2) {
      checks.push(check('length', 'warn', `About ${reading.pages} pages`, 'Most recruiters want one or two pages. Trim older roles, use Compact spacing or a smaller text size.', { id: 'design', label: 'Adjust design' }));
    } else if (reading.pages === 2) {
      checks.push(check('length', 'info', 'Two pages', 'Fine for several years of experience. For a first job, one page is stronger.'));
    } else {
      checks.push(check('length', 'pass', 'Fits one page', 'Easy to scan in a few seconds.'));
    }
  }

  // 11. Links
  if (!personal.linkedin.trim() && !personal.portfolio.trim()) {
    checks.push(check('links', 'info', 'No LinkedIn or portfolio link', 'Recruiters often look you up. A link makes that one click.', { id: 'personal', label: 'Add links' }));
  }

  const weight = { fail: 20, warn: 8, info: 2, pass: 0 };
  const score = Math.max(0, 100 - checks.reduce((sum, c) => sum + weight[c.status], 0));
  const label = score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : score >= 55 ? 'Needs work' : 'At risk';

  return { score, label, checks };
};
