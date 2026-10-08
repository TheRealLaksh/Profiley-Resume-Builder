const str = (v) => (typeof v === 'string' ? v : '');
const list = (v) => (Array.isArray(v) ? v : []);

/** Maps the structured answer of the "parse" AI task onto Profiley's data shape. */
export const aiToData = (r) => {
  const custom = {};
  const customSections = [];
  list(r.otherSections).forEach((s, i) => {
    const title = str(s?.title).trim();
    const content = str(s?.content).trim();
    if (!title || !content) return;
    const id = `custom-import-${i}`;
    custom[id] = { title, content };
    customSections.push({ id, label: title, visible: true, type: 'custom' });
  });

  return {
    data: {
      personal: {
        name: str(r.name), title: str(r.headline), email: str(r.email), phone: str(r.phone), location: str(r.location),
        linkedin: str(r.linkedin), portfolio: str(r.website), photoUrl: '', summary: str(r.summary)
      },
      experience: list(r.experience).map((e, i) => ({ id: `import-exp-${i}`, role: str(e?.role), company: str(e?.company), year: str(e?.dates), details: str(e?.details) })),
      education: list(r.education).map((e, i) => ({ id: `import-edu-${i}`, institution: str(e?.institution), degree: str(e?.degree), year: str(e?.dates), details: str(e?.details) })),
      skills: list(r.skills).filter((s) => typeof s === 'string' && s.trim()),
      achievements: list(r.achievements).filter((s) => typeof s === 'string' && s.trim()),
      community: list(r.activities).filter((s) => typeof s === 'string' && s.trim()),
      custom
    },
    customSections
  };
};
