// A basic, on-device reader for resume text, used when no AI assistant is available.
// It is deliberately conservative: anything it can't place confidently stays in the
// details of the nearest entry or goes to a custom section, and the import dialog
// asks the person to review before anything replaces their resume.

const MONTH = '(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';
const DATE = `(?:${MONTH}\\.?\\s+)?(?:19|20)\\d{2}`;
const RANGE = new RegExp(`${DATE}\\s*(?:-|–|—|to)\\s*(?:${DATE}|present|current|now)`, 'i');
const LONE_YEAR = /^(?:19|20)\d{2}$/;
const BULLET = /^\s*[•▪◦●‣∙·*–—-]\s+/;

const SECTION_PATTERNS = [
  ['summary', /^((professional|career|personal)\s+)?(summary|profile|objective|about(\s+me)?)(\s+(summary|statement))?$|^(profile\s+summary|summary\s+of\s+qualifications)$/i],
  ['experience', /^((work|professional|relevant|industry)\s+)?(experience|employment(\s+history)?|work\s+history|career(\s+history)?|internships?)$/i],
  ['education', /^(education(\s+(&|and)\s+training)?|academic(\s+(background|history|qualifications))?|qualifications?)$/i],
  ['skills', /^((technical|key|core|professional)\s+)?(skills|competenc(ies|y)|technologies|tech\s+stack|expertise|tools(\s+(&|and)\s+technologies)?)$/i],
  ['achievements', /^(achievements?|awards?(\s+(&|and)\s+honou?rs)?|honou?rs|accomplishments?)$/i],
  ['community', /^(volunteer(ing)?(\s+experience)?|community(\s+(service|involvement))?|leadership|extra-?curriculars?(\s+activities)?|activities)$/i]
];
const CUSTOM_HEADINGS = /^(projects?|personal\s+projects?|certifications?|certificates?|licen[cs]es|publications?|languages?|interests?|hobbies|references|courses?|training|patents?)$/i;

const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/;
const PHONE = /(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,5}\)?[\s.-]?){2,4}\d{2,5}/;
const URL = /(?:https?:\/\/)?(?:www\.)?[\w-]+(?:\.[\w-]+)+(?:\/[^\s,;)]*)?/g;

const clean = (line) => line.replace(/\s+/g, ' ').trim();

const classifyHeading = (line) => {
  const text = line.replace(/[:：]+$/, '').trim();
  if (!text || text.length > 40 || /\d/.test(text)) return null;
  for (const [key, pattern] of SECTION_PATTERNS) if (pattern.test(text)) return { key };
  if (CUSTOM_HEADINGS.test(text)) return { key: 'custom', title: text.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/s$/i, (m) => m) };
  return null;
};

const TRAILING_DATE = new RegExp(`^(.*?\\S)\\s+((?:completed\\s+|expected\\s+|graduated\\s+)?(?:${MONTH}\\.?\\s+)?(?:19|20)\\d{2})$`, 'i');

const splitDate = (line) => {
  const range = RANGE.exec(line);
  if (range) return { dates: clean(range[0]), rest: clean(line.replace(range[0], ' ').replace(/[|,·•]\s*$/, '')) };
  if (LONE_YEAR.test(line.trim())) return { dates: line.trim(), rest: '' };
  const trailing = TRAILING_DATE.exec(line);
  if (trailing && trailing[1].length >= 3 && trailing[1].length <= 110 && !/[.!?]$/.test(trailing[1])) return { dates: clean(trailing[2]), rest: clean(trailing[1]) };
  return null;
};

const parseEntries = (lines, kind) => {
  const entries = [];
  let pending = []; // short lines seen since the last entry: probable title/organisation
  let current = null;

  const newEntry = (dates, rest) => {
    const head = [...pending.slice(-2), rest].filter(Boolean);
    pending = [];
    current = { first: head[0] || '', second: head[1] || '', dates, details: [] };
    entries.push(current);
  };

  for (const raw of lines) {
    const line = clean(raw);
    if (!line) continue;

    const date = splitDate(line);
    if (date) { newEntry(date.dates, date.rest); continue; }

    if (BULLET.test(line)) {
      const text = line.replace(BULLET, '');
      if (current) current.details.push(`- ${text}`);
      else pending.push(text);
      continue;
    }

    if (current && !current.second && line.length <= 70 && current.details.length === 0) { current.second = line; continue; }

    if (line.length > 70) pending = [];

    if (current && (current.details.length > 0 || line.length > 70)) {
      // Continuation of a wrapped bullet or a description paragraph.
      const last = current.details[current.details.length - 1];
      if (last && !/[.!?]$/.test(last) && !/^[A-Z]/.test(line)) current.details[current.details.length - 1] = `${last} ${line}`;
      else current.details.push(line);
    } else {
      pending.push(line);
    }
  }

  return entries.map((e, i) => (kind === 'experience'
    ? { id: `import-exp-${i}`, role: e.first, company: e.second, year: e.dates, details: e.details.join('\n') }
    : { id: `import-edu-${i}`, institution: e.first, degree: e.second, year: e.dates, details: e.details.join('\n') }));
};

