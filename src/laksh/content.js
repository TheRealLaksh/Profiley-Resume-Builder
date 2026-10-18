// Everything on Laksh's own resume page (/laksh). Facts come from his LinkedIn profile and the Obsidian vault
// (checked 18 Oct 2026). Rules: no client names (they belong to the agency), no phone number, no marks.
// Each lens decides what the reader sees first: "client" (hiring a freelancer), "recruiter" (internships and
// placements) and "dev" (engineers reading the work).

export const LENSES = [
  { id: 'client', label: 'Client', hint: 'Hiring me to build something' },
  { id: 'recruiter', label: 'Recruiter', hint: 'Internships and placements' },
  { id: 'dev', label: 'Developer', hint: 'How I build' },
];

export const PERSON = {
  name: 'Laksh Pradhwani',
  location: 'Delhi NCR, India',
  email: 'work@lakshpradhwani.com',
  linkedin: 'https://www.linkedin.com/in/laksh-pradhwani/',
  github: 'https://github.com/TheRealLaksh',
  portfolio: 'https://lakshpradhwani.com/',
  photo: '/laksh/photo.webp',
  updated: '18 Oct 2026',
};

export const HEADLINE = {
  client: 'Freelance full-stack developer. Websites, admin panels and AI features for businesses.',
  recruiter: "Full-stack developer and B.Tech Data Science & AI student at Masters' Union.",
  dev: 'TypeScript, React and Python. Offline-first apps, tested end to end.',
};

export const SUMMARY = {
  client:
    "I build company websites that your own team can run: fast, mobile-friendly, with a CMS admin panel, plus booking flows, Razorpay payments, dashboards and AI features on top. Based in Delhi NCR and working with clients across India. Every project is built in clear stages and tested before handover.",
  recruiter:
    "B.Tech Data Science & AI student at Masters' Union (2026 to 2030) with a year of hands-on engineering: tech and growth intern at ShiftsDeal, freelance developer, and four earlier internships in web development and AI/ML, including an 8-week IIT Madras data science programme. National-level shooter, former house captain and hackathon podium finisher.",
  dev:
    "I write strict TypeScript and React, and Python and Django when the job needs a backend. Recent work: an offline-first calendar PWA with 43 Playwright end-to-end tests and axe accessibility audits, a framework-free web music player, a resume builder with a working ATS reader, and token-authenticated REST APIs. Comfortable across Node, SQL and MongoDB.",
};

export const STATS = [
  { value: 5, label: 'internships and roles' },
  { value: 4, label: 'production apps in a single internship' },
  { value: 43, label: 'end-to-end tests on Calibridge' },
];

// ---- Experience --------------------------------------------------------------------------------------------
// `lenses`: which lenses show the entry. Each bullet has its own `lenses` list as well.
const ALL = ['client', 'recruiter', 'dev'];

