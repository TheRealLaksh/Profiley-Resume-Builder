export const initialData = {
  personal: {
    name: "Laksh Pradhwani",
    title: "Aspiring AI & ML Engineer | Full Stack Developer",
    email: "contact@lakshp.live",
    phone: "xxxxxxxxxx",
    location: "Varanasi, Uttar Pradesh, India",
    linkedin: "https://www.linkedin.com/in/laksh-pradhwani/",
    portfolio: "https://www.lakshp.live/",
    photoUrl: "",
    summary:
      "Grade XII student aspiring to specialize in Artificial Intelligence and Machine Learning. Disciplined, analytical, and solution-driven with strong foundations in full-stack web development, data science, and algorithmic problem-solving. National-level shooter, hackathon performer, and student leader with proven ability to excel under pressure and deliver real-world technical solutions."
  },

  education: [
    {
      id: 1,
      institution: "Sunbeam School Lahartara",
      degree: "Grade XII – PCM with Computer Science",
      year: "2024 – Present",
      details:
        "Currently pursuing Physics, Chemistry, Mathematics, and Computer Science. Actively involved in hackathons, MUNs, advanced AI workshops, and competitive technical learning."
    },
    {
      id: 2,
      institution: "Chinmaya International Residential School, Coimbatore",
      degree: "Class X",
      year: "Completed 2024",
      details:
        "Secured 87.8% overall with 94% in Mathematics. Served as House Captain, member of the Round Square Organizing Committee, and active participant in leadership programs, sports, and MUNs."
    }
  ],

  experience: [
    {
      id: 1,
      role: "AI & Algorithmic Problem-Solving Intern",
      company: "IIT Madras (Online)",
      year: "2025",
      details:
        "Completed an 8-week intensive program focused on data science, data engineering, supervised and unsupervised learning (KNN, K-Means), and algorithmic problem-solving."
    },
    {
      id: 2,
      role: "Full Stack Web Developer Intern",
      company: "Unified Mentor",
      year: "Oct 2025 – Dec 2025",
      details:
        "Built multiple production-ready platforms including Helios (interactive music player), Calibridge (universal calendar exporter), CogniSync (academic appointment and messaging platform), and MarketBridge (digital marketplace for local merchants)."
    },
    {
      id: 3,
      role: "Web Developer Intern",
      company: "MoreYeahs",
      year: "Aug 2025 – Sep 2025",
      details:
        "Developed a full-stack gig platform using Django and Python. Implemented REST APIs, authentication systems, and complete CRUD functionality with a dynamic frontend."
    },
    {
      id: 4,
      role: "IT Intern",
      company: "Hotel Kavana",
      year: "Jun 2025",
      details:
        "Completed a 20-day on-site internship managing IT infrastructure, automation workflows, and operational technical systems in a professional hospitality environment."
    }
  ],

  skills: [
    { name: "Python & Django", level: 95 },
    { name: "JavaScript, React & Redux", level: 92 },
    { name: "HTML, CSS & Tailwind", level: 90 },
    { name: "Machine Learning & Data Science", level: 85 },
    { name: "REST APIs & Backend Systems", level: 90 },
    { name: "Prompt Engineering & Generative AI", level: 85 },
    { name: "Leadership & Team Collaboration", level: 90 }
  ],

  achievements: [
    "Regional Winner, VVM National Science Competition (2023); advanced to National Level",
    "2nd Position, AFS Tech Ramble – Web Wizards (Website Development & Deployment)",
    "2nd Position, Robowars – Impetus ’25",
    "National-level Shooter – 34th Rank, All-India U-17 Shooting Competition",
    "Top 100 National Rank, Shri Shakti Institute of Technology Quiz (ISRO Satellite Launch Witness)",
    "Consistent top performer in hackathons including WebWiz – Website Development Hackathon"
  ],

  community: [
    "Volunteered at a local orphanage and a home for specially-abled children, assisting in basic learning activities.",
    "Independently organized and led a crowdfunding campaign for underprivileged children (2022).",
    "Participated in local cleanliness drives and community outreach initiatives.",
    "Active participant in CHEMUN, IIMUN, and TISB MUN; served in the Press Corps for G20 MUN.",
    "Member of the Round Square Organizing Committee, contributing to student-led event coordination."
  ],

  custom: {}
};

export const initialSections = [
  { id: "summary", label: "Profile Summary", visible: true, type: "standard" },
  { id: "experience", label: "Experience", visible: true, type: "standard" },
  { id: "education", label: "Education", visible: true, type: "standard" },
  { id: "skills", label: "Skills", visible: true, type: "standard" },
  { id: "achievements", label: "Achievements", visible: true, type: "standard" },
  { id: "community", label: "Volunteering", visible: true, type: "standard" }
];

export const initialConfig = {
  activeTemplate: "leafy",
  themeColor: "midnight",
  fontFamily: "font-inter",
  paperTint: "bg-white",
  layoutType: "sidebar",
  layoutReverse: false,
  headerAlign: "text-left",
  sidebarBg: "none",
  fontScale: "text-base",
  spacingScale: "normal",
  nameSize: "text-4xl",
  nameWeight: "font-extrabold",
  uppercaseHeaders: true,
  jobTitleColor: "theme",
  showPhoto: true,
  photoShape: "rounded-full",
  photoBorder: "none",
  contactLayout: "row",
  sectionHeaderStyle: "underline",
  sectionTitleSize: "text-lg",
  dividerStyle: "none",
  borderStyle: "none",
  entryBox: "clean",
  dateAlign: "right",
  companyStyle: "font-semibold",
  timeline: false,
  skillStyle: "tags",
  skillShape: "rounded-md",
  socialStyle: "simple",
  bulletStyle: "disc",
  dateStyle: "default",
  showIcons: true,
  showSectionIcons: true,
  showSummary: true,
  watermark: "",
  customFooter: ""
};
