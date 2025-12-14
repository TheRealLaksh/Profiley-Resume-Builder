// src/data/constants.js

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
    summary: "Disciplined Grade XII student with a focused ambition in Artificial Intelligence and Machine Learning. Proactive problem-solver with hands-on experience in full-stack web development (Django, Python) and algorithmic problem-solving. National-level shooter and active badminton player with strong leadership skills honed as House Captain."
  },
  education: [
    {
      id: 1,
      institution: "Sunbeam School Lahartara",
      degree: "Grade XII - PCM with CS",
      year: "April 2024 - Present",
      details: "Pursuing rigorous coursework in Physics, Chemistry, Math, and CS."
    },
    {
      id: 2,
      institution: "Chinmaya International Residential School",
      degree: "Class X",
      year: "Completed 2024",
      details: "Secured 87.8% overall. Achieved 94% in Mathematics. Served as House Captain."
    }
  ],
  experience: [
    {
      id: 1,
      role: "AI Intern",
      company: "IIT Madras (Online)",
      year: "8 Weeks",
      details: "Completed intensive program focused on Data Science, Data Engineering, and supervised/unsupervised learning models (KNN, K-Means)."
    },
    {
      id: 2,
      role: "Full Stack Developer Intern",
      company: "Unified Mentor",
      year: "Remote",
      details: "Developed user-centric applications including Helios (music player), Calibridge (calendar exporter), and CogniSync."
    },
    {
      id: 3,
      role: "Web Developer Intern",
      company: "MoreYeahs",
      year: "Remote",
      details: "Built a full-stack gig platform using Django and Python. Developed REST APIs and auth systems."
    }
  ],
  skills: [
    { name: "Artificial Intelligence & ML", level: 90 },
    { name: "Data Science", level: 85 },
    { name: "Python & Django", level: 95 },
    { name: "REST APIs", level: 80 },
    { name: "Algorithmic Problem Solving", level: 85 },
    { name: "Leadership & Teamwork", level: 90 }
  ],
  achievements: [
    "Regional Winner, VVM National Science Competition (2023)",
    "National-level Shooter: 34th Rank in All-India U-17 Competition",
    "2nd Position: Website Development, AFS Tech Ramble",
    "2nd Position: Robowars – Impetus ’25"
  ],
  community: [
    "Volunteered at local orphanage and home for specially-abled children.",
    "Organized independent crowdfunding campaign for underprivileged children (2022).",
    "Member of Round Square Organizing Committee."
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

export const colorThemes = {
  blue: { name: 'Classic Blue', text: 'text-blue-700', border: 'border-blue-700', bg: 'bg-blue-50', icon: 'text-blue-600', hex: 'bg-blue-600', fill: 'bg-blue-700' },
  emerald: { name: 'Emerald', text: 'text-emerald-700', border: 'border-emerald-700', bg: 'bg-emerald-50', icon: 'text-emerald-600', hex: 'bg-emerald-600', fill: 'bg-emerald-700' },
  noir: { name: 'Noir (Minimal)', text: 'text-gray-900', border: 'border-gray-900', bg: 'bg-gray-100', icon: 'text-gray-800', hex: 'bg-gray-900', fill: 'bg-gray-900' },
  midnight: { name: 'Midnight Navy', text: 'text-slate-900', border: 'border-slate-800', bg: 'bg-slate-100', icon: 'text-slate-700', hex: 'bg-slate-800', fill: 'bg-slate-900' },
  coral: { name: 'Soft Coral', text: 'text-rose-600', border: 'border-rose-600', bg: 'bg-rose-50', icon: 'text-rose-500', hex: 'bg-rose-500', fill: 'bg-rose-600' },
  ocean: { name: 'Deep Ocean', text: 'text-cyan-800', border: 'border-cyan-800', bg: 'bg-cyan-50', icon: 'text-cyan-700', hex: 'bg-cyan-700', fill: 'bg-cyan-800' },
  forest: { name: 'Dark Forest', text: 'text-green-800', border: 'border-green-800', bg: 'bg-green-50', icon: 'text-green-700', hex: 'bg-green-800', fill: 'bg-green-800' },
  berry: { name: 'Berry', text: 'text-fuchsia-800', border: 'border-fuchsia-800', bg: 'bg-fuchsia-50', icon: 'text-fuchsia-700', hex: 'bg-fuchsia-800', fill: 'bg-fuchsia-800' },
  royal: { name: 'Royal Purple', text: 'text-indigo-800', border: 'border-indigo-800', bg: 'bg-indigo-50', icon: 'text-indigo-700', hex: 'bg-indigo-700', fill: 'bg-indigo-800' },
  gold: { name: 'Luxury Gold', text: 'text-yellow-700', border: 'border-yellow-700', bg: 'bg-yellow-50', icon: 'text-yellow-600', hex: 'bg-yellow-600', fill: 'bg-yellow-700' }
};

export const templates = {
  modern: {
    name: 'Modern',
    config: {
      layoutReverse: false,
      sidebarBg: 'gray',
      headerAlign: 'text-left',
      photoShape: 'rounded-full',
      fontFamily: 'font-inter',
      sectionHeaderStyle: 'left-bar',
      skillStyle: 'tags',
      showPhoto: true,
      borderStyle: 'none',
      themeColor: 'midnight'
    }
  },
  minimal: {
    name: 'Minimal',
    config: {
      layoutReverse: false,
      sidebarBg: 'none',
      headerAlign: 'text-left',
      photoShape: 'rounded-full',
      fontFamily: 'font-inter',
      sectionHeaderStyle: 'underline',
      skillStyle: 'list',
      showPhoto: false,
      borderStyle: 'none',
      themeColor: 'noir'
    }
  },
  creative: {
    name: 'Creative',
    config: {
      layoutReverse: true,
      sidebarBg: 'theme',
      headerAlign: 'text-center',
      photoShape: 'rounded-lg',
      fontFamily: 'font-raleway',
      sectionHeaderStyle: 'centered',
      skillStyle: 'bars',
      showPhoto: true,
      borderStyle: 'double',
      themeColor: 'coral'
    }
  },
  ats: {
    name: 'ATS Friendly',
    config: {
      layoutReverse: false,
      sidebarBg: 'none',
      headerAlign: 'text-left',
      photoShape: 'rounded-none',
      fontFamily: 'font-sans',
      sectionHeaderStyle: 'underline',
      skillStyle: 'comma',
      showPhoto: false,
      showIcons: false,
      showSectionIcons: false,
      borderStyle: 'none',
      themeColor: 'noir',
      layoutMode: 'single-column'
    }
  },
  // --- NEW TEMPLATES ---
  executive: {
    name: 'Executive',
    config: {
      layoutReverse: true,
      sidebarBg: 'theme',
      headerAlign: 'text-right',
      photoShape: 'rounded-md',
      fontFamily: 'font-merriweather',
      sectionHeaderStyle: 'box',
      skillStyle: 'tags',
      showPhoto: true,
      borderStyle: 'simple',
      themeColor: 'blue'
    }
  },
  elegant: {
    name: 'Elegant',
    config: {
      layoutReverse: false,
      sidebarBg: 'none',
      headerAlign: 'text-center',
      photoShape: 'rounded-full',
      fontFamily: 'font-playfair',
      sectionHeaderStyle: 'centered',
      skillStyle: 'list',
      showPhoto: true,
      dividerStyle: 'diamond',
      borderStyle: 'offset',
      themeColor: 'gold'
    }
  },
  tech: {
    name: 'Tech',
    config: {
      layoutReverse: false,
      sidebarBg: 'gray',
      headerAlign: 'text-left',
      photoShape: 'rounded-none',
      fontFamily: 'font-mono',
      sectionHeaderStyle: 'left-bar',
      skillStyle: 'bars',
      showPhoto: true,
      showIcons: true,
      borderStyle: 'none',
      themeColor: 'emerald'
    }
  },
  bold: {
    name: 'Bold',
    config: {
      layoutReverse: false,
      sidebarBg: 'theme',
      headerAlign: 'text-left',
      photoShape: 'rounded-none',
      fontFamily: 'font-oswald',
      sectionHeaderStyle: 'box',
      skillStyle: 'tags',
      showPhoto: true,
      uppercaseHeaders: true,
      nameWeight: 'font-black',
      nameSize: 'text-5xl',
      borderStyle: 'thick',
      themeColor: 'midnight'
    }
  },
  academic: {
    name: 'Academic',
    config: {
      layoutReverse: false,
      sidebarBg: 'none',
      headerAlign: 'text-center',
      photoShape: 'rounded-sm',
      fontFamily: 'font-lora',
      sectionHeaderStyle: 'underline',
      skillStyle: 'list',
      showPhoto: false,
      dividerStyle: 'thick',
      borderStyle: 'double',
      themeColor: 'royal',
      spacingScale: 'compact'
    }
  },
  compact: {
    name: 'Compact',
    config: {
      layoutReverse: true,
      sidebarBg: 'gray',
      headerAlign: 'text-left',
      photoShape: 'rounded-full',
      fontFamily: 'font-inter',
      sectionHeaderStyle: 'left-bar',
      skillStyle: 'tags',
      showPhoto: true,
      spacingScale: 'compact',
      fontScale: 'text-sm',
      borderStyle: 'none',
      themeColor: 'forest'
    }
  }
};

export const initialConfig = {
  themeColor: 'midnight',
  fontFamily: 'font-inter',
  paperTint: 'bg-white',
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