export const EXPERIENCE = [
  {
    id: 'shiftsdeal',
    role: 'Tech & Growth Intern',
    org: 'ShiftsDeal',
    place: 'Delhi, hybrid',
    dates: 'Aug 2026 - Present',
    lenses: ALL,
    bullets: [
      { t: 'Sole engineer at an early-stage venue-booking marketplace: built the website from scratch and took it to production, now listing 120+ venues.', lenses: ALL },
      { t: 'Integrated Razorpay payments and ship new features every day.', lenses: ALL },
      { t: 'Support growth alongside the tech work: outreach calls, operations and social media.', lenses: ['client', 'recruiter'] },
    ],
    tags: ['Razorpay', 'Web app', 'Production'],
  },
  {
    id: 'freelance',
    role: 'Freelance Full-Stack Developer',
    org: 'Self-employed',
    place: 'Delhi NCR, remote',
    dates: '2026 - Present',
    lenses: ALL,
    bullets: [
      { t: 'Delivered 5+ company websites with CMS admin panels for agency clients: scoping, build, testing and handover.', lenses: ALL },
      { t: 'Booking flows, dashboards and Razorpay payments on top of the sites that need them.', lenses: ['client', 'dev'] },
      { t: 'MySQL-backed builds that the client\'s own team can deploy and run.', lenses: ['dev'] },
    ],
    tags: ['React', 'Next.js', 'Node.js', 'MySQL'],
  },
  {
    id: 'unified',
    role: 'Full Stack Web Developer Intern',
    org: 'Unified Mentor',
    place: 'Remote',
    dates: 'Oct 2025 - Dec 2025',
    lenses: ALL,
    bullets: [
      { t: 'Shipped four production apps in one internship: Helios (music player), Calibridge (calendar exporter), CogniSync (academic appointments and messaging with role-based access) and MarketBridge (local-merchant marketplace).', lenses: ALL },
    ],
    tags: ['React', 'JavaScript', 'Role-based access'],
  },
  {
    id: 'iitm',
    role: 'AI & Algorithmic Problem-Solving Intern',
    org: 'IIT Madras',
    place: 'Remote',
    dates: 'Aug 2025 - Oct 2025',
    lenses: ['recruiter', 'dev', 'client'],
    bullets: [
      { t: '8-week programme (CODE IIT Madras, School Connect): data science, data engineering, supervised and unsupervised learning (KNN, K-Means, decision trees), neural networks and algorithmic problem-solving.', lenses: ALL },
    ],
    tags: ['Python', 'NumPy', 'Pandas', 'scikit-learn'],
  },
  {
    id: 'moreyeahs',
    role: 'Web Developer Intern',
    org: 'MoreYeahs',
    place: 'Remote',
    dates: 'Aug 2025 - Sep 2025',
    lenses: ALL,
    bullets: [
      { t: 'GigX: a Django gig marketplace with token-authenticated REST APIs, Seeker and Provider roles, full CRUD with filtering, search and favourites.', lenses: ALL },
    ],
    tags: ['Django', 'Python', 'REST APIs'],
  },
  {
    id: 'kavana',
    role: 'IT Intern',
    org: 'Hotel Kavana',
    place: 'Varanasi, on-site',
    dates: 'Jun 2025',
    lenses: ['recruiter', 'client'],
    bullets: [
      { t: '20-day on-site internship in hotel IT: infrastructure, network maintenance, POS integrations and workflow automation.', lenses: ALL },
    ],
    tags: ['Networking', 'Automation'],
  },
];

// ---- Projects ----------------------------------------------------------------------------------------------
export const PROJECTS = [
  {
    id: 'calibridge',
    name: 'Calibridge',
    kind: 'Offline-first calendar PWA',
    url: 'https://calibridge.lakshpradhwani.com',
    host: 'calibridge.lakshpradhwani.com',
    text: 'Strict TypeScript and Vite with no UI framework. Month, week and agenda views, real time zones, repeating events, RFC 5545 .ics import and export, undo and redo.',
    proof: '43 Playwright e2e tests in CI, axe WCAG 2.1 AA audits',
    tags: ['TypeScript', 'PWA', 'Playwright'],
    lenses: ALL,
  },
  {
    id: 'helios',
    name: 'Helios',
    kind: 'Web music player',
    url: 'https://music.lakshpradhwani.com',
    host: 'music.lakshpradhwani.com',
    text: 'No frameworks, no CDN. Adaptive cover colour, decoded-waveform seekbar, three visualisers, three-band EQ, queue, sleep timer, command palette and Media Session API.',
    proof: 'Web Audio API, installable, responsive',
    tags: ['JavaScript', 'Web Audio', 'PWA'],
    lenses: ALL,
  },
  {
    id: 'profiley',
    name: 'Profiley',
    kind: 'Resume builder (you are on it)',
    url: 'https://profiley.lakshpradhwani.com',
    host: 'profiley.lakshpradhwani.com',
    text: 'React 19 resume builder with 16 templates, click-to-edit, import and export, a text PDF that parsers can read, and an ATS reader that scores any resume.',
    proof: 'This page runs its ATS check on itself',
    tags: ['React', 'Vite', 'Firebase'],
    lenses: ALL,
  },
  {
    id: 'portfolio',
    name: 'Portfolio and /hire',
    kind: 'Personal site',
    url: 'https://lakshpradhwani.com/hire',
    host: 'lakshpradhwani.com',
    text: 'Single-page portfolio with services, starting prices and a hire page that links to the work above.',
    proof: 'Services from ₹30,000',
    tags: ['React', 'Vercel'],
    lenses: ['client', 'recruiter'],
  },
  {
    id: 'gigx',
    name: 'GigX',
    kind: 'Gig marketplace backend',
    text: 'Django project built at MoreYeahs: Seeker and Provider roles, token-authenticated REST APIs, filtering, search and favourites.',
    proof: 'Submitted on GitHub',
    tags: ['Django', 'REST'],
    lenses: ['dev', 'recruiter'],
  },
  {
    id: 'airwrite',
    name: 'Air-writing canvas',
    kind: 'Computer vision',
    text: 'Write, hover, erase and clear a digital canvas with hand gestures and a webcam. MediaPipe hand tracking, OpenCV drawing and gesture-based mode switching, smooth on modest machines.',
    proof: 'Posted with a demo video',
    tags: ['Python', 'MediaPipe', 'OpenCV'],
    lenses: ['dev', 'recruiter'],
  },
];

