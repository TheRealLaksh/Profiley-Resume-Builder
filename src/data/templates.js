export const templates = {
  leafy: {
    name: 'Leafy',
    config: {
      layoutType: 'sidebar',
      layoutReverse: false,
      sidebarBg: 'theme',
      headerAlign: 'text-left',
      photoShape: 'rounded-xl',
      fontFamily: 'font-raleway',
      sectionHeaderStyle: 'box',
      skillStyle: 'tags',
      showPhoto: true,
      borderStyle: 'rounded',
      themeColor: 'forest',
      // Custom section placement for Leafy
      sidebarSections: ['education', 'skills'],
      mainSections: ['summary', 'experience', 'achievements', 'community']
    }
  },
  modern: {
    name: 'Modern',
    config: {
      layoutType: 'sidebar',
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
      layoutType: 'single',
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
      layoutType: 'sidebar',
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
      layoutType: 'single',
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
  executive: {
    name: 'Executive',
    config: {
      layoutType: 'sidebar',
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
      layoutType: 'single',
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
      layoutType: 'sidebar',
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
  glitch: {
    name: 'Glitch',
    config: {
      layoutType: 'single',
      layoutReverse: false,
      sidebarBg: 'none',
      headerAlign: 'text-left',
      photoShape: 'rounded-none',
      fontFamily: 'font-mono',
      sectionHeaderStyle: 'left-bar',
      skillStyle: 'tags',
      showPhoto: true,
      showIcons: true,
      borderStyle: 'none',
      themeColor: 'noir',
      uppercaseHeaders: true,
      nameWeight: 'font-black'
    }
  },
  classic: {
    name: 'Classic',
    config: {
      layoutType: 'single',
      layoutReverse: false,
      sidebarBg: 'none',
      headerAlign: 'text-center',
      photoShape: 'rounded-full',
      fontFamily: 'font-merriweather',
      sectionHeaderStyle: 'underline',
      skillStyle: 'list',
      showPhoto: false,
      dividerStyle: 'thick',
      borderStyle: 'double',
      themeColor: 'midnight'
    }
  }
};