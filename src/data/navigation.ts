// Section order per anti-slop direction:
// Hero → Featured Project → Origin Story → Experience → Skills → Contact
// Project BEFORE story — show the work first, then explain who built it.

export const navItems = [
  { label: "Project", href: "#project" },
  { label: "Story", href: "#story" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export const resumeUrl = "/Edward_Osei-Nyarko_Resume.pdf";