// ---- Services (client lens only) -----------------------------------------------------------------------------
export const SERVICES = [
  { name: 'Business website with CMS', price: '₹30,000', text: 'A fast, mobile-friendly site and an admin panel your team can edit.' },
  { name: 'AI features and automation', price: '₹55,000', text: 'Chat assistants, workflows and computer-vision features added to your product.' },
  { name: 'Custom web app', price: '₹75,000', text: 'Login, dashboard and Razorpay payments for something built around how you work.' },
];

// ---- Skills --------------------------------------------------------------------------------------------------
export const SKILLS = [
  { group: 'Front end', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML and CSS', 'Tailwind', 'PWA'] },
  { group: 'Back end', items: ['Node.js', 'Django', 'Python', 'REST APIs', 'Razorpay'] },
  { group: 'Data', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'NumPy', 'Pandas', 'scikit-learn'] },
  { group: 'Quality', items: ['Playwright', 'Vitest', 'axe accessibility', 'Git and GitHub'] },
  { group: 'AI and vision', items: ['MediaPipe', 'OpenCV', 'KNN and K-Means', 'Prompt engineering'] },
];

// ---- Education (all of it, no marks) -------------------------------------------------------------------------
export const EDUCATION = [
  {
    school: "Masters' Union",
    what: 'B.Tech, Data Science and AI',
    dates: 'Aug 2026 - Aug 2030',
    text: 'Undergraduate programme combining computer science and AI with business, learned through practical work.',
  },
  {
    school: 'Sunbeam School Lahartara, Varanasi',
    what: 'Grade XII, PCM with Computer Science',
    dates: 'Mar 2024 - Mar 2026',
    text: 'Physics, Chemistry, Mathematics and Computer Science. Hackathons, MUNs, advanced AI workshops, badminton and shooting.',
  },
  {
    school: 'Chinmaya International Residential School, Coimbatore',
    what: 'Class X',
    dates: 'Apr 2019 - Mar 2024',
    text: 'House Captain. Leadership programmes, sports and MUNs.',
  },
];

// ---- Achievements, certifications, volunteering ------------------------------------------------------------
export const ACHIEVEMENTS = [
  { year: '2023', t: 'Regional Winner, VVM National Science Competition; advanced to the national level' },
  { year: '2025', t: 'Top 100 nationwide, Sri Shakthi Online Space Quiz' },
  { year: '2025', t: '2nd place, Robowars at Impetus 2025' },
  { year: '2025', t: '2nd place, AFS Tech Ramble Web Wizards (website development and deployment)' },
  { year: '', t: 'National-level shooter' },
  { year: '', t: 'Consistent top performer in hackathons, including WebWiz' },
];

