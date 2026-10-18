import { initialConfig } from '../data/initialState';
import { templates } from '../data/templates';
import { PERSON } from './content';

// The standard Profiley view of /laksh: what strict readers (recruiters, ATS, campus portals) get by default.
// Shaped by the "high-package resumes" research (18 Oct 2026, Obsidian: 01 About Me/Top Package Resume Research):
// one page, single column, plain ATS template, no photo, no objective, Education first for a student, bullets that
// name what was built and the proof (tests, audits, live link), visible URLs, skills grouped by type.
// Rule: only facts that are true. Where a real number would strengthen a line, add it (see the note at the bottom).
// The creative page (LakshResume.jsx) holds the longer story.

const bullets = (lines) => lines.map((l) => `- ${l}`).join('\n');

export const classicResume = () => {
  const data = {
    personal: {
      name: PERSON.name,
      title: "Full-Stack Developer | B.Tech Data Science & AI, Masters' Union",
      email: PERSON.email,
      phone: '',
      location: PERSON.location,
      linkedin: PERSON.linkedin,
      github: PERSON.github,
      portfolio: PERSON.portfolio,
      photoUrl: '',
      summary: '',
    },
    education: [
      { id: 'edu-mu', institution: "Masters' Union", degree: 'B.Tech, Data Science and AI', year: 'Aug 2026 - Aug 2030', details: '' },
      { id: 'edu-iitm', institution: 'CODE, IIT Madras', degree: 'Introduction to Data Science and AI (8-week programme)', year: 'Aug 2025 - Oct 2025', details: '' },
      { id: 'edu-sunbeam', institution: 'Sunbeam School Lahartara, Varanasi', degree: 'Grade XII, PCM with Computer Science', year: 'Mar 2024 - Mar 2026', details: '' },
      { id: 'edu-cirs', institution: 'Chinmaya International Residential School, Coimbatore', degree: 'Class X, House Captain', year: 'Apr 2019 - Mar 2024', details: '' },
    ],
    experience: [
      {
        id: 'shiftsdeal', role: 'Tech & Growth Intern', company: 'ShiftsDeal, Delhi (hybrid)', year: 'Aug 2026 - Present',
        details: bullets([
          'Sole engineer on an early-stage venue-booking marketplace: built the website from scratch and shipped it to production, now listing 120+ venues.',
          'Integrated Razorpay payments and ship new features and fixes daily.',
          'Support growth alongside engineering: outreach calls and operations.',
        ]),
      },
      {
        id: 'freelance', role: 'Freelance Full-Stack Developer', company: 'Self-employed, Delhi NCR (remote)', year: '2026 - Present',
        details: bullets([
          'Delivered 5+ company websites with custom CMS admin panels for agency clients, covering scoping, build, testing and handover.',
          'Added booking flows, dashboards and Razorpay payments; MySQL-backed so clients deploy and run the sites themselves.',
        ]),
      },
      {
        id: 'unified', role: 'Full Stack Web Developer Intern', company: 'Unified Mentor (remote)', year: 'Oct 2025 - Dec 2025',
        details: bullets([
          'Shipped four production apps: Helios (music player), Calibridge (calendar exporter), CogniSync (academic appointments and messaging with role-based access) and MarketBridge (local-merchant marketplace).',
        ]),
      },
      {
        id: 'moreyeahs', role: 'Web Developer Intern', company: 'MoreYeahs (remote)', year: 'Aug 2025 - Sep 2025',
        details: bullets([
          'Built GigX, a Django gig marketplace: token-authenticated REST APIs, Seeker and Provider roles, CRUD with filtering, search and favourites.',
        ]),
      },
      {
        id: 'kavana', role: 'IT Intern', company: 'Hotel Kavana, Varanasi (on-site)', year: 'Jun 2025',
        details: bullets(['20-day internship in hotel IT: network maintenance, POS integrations and workflow automation.']),
      },
    ],
    skills: [],
    achievements: [
      'Regional Winner, VVM National Science Competition (2023), advanced to the national level; Top 100 nationwide, Sri Shakthi Online Space Quiz (2025)',
      '2nd place, Robowars at Impetus 2025; 2nd place, AFS Tech Ramble Web Wizards, website development and deployment (2025)',
      'National-level shooter; House Captain; Round Square organizing committee (2025); campaign organizer, One Knowledge One World (2023)',
      'Certifications: Cyber Investigator, DeepCytes Cyber Labs (2025); Store Listing Certificate, Google Play Academy (2024)',
    ],
    community: [],
    custom: {
      projects: {
        title: 'Projects',
        content: bullets([
          'Calibridge (calibridge.lakshpradhwani.com): offline-first calendar PWA in strict TypeScript with RFC 5545 .ics import/export, recurring events and time zones; 43 Playwright end-to-end tests run in CI and axe WCAG 2.1 AA audits.',
          'Profiley (profiley.lakshpradhwani.com): React resume builder with 16 templates and a built-in ATS reader that scores any resume; text-based PDF export, import and click-to-edit.',
          'Helios (music.lakshpradhwani.com): framework-free web music player with a 3-band equaliser, 3 visualisers, a decoded-waveform seekbar, command palette and Media Session API.',
        ]),
      },
      skillsLine: {
        title: 'Skills',
        content: [
          'Languages: TypeScript, JavaScript, Python, SQL',
          'Web: React, Next.js, Node.js, Django, REST APIs, Tailwind, HTML and CSS, Razorpay',
          'Data and AI: MySQL, PostgreSQL, MongoDB, Firebase, NumPy, Pandas, scikit-learn, MediaPipe, OpenCV',
          'Testing and tools: Playwright, Vitest, axe, Git and GitHub',
        ].join('\n'),
      },
    },
  };

  const sectionOrder = [
    { id: 'summary', label: 'Profile Summary', visible: false, type: 'standard' },
    { id: 'education', label: 'Education', visible: true, type: 'standard' },
    { id: 'experience', label: 'Experience', visible: true, type: 'standard' },
    { id: 'projects', label: 'Projects', visible: true, type: 'custom' },
    { id: 'skillsLine', label: 'Skills', visible: true, type: 'custom' },
    { id: 'skills', label: 'Skills', visible: false, type: 'standard' },
    { id: 'achievements', label: 'Awards and Activities', visible: true, type: 'standard' },
    { id: 'community', label: 'Volunteering', visible: false, type: 'standard' },
  ];

  const config = {
    ...initialConfig,
    ...templates.ats.config,
    activeTemplate: 'ats',
    showLinkUrls: true,
    spacingScale: 'compact',
  };

  return { data, config, sectionOrder };
};

// Lines that get stronger with a real number from Laksh (never guess; leave out until known):
// ShiftsDeal (venues, bookings or users), freelance (sites delivered), Unified Mentor (users or traffic of the four apps),
// Calibridge (Lighthouse or axe result).
