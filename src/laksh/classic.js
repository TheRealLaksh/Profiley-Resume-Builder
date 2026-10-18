import { initialConfig } from '../data/initialState';
import { templates } from '../data/templates';
import photo from './photoData';
import {
  PERSON, SUMMARY, EXPERIENCE, PROJECTS, SKILLS, EDUCATION, ACHIEVEMENTS, CERTS, VOLUNTEER, forLens,
} from './content';

// The standard Profiley view of /laksh (what strict recruiters get by default): the same facts as the
// creative page, mapped into the builder's own resume schema and rendered read-only by the normal app.
// Uses the recruiter lens. Change `activeTemplate` to 'ats' for a plain single-column look.

const LENS = 'recruiter';
const bullets = (lines) => lines.map((l) => `- ${l}`).join('\n');

export const classicResume = () => {
  const projects = forLens(PROJECTS, LENS).map((p) => `${p.name}${p.host ? ` (${p.host})` : ''}: ${p.kind}. ${p.text} ${p.proof}.`);

  const data = {
    personal: {
      name: PERSON.name,
      title: "Full-Stack Developer | B.Tech Data Science & AI, Masters' Union",
      email: PERSON.email,
      phone: '',
      location: PERSON.location,
      linkedin: PERSON.linkedin,
      portfolio: PERSON.portfolio,
      photoUrl: photo,
      summary: SUMMARY[LENS],
    },
    education: EDUCATION.map((e, i) => ({
      id: `edu-${i}`,
      institution: e.school,
      degree: e.what,
      year: e.dates,
      details: e.text,
    })),
    experience: forLens(EXPERIENCE, LENS).map((e) => ({
      id: e.id,
      role: e.role,
      company: `${e.org}, ${e.place}`,
      year: e.dates,
      details: bullets(e.bullets.map((b) => b.t)),
    })),
    skills: SKILLS.map((g) => ({ name: `${g.group}: ${g.items.join(', ')}`, level: 90 })),
    achievements: [
      ...ACHIEVEMENTS.map((a) => (a.year ? `${a.year}: ${a.t}` : a.t)),
      ...CERTS.map((c) => `Certification: ${c.t}, ${c.by} (${c.when})`),
    ],
    community: VOLUNTEER.map((v) => (v.when ? `${v.when}: ${v.t}` : v.t)),
    custom: {
      projects: { title: 'Projects', content: bullets(projects) },
    },
  };

  const sectionOrder = [
    { id: 'summary', label: 'Profile Summary', visible: true, type: 'standard' },
    { id: 'experience', label: 'Experience', visible: true, type: 'standard' },
    { id: 'projects', label: 'Projects', visible: true, type: 'custom' },
    { id: 'education', label: 'Education', visible: true, type: 'standard' },
    { id: 'skills', label: 'Skills', visible: true, type: 'standard' },
    { id: 'achievements', label: 'Achievements', visible: true, type: 'standard' },
    { id: 'community', label: 'Volunteering', visible: true, type: 'standard' },
  ];

  const config = {
    ...initialConfig,
    ...templates.leafy.config,
    activeTemplate: 'leafy',
    mainSections: ['summary', 'experience', 'projects', 'achievements', 'community'],
  };

  return { data, config, sectionOrder };
};