const splitList = (lines) => {
  const text = lines.map(clean).join(' ');
  // "A · B, C" keeps "B, C" together; fall back to commas only when nothing stronger is used.
  const strong = /\s[·•▪|]\s|\s;\s/.test(text);
  return text
    .split(strong ? /\s*(?:[·•▪|;])\s*/ : /\s*[,;]\s*|\s[·•▪|]\s/)
    .map((s) => s.replace(/^[-–—•\s]+/, '').trim())
    .filter((s) => s && s.length <= 48);
};

// `columnWidth` is the longest line in the whole document, i.e. roughly where this text wraps.
const toBulletItems = (lines, columnWidth) => {
  const cleaned = lines.map(clean).filter(Boolean);
  const hasMarkers = cleaned.some((l) => BULLET.test(l));
  const widest = columnWidth;
  const items = [];
  let previousFilledLine = false;

  for (const line of cleaned) {
    const startsNew = BULLET.test(line) || items.length === 0 || (!hasMarkers && !previousFilledLine);
    if (startsNew) items.push(line.replace(BULLET, ''));
    else items[items.length - 1] += ` ${line}`;
    previousFilledLine = !hasMarkers && line.length >= widest * 0.9;
  }
  return items;
};

export const parseResumeText = (text, { links = [] } = {}) => {
  const lines = text.split('\n').map((l) => l.trimEnd());
  const columnWidth = Math.max(0, ...lines.map((l) => l.length));

  // 1. Split into sections by heading.
  const sections = [{ key: 'header', lines: [] }];
  for (const line of lines) {
    const heading = classifyHeading(line.trim());
    if (heading) sections.push({ ...heading, lines: [] });
    else sections[sections.length - 1].lines.push(line);
  }
  const get = (key) => sections.filter((s) => s.key === key).flatMap((s) => s.lines);

  // 2. Header: name, headline, contact details.
  const header = get('header').map(clean).filter(Boolean);
  const headerText = header.join('\n');
  const email = EMAIL.exec(headerText)?.[0] || '';
  const linkedin = /(?:https?:\/\/)?(?:[a-z]{2,3}\.)?linkedin\.com\/[^\s,;)]+/i.exec(`${headerText}\n${links.join('\n')}`)?.[0] || '';
  const websites = (`${headerText}\n${links.join('\n')}`.replace(new RegExp(EMAIL.source, 'g'), ' ').match(URL) || []).filter((u) => !EMAIL.test(u) && !/linkedin\.com/i.test(u) && /\.[a-z]{2,}/i.test(u) && !u.includes('@'));
  const phone = header.map((l) => PHONE.exec(l.replace(EMAIL, '').replace(URL, ''))?.[0]?.trim()).find((p) => p && p.replace(/\D/g, '').length >= 8) || '';

  const isContactLine = (l) => EMAIL.test(l) || /linkedin\.com|github\.com|https?:\/\//i.test(l) || (PHONE.test(l) && l.replace(/\D/g, '').length >= 8);
  const identity = header.filter((l) => !isContactLine(l));
  const name = identity.find((l) => l.split(' ').length <= 5 && /^[\p{L} .,'’-]+$/u.test(l)) || '';
  const rest = identity.filter((l) => l !== name);
  const title = rest.find((l) => l.length <= 90 && !/,\s*[A-Z]{2,}\b|\d{4}/.test(l) && l.split(' ').length <= 14) || '';
  const location = rest.find((l) => l !== title && l.length <= 60 && /,/.test(l)) || '';
  const longHeader = rest.filter((l) => l !== title && l !== location && l.split(' ').length >= 18).join(' ');

  // 3. Body sections.
  const summaryLines = get('summary').map(clean).filter(Boolean);
  const summary = (summaryLines.join(' ') || longHeader).trim();

  const custom = {};
  const customSections = [];
  sections.filter((s) => s.key === 'custom').forEach((s, i) => {
    const content = toBulletItems(s.lines, columnWidth).map((t) => `- ${t}`).join('\n');
    if (!content) return;
    const id = `custom-import-${i}`;
    custom[id] = { title: s.title, content };
    customSections.push({ id, label: s.title, visible: true, type: 'custom' });
  });

  return {
    data: {
      personal: { name, title, email, phone, location, linkedin: linkedin && (/^https?:/i.test(linkedin) ? linkedin : `https://${linkedin}`), portfolio: websites[0] || '', photoUrl: '', summary },
      experience: parseEntries(get('experience'), 'experience'),
      education: parseEntries(get('education'), 'education'),
      skills: splitList(get('skills')),
      achievements: toBulletItems(get('achievements'), columnWidth),
      community: toBulletItems(get('community'), columnWidth),
      custom
    },
    customSections
  };
};
