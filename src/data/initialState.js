export const initialData = {
  personal: {
    name: "Laksh Pradhwani",
    title: "Aspiring AI & ML Engineer | Full Stack Developer",
    email: "contact@lakshp.live", 
    phone: "xxxxxxxxxxxxx", 
    location: "Varanasi, India",
    linkedin: "https://www.linkedin.com/in/laksh-pradhwani/",
    portfolio: "https://www.lakshp.live/",
    photoUrl: "", 
    summary: "Disciplined Grade XII student with a focused ambition in Artificial Intelligence and Machine Learning. Proactive problem-solver with hands-on experience in full-stack web development and algorithmic problem-solving. Proven track record in hackathons, national-level sports, and leadership roles."
  },
  education: [
    {
      id: 1,
      institution: "Sunbeam School Lahartara",
      degree: "Grade XII - PCM with Computer Science",
      year: "2024 - Present",
      details: "Pursuing rigorous coursework in Physics, Chemistry, Math, and CS. Regional Winner of VVM National Science Competition (2023)."
    },
    {
      id: 2,
      institution: "Chinmaya Int. Res. School",
      degree: "Class X",
      year: "Completed 2024",
      details: "Secured 87.8% overall with 94% in Mathematics. Served as House Captain and member of Round Square Organizing Committee."
    }
  ],
  experience: [
    {
      id: 1,
      role: "Full Stack Developer",
      company: "Unified Mentor",
      year: "Oct 2025 - Dec 2025",
      details: "Developed user-centric apps: Helios (music player), Calibridge (calendar exporter), CogniSync (academic platform), and MarketBridge."
    },
    {
      id: 2,
      role: "Web Developer",
      company: "MoreYeahs",
      year: "Aug 2025 - Sep 2025",
      details: "Built a full-stack gig platform using Django and Python; developed REST APIs, authentication systems, and CRUD functionality."
    },
    {
      id: 3,
      role: "IT Intern",
      company: "Hotel Kavana",
      year: "Jun 2025",
      details: "Managed technical systems and operational IT requirements in a professional hospitality environment."
    }
  ],
  skills: [
    { name: "Python & Django", level: 95 },
    { name: "React.js & Redux", level: 90 },
    { name: "Machine Learning", level: 85 },
    { name: "REST APIs", level: 90 },
    { name: "Leadership", level: 90 }
  ],
  achievements: [
    "Regional Winner, VVM National Science Competition (2023)",
    "2nd Position, AFS Tech Ramble – Web Wizards (Website Dev)",
    "2nd Position, Robowars – Impetus ’25",
    "Top 100 National Rank, Shri Shakti Institute Quiz (Witnessed ISRO Launch)",
    "National-level Shooter: 34th Rank All-India U-17"
  ],
  community: [
    "Organized crowdfunding campaign for underprivileged children (2022).",
    "Volunteered at local orphanage & home for specially-abled children.",
    "Press Corps member for G20 MUN.",
    "Active participant in CHEMUN, IIMUN, and TISB MUN."
  ],
  custom: {}
};

export const initialSections = [
  { id: 'summary', label: 'Profile Summary', visible: true, type: 'standard' },
  { id: 'experience', label: 'Experience', visible: true, type: 'standard' },
  { id: 'education', label: 'Education', visible: true, type: 'standard' },
  { id: 'skills', label: 'Skills', visible: true, type: 'standard' },
  { id: 'achievements', label: 'Achievements', visible: true, type: 'standard' },
  { id: 'community', label: 'Volunteering', visible: true, type: 'standard' }
];

export const initialConfig = {
  activeTemplate: 'leafy', // Changed default to 'leafy'
  themeColor: 'midnight',
  fontFamily: 'font-inter',
  paperTint: 'bg-white',
  layoutType: 'sidebar',
  layoutReverse: false,
  headerAlign: 'text-left',
  sidebarBg: 'none', 
  fontScale: 'text-base', 
  spacingScale: 'normal', 
  nameSize: 'text-4xl',
  nameWeight: 'font-extrabold',
  uppercaseHeaders: true,
  jobTitleColor: 'theme', 
  showPhoto: true,
  photoShape: 'rounded-full',
  photoBorder: 'none',
  contactLayout: 'row',
  sectionHeaderStyle: 'underline',
  sectionTitleSize: 'text-lg',
  dividerStyle: 'none',
  borderStyle: 'none',
  entryBox: 'clean',
  dateAlign: 'right',
  companyStyle: 'font-semibold',
  timeline: false,
  skillStyle: 'tags',
  skillShape: 'rounded-md',
  socialStyle: 'simple',
  bulletStyle: 'disc',
  dateStyle: 'default',
  showIcons: true,
  showSectionIcons: true,
  showSummary: true,
  watermark: '',
  customFooter: '',
};