export const initialData = {
  personal: {
    name: "Laksh Pradhwani",
    title: "Aspiring AI & ML Engineer | Full Stack Developer",
    email: "laksh.pradhwani@example.com", 
    phone: "+91 98765 43210", 
    location: "Varanasi, India",
    linkedin: "https://www.linkedin.com/in/laksh-pradhwani/",
    portfolio: "https://www.lakshp.live/",
    photoUrl: "", 
    summary: "Disciplined Grade XII student with a focused ambition in Artificial Intelligence and Machine Learning. Proactive problem-solver with hands-on experience in full-stack web development and algorithmic problem-solving."
  },
  education: [
    {
      id: 1,
      institution: "Sunbeam School Lahartara",
      degree: "Grade XII - PCM with CS",
      year: "2024 - Present",
      details: "Pursuing rigorous coursework in Physics, Chemistry, Math, and CS."
    },
    {
      id: 2,
      institution: "Chinmaya Int. Res. School",
      degree: "Class X",
      year: "2024",
      details: "Secured 87.8% overall. Achieved 94% in Mathematics. House Captain."
    }
  ],
  experience: [
    {
      id: 1,
      role: "AI Intern",
      company: "IIT Madras",
      year: "2023",
      details: "Completed intensive program focused on Data Science, Data Engineering, and supervised learning models."
    },
    {
      id: 2,
      role: "Full Stack Developer",
      company: "Unified Mentor",
      year: "2024",
      details: "Developed user-centric applications including Helios (music player) and Calibridge (calendar exporter)."
    }
  ],
  skills: [
    { name: "Python & Django", level: 95 },
    { name: "Machine Learning", level: 85 },
    { name: "React.js", level: 90 },
    { name: "Leadership", level: 90 }
  ],
  achievements: [
    "Regional Winner, VVM National Science Competition (2023)",
    "National-level Shooter: 34th Rank All-India U-17"
  ],
  community: [
    "Volunteered at local orphanage.",
    "Organized crowdfunding campaign."
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