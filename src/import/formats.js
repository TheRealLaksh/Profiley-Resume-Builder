// File formats: Profiley's own backup, and JSON Resume (jsonresume.org), the common interchange format.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const str = (v) => (typeof v === 'string' ? v : '');
const list = (v) => (Array.isArray(v) ? v : []);
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const bullets = (items) => items.filter((t) => typeof t === 'string' && t.trim()).map((t) => `- ${t.trim()}`).join('\n');

// "2021-06" -> "Jun 2021", "2021" -> "2021"
const formatIso = (value) => {
  const m = /^(\d{4})(?:-(\d{2}))?/.exec(str(value));
  if (!m) return str(value);
  return m[2] && MONTHS[Number(m[2]) - 1] ? `${MONTHS[Number(m[2]) - 1]} ${m[1]}` : m[1];
};

const formatRange = (start, end) => {
  const from = formatIso(start);
  const to = formatIso(end);
  if (from && to) return `${from} – ${to}`;
  if (from) return `${from} – Present`;
  return to;
};

// "Jun 2021 – Dec 2022" -> ["2021-06", "2022-12"] (best effort; raw text is also kept)
const toIso = (text) => {
  const parts = str(text).split(/\s+[–—-]\s+|\s+to\s+/i);
  const one = (p) => {
    const m = /(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?((?:19|20)\d{2})/i.exec(p || '');
    if (!m) return '';
    return m[1] ? `${m[2]}-${String(MONTHS.findIndex((x) => x.toLowerCase() === m[1].toLowerCase()) + 1).padStart(2, '0')}` : m[2];
  };
  return [one(parts[0]), /present|current|now/i.test(parts[1] || '') ? '' : one(parts[1])];
};

// ---------------------------------------------------------------------------
// Profiley backup
// ---------------------------------------------------------------------------

export const toProfileyBackup = ({ data, config, sectionOrder }) => ({
  app: 'profiley',
  version: 1,
  exportedAt: new Date().toISOString(),
  data,
  config,
  sectionOrder
});

// ---------------------------------------------------------------------------
// JSON Resume
// ---------------------------------------------------------------------------

export const toJsonResume = (data) => {
  const p = data.personal;
  const profiles = [];
  if (p.linkedin) profiles.push({ network: 'LinkedIn', url: p.linkedin });

  return {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: p.name,
      label: p.title,
      email: p.email,
      phone: p.phone,
      url: p.portfolio,
      summary: p.summary,
      location: { address: p.location },
      profiles
    },
    work: data.experience.map((e) => {
      const [startDate, endDate] = toIso(e.year);
      return { name: e.company, position: e.role, startDate, endDate, dates: e.year, summary: e.details };
    }),
    education: data.education.map((e) => {
      const [startDate, endDate] = toIso(e.year);
      return { institution: e.institution, studyType: e.degree, startDate, endDate, dates: e.year, summary: e.details };
    }),
    skills: data.skills.map((s) => ({ name: typeof s === 'string' ? s : s.name, level: typeof s === 'object' && s.level ? `${s.level}%` : '', keywords: [] })),
    awards: data.achievements.map((title) => ({ title })),
    volunteer: data.community.map((summary) => ({ summary }))
  };
};

/** Returns a data object in Profiley's shape (feed it through normalizeData). */
export const fromJsonResume = (json) => {
  const basics = obj(json.basics);
  const profiles = list(basics.profiles).map(obj);
  const linkedin = profiles.find((x) => /linkedin/i.test(str(x.network) + str(x.url)));
  const loc = obj(basics.location);
  const location = str(loc.address) || [loc.city, loc.region, loc.countryCode].filter(Boolean).join(', ');

  const custom = {};
  const customOrder = [];
  const addCustom = (title, content) => {
    if (!content.trim()) return;
    const id = `custom-import-${customOrder.length}`;
    custom[id] = { title, content };
    customOrder.push({ id, label: title, visible: true, type: 'custom' });
  };

  addCustom('Projects', list(json.projects).map(obj).map((x) => `- ${[str(x.name), str(x.description) || str(x.summary)].filter(Boolean).join(': ')}`).join('\n'));
  addCustom('Certifications', list(json.certificates).map(obj).map((x) => `- ${[str(x.name), str(x.issuer)].filter(Boolean).join(', ')}`).join('\n'));
  addCustom('Publications', list(json.publications).map(obj).map((x) => `- ${[str(x.name), str(x.publisher)].filter(Boolean).join(', ')}`).join('\n'));
  addCustom('Languages', list(json.languages).map(obj).map((x) => `- ${[str(x.language), str(x.fluency)].filter(Boolean).join(': ')}`).join('\n'));
  addCustom('Interests', list(json.interests).map(obj).map((x) => `- ${str(x.name)}`).join('\n'));

  const skills = list(json.skills).map(obj).flatMap((s) => {
    const keywords = list(s.keywords).filter((k) => typeof k === 'string' && k.trim());
    return keywords.length ? keywords : str(s.name) ? [str(s.name)] : [];
  });

  return {
    data: {
      personal: {
        name: str(basics.name),
        title: str(basics.label),
        email: str(basics.email),
        phone: str(basics.phone),
        location,
        linkedin: str(linkedin?.url),
        portfolio: str(basics.url),
        photoUrl: '',
        summary: str(basics.summary)
      },
      experience: list(json.work).map(obj).map((w, i) => ({
        id: `import-exp-${i}`,
        role: str(w.position),
        company: str(w.name) || str(w.company),
        year: str(w.dates) || formatRange(w.startDate, w.endDate),
        details: [str(w.summary).trim(), bullets(list(w.highlights))].filter(Boolean).join('\n')
      })),
      education: list(json.education).map(obj).map((e, i) => ({
        id: `import-edu-${i}`,
        institution: str(e.institution),
        degree: [str(e.studyType), str(e.area)].filter(Boolean).join(', '),
        year: str(e.dates) || formatRange(e.startDate, e.endDate),
        details: [str(e.summary).trim(), e.score ? `Score: ${e.score}` : '', bullets(list(e.courses))].filter(Boolean).join('\n')
      })),
      skills,
      achievements: list(json.awards).map(obj).map((a) => [str(a.title), str(a.awarder)].filter(Boolean).join(' – ')).filter(Boolean),
      community: list(json.volunteer).map(obj).map((v) => [str(v.position), str(v.organization), str(v.summary)].filter(Boolean).join(', ')).filter(Boolean),
      custom
    },
    customSections: customOrder
  };
};

/**
 * Looks at parsed JSON and says what it is.
 * Returns { kind: 'profiley', ... } | { kind: 'jsonresume', ... } | null
 */
export const detectJson = (json) => {
  if (!json || typeof json !== 'object') return null;
  if (json.app === 'profiley' && json.data) {
    return { kind: 'profiley', data: json.data, config: json.config, sectionOrder: json.sectionOrder };
  }
  if (json.basics || json.work || json.education) {
    const { data, customSections } = fromJsonResume(json);
    return { kind: 'jsonresume', data, customSections };
  }
  if (json.personal && (json.experience || json.education)) {
    return { kind: 'profiley', data: json };
  }
  return null;
};
