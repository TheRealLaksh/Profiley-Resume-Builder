export const templates = {
  modern: {
    name: "Modern",
    config: {
      layoutReverse: false,
      sidebarBg: "gray",
      headerAlign: "text-left",
      photoShape: "rounded-full",
      fontFamily: "font-inter",
      sectionHeaderStyle: "left-bar",
      skillStyle: "tags",
      showPhoto: true,
      borderStyle: "none",
      themeColor: "midnight"
    }
  },
  minimal: {
    name: "Minimal",
    config: {
      layoutReverse: false,
      sidebarBg: "none",
      headerAlign: "text-left",
      photoShape: "rounded-full",
      fontFamily: "font-inter",
      sectionHeaderStyle: "underline",
      skillStyle: "list",
      showPhoto: false,
      borderStyle: "none",
      themeColor: "noir"
    }
  },
  creative: {
    name: "Creative",
    config: {
      layoutReverse: true,
      sidebarBg: "theme",
      headerAlign: "text-center",
      photoShape: "rounded-lg",
      fontFamily: "font-raleway",
      sectionHeaderStyle: "centered",
      skillStyle: "bars",
      showPhoto: true,
      borderStyle: "double",
      themeColor: "coral"
    }
  },
  ats: {
    name: "ATS Friendly",
    config: {
      layoutReverse: false,
      sidebarBg: "none",
      headerAlign: "text-left",
      photoShape: "rounded-none",
      fontFamily: "font-sans",
      sectionHeaderStyle: "underline",
      skillStyle: "comma",
      showPhoto: false,
      showIcons: false,
      showSectionIcons: false,
      borderStyle: "none",
      themeColor: "noir",
      layoutMode: "single-column"
    }
  }
};