export const CERTS = [
  { t: 'Cyber Investigator', by: 'DeepCytes Cyber Labs', when: 'Aug 2025' },
  { t: 'Store Listing Certificate', by: 'Google Play Academy', when: 'Aug 2024' },
  { t: 'Introduction to Data Science and AI', by: 'CODE IIT Madras', when: 'Oct 2025' },
];

export const VOLUNTEER = [
  { when: '2025', t: 'Organizing Committee Member, Round Square: planning and running student-led events' },
  { when: '2024', t: 'Community volunteer: cleanliness drives and outreach' },
  { when: '2023', t: 'Campaign organizer, One Knowledge, One World (Chinmaya Education Movement): fundraising for education' },
  { when: '2022', t: 'Volunteer tutor at an orphanage and a home for specially-abled children' },
  { when: '', t: 'MUNs: CHEMUN, IIMUN, TISB MUN; Press Corps at G20 MUN' },
];

// ---- Changelog -----------------------------------------------------------------------------------------------
// "git log" for the resume. Newest first. `del` lines are what the previous version said; `add` lines replace them.
export const CHANGELOG = [
  {
    when: 'Oct 2026',
    title: 'Rewritten for hiring, not applying',
    del: ['Aspiring AI & ML Engineer | Full Stack Developer', 'Grade XII student aspiring to specialize in AI and ML'],
    add: ['Freelance full-stack developer, Delhi NCR', 'Three lenses for three readers; this page runs its own ATS check'],
  },
  {
    when: 'Aug 2026',
    title: "Masters' Union and ShiftsDeal",
    del: ['Grade XII - PCM with Computer Science, 2024 - Present'],
    add: ["B.Tech, Data Science and AI, Masters' Union", 'Tech & Growth Intern at ShiftsDeal: marketplace built and shipped'],
  },
  {
    when: 'Jan 2026',
    title: 'Admission offered',
    del: [],
    add: ["Offer for the Masters' Union UG Data Science and AI programme, class of 2030"],
  },
  {
    when: 'Oct 2025',
    title: 'Four apps in one internship',
    del: [],
    add: ['Unified Mentor: Helios, Calibridge, CogniSync and MarketBridge shipped'],
  },
  {
    when: 'Aug 2025',
    title: 'IIT Madras and MoreYeahs',
    del: [],
    add: ['8-week data science and AI programme', 'GigX: Django gig marketplace with REST APIs'],
  },
  {
    when: 'Jun 2025',
    title: 'First internship',
    del: [],
    add: ['Hotel Kavana: 20 days of on-site IT in a hotel'],
  },
];

// ---- Section order per lens ----------------------------------------------------------------------------------
export const ORDER = {
  client: ['summary', 'services', 'projects', 'experience', 'skills', 'education', 'achievements', 'certs', 'volunteer', 'changelog'],
  recruiter: ['summary', 'education', 'experience', 'projects', 'skills', 'achievements', 'certs', 'volunteer', 'changelog'],
  dev: ['summary', 'skills', 'projects', 'experience', 'education', 'achievements', 'certs', 'changelog'],
};

export const SECTION_LABEL = {
  summary: 'Summary',
  services: 'Services',
  projects: 'Projects',
  experience: 'Experience',
  skills: 'Skills',
  education: 'Education',
  achievements: 'Achievements',
  certs: 'Certifications',
  volunteer: 'Volunteering',
  changelog: 'Changelog',
};

/** What a given lens sees of the experience and project lists. */
export const forLens = (list, lens) =>
  list
    .filter((x) => !x.lenses || x.lenses.includes(lens))
    .map((x) => (x.bullets ? { ...x, bullets: x.bullets.filter((b) => b.lenses.includes(lens)) } : x));

/** Section ids that print on the A4 sheet for a lens (the changelog is screen-only). */
export const sheetSections = (lens) => ORDER[lens].filter((id) => id !== 'changelog');
