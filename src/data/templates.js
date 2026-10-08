// Each template is a partial design config laid over `initialConfig` (see applyTemplate in App.jsx).
// `description` is shown in the gallery; `tags` drive the filter chips.
export const templates = {
  modern: {
    name: 'Modern',
    description: 'Balanced sidebar with a soft grey rail.',
    tags: ['sidebar'],
    config: {
      layoutType: 'sidebar',
      sidebarBg: 'gray',
      headerAlign: 'text-left',
      photoShape: 'rounded-full',
      fontFamily: 'font-inter',
      sectionHeaderStyle: 'underline',
      skillStyle: 'tags',
      themeColor: 'midnight'
    }
  },
  leafy: {
    name: 'Leafy',
    description: 'Tinted rail, rounded photo and calm green headings.',
    tags: ['sidebar', 'colour'],
    config: {
      layoutType: 'sidebar',
      sidebarBg: 'theme',
      headerAlign: 'text-left',
      photoShape: 'rounded-xl',
      fontFamily: 'font-raleway',
      sectionHeaderStyle: 'left-bar',
      skillStyle: 'tags',
      themeColor: 'forest',
      sidebarSections: ['education', 'skills'],
      mainSections: ['summary', 'experience', 'achievements', 'community']
    }
  },
  nordic: {
    name: 'Nordic',
    description: 'Dark sidebar, light page and skill dots.',
    tags: ['sidebar', 'bold'],
    config: {
      layoutType: 'sidebar',
      sidebarBg: 'dark',
      headerAlign: 'text-left',
      photoShape: 'rounded-xl',
      fontFamily: 'font-jakarta',
      sectionHeaderStyle: 'plain',
      skillStyle: 'dots',
      dateAlign: 'below',
      themeColor: 'midnight',
      nameSize: 'text-3xl',
      nameWeight: 'font-extrabold'
    }
  },
  executive: {
    name: 'Executive',
    description: 'Serif, right-hand sidebar and boxed headings.',
    tags: ['sidebar', 'serif'],
    config: {
      layoutType: 'sidebar',
      layoutReverse: true,
      sidebarBg: 'theme',
      headerAlign: 'text-left',
      photoShape: 'rounded-md',
      fontFamily: 'font-merriweather',
      sectionHeaderStyle: 'box',
      skillStyle: 'tags',
      themeColor: 'blue'
    }
  },
  creative: {
    name: 'Creative',
    description: 'Warm accent, skill bars and a mirrored layout.',
    tags: ['sidebar', 'colour'],
    config: {
      layoutType: 'sidebar',
      layoutReverse: true,
      sidebarBg: 'theme',
      headerAlign: 'text-left',
      photoShape: 'rounded-lg',
      fontFamily: 'font-raleway',
      sectionHeaderStyle: 'centered',
      skillStyle: 'bars',
      themeColor: 'coral'
    }
  },
  tech: {
    name: 'Tech',
    description: 'Monospace with prompt-style headings.',
    tags: ['sidebar', 'mono'],
    config: {
      layoutType: 'sidebar',
      sidebarBg: 'gray',
      headerAlign: 'text-left',
      photoShape: 'rounded-none',
      fontFamily: 'font-mono',
      sectionHeaderStyle: 'prompt',
      skillStyle: 'bars',
      uppercaseHeaders: false,
      themeColor: 'emerald'
    }
  },
  atlas: {
    name: 'Atlas',
    description: 'Full-width colour banner and a vertical timeline.',
    tags: ['single', 'colour'],
    config: {
      layoutType: 'single',
      headerStyle: 'banner',
      headerAlign: 'text-left',
      sidebarBg: 'none',
      photoShape: 'rounded-full',
      fontFamily: 'font-jakarta',
      sectionHeaderStyle: 'left-bar',
      entryStyle: 'timeline',
      skillStyle: 'tags',
      spacingScale: 'normal',
      themeColor: 'ocean',
      nameSize: 'text-3xl'
    }
  },
  swiss: {
    name: 'Swiss',
    description: 'Titles in a left gutter, generous whitespace.',
    tags: ['single', 'minimal'],
    config: {
      layoutType: 'gutter',
      headerStyle: 'default',
      headerAlign: 'text-left',
      sidebarBg: 'none',
      showPhoto: false,
      fontFamily: 'font-grotesk',
      sectionHeaderStyle: 'plain',
      skillStyle: 'comma',
      showSectionIcons: false,
      showIcons: false,
      spacingScale: 'normal',
      themeColor: 'coral',
      nameSize: 'text-4xl',
      nameWeight: 'font-extrabold'
    }
  },
  poster: {
    name: 'Poster',
    description: 'A big confident name over a thick accent bar.',
    tags: ['single', 'bold'],
    config: {
      layoutType: 'single',
      headerStyle: 'poster',
      headerAlign: 'text-left',
      sidebarBg: 'none',
      showPhoto: false,
      fontFamily: 'font-inter',
      headingFont: 'font-grotesk',
      sectionHeaderStyle: 'caps-rule',
      skillStyle: 'tags',
      showSectionIcons: false,
      spacingScale: 'normal',
      themeColor: 'royal',
      nameSize: 'text-5xl',
      nameWeight: 'font-extrabold'
    }
  },
  minimal: {
    name: 'Minimal',
    description: 'Quiet, single column, almost no ornament.',
    tags: ['single', 'minimal'],
    config: {
      layoutType: 'single',
      sidebarBg: 'none',
      headerAlign: 'text-left',
      photoShape: 'rounded-full',
      fontFamily: 'font-inter',
      sectionHeaderStyle: 'plain',
      skillStyle: 'comma',
      showPhoto: false,
      showSectionIcons: false,
      showIcons: false,
      spacingScale: 'normal',
      themeColor: 'noir'
    }
  },
  ats: {
    name: 'ATS Friendly',
    description: 'Plain Arial, no icons or photo. Safe for parsers.',
    tags: ['single', 'ats'],
    config: {
      layoutType: 'single',
      sidebarBg: 'none',
      headerAlign: 'text-left',
      fontFamily: 'font-sans',
      sectionHeaderStyle: 'caps-rule',
      skillStyle: 'comma',
      showPhoto: false,
      showIcons: false,
      showSectionIcons: false,
      themeColor: 'noir'
    }
  },
  ledger: {
    name: 'Ledger',
    description: 'Dense, two-sided header and tight rhythm.',
    tags: ['single', 'serif', 'ats'],
    config: {
      layoutType: 'single',
      headerStyle: 'split',
      sidebarBg: 'none',
      headerAlign: 'text-left',
      showPhoto: false,
      fontFamily: 'font-lora',
      sectionHeaderStyle: 'caps-rule',
      skillStyle: 'comma',
      showSectionIcons: false,
      showIcons: false,
      themeColor: 'midnight',
      nameSize: 'text-3xl',
      nameWeight: 'font-bold'
    }
  },
  elegant: {
    name: 'Elegant',
    description: 'Centred serif on warm paper with a fine frame.',
    tags: ['single', 'serif'],
    config: {
      layoutType: 'single',
      headerStyle: 'centered',
      sidebarBg: 'none',
      headerAlign: 'text-center',
      photoShape: 'rounded-full',
      fontFamily: 'font-playfair',
      sectionHeaderStyle: 'centered',
      skillStyle: 'comma',
      showSectionIcons: false,
      showIcons: false,
      dividerStyle: 'diamond',
      borderStyle: 'simple',
      paperTint: 'bg-[#fbf7ee]',
      spacingScale: 'normal',
      themeColor: 'gold',
      nameSize: 'text-4xl',
      nameWeight: 'font-bold'
    }
  },
  classic: {
    name: 'Classic',
    description: 'Traditional centred header with a double frame.',
    tags: ['single', 'serif'],
    config: {
      layoutType: 'single',
      headerStyle: 'centered',
      sidebarBg: 'none',
      headerAlign: 'text-center',
      fontFamily: 'font-merriweather',
      sectionHeaderStyle: 'underline',
      skillStyle: 'list',
      showPhoto: false,
      showSectionIcons: false,
      showIcons: false,
      dividerStyle: 'thick',
      borderStyle: 'double',
      themeColor: 'midnight',
      nameSize: 'text-3xl',
      nameWeight: 'font-bold'
    }
  },
  blush: {
    name: 'Blush',
    description: 'Soft tinted paper, rounded boxes and a friendly feel.',
    tags: ['single', 'colour'],
    config: {
      layoutType: 'single',
      headerStyle: 'centered',
      sidebarBg: 'none',
      headerAlign: 'text-center',
      photoShape: 'rounded-full',
      fontFamily: 'font-jakarta',
      sectionHeaderStyle: 'box',
      entryStyle: 'boxed',
      skillStyle: 'tags',
      showSectionIcons: true,
      paperTint: 'bg-[#fdf6f3]',
      spacingScale: 'normal',
      themeColor: 'coral',
      nameSize: 'text-3xl'
    }
  },
  glitch: {
    name: 'Glitch',
    description: 'Hard edges, mono type and a black accent.',
    tags: ['single', 'mono', 'bold'],
    config: {
      layoutType: 'single',
      sidebarBg: 'none',
      headerAlign: 'text-left',
      photoShape: 'rounded-none',
      fontFamily: 'font-mono',
      sectionHeaderStyle: 'left-bar',
      skillStyle: 'tags',
      themeColor: 'noir',
      uppercaseHeaders: true,
      nameWeight: 'font-black',
      nameSize: 'text-3xl'
    }
  }
};

export const templateFilters = [
  { id: 'all', label: 'All' },
  { id: 'sidebar', label: 'Sidebar' },
  { id: 'single', label: 'Single column' },
  { id: 'ats', label: 'ATS' },
  { id: 'serif', label: 'Serif' },
  { id: 'colour', label: 'Colour' }
];
