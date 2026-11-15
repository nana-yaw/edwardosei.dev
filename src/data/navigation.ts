// Section order per anti-slop direction:
// Hero → Work → Origin Story → Experience → Skills → Contact
// Work BEFORE story — show the work first, then explain who built it.
// Section ids are fixed; `compact` marks the links that stay on a phone.

export const navItems = [
  { label: "Work", href: "#project", compact: true },
  { label: "Story", href: "#story", compact: true },
  { label: "Experience", href: "#experience", compact: false },
  { label: "Services", href: "#skills", compact: false },
  { label: "Contact", href: "#contact", compact: true },
] as const;

// The address that loads today. edwardosei.dev is not connected yet; when it
// is, this is the one line to change (Edward, 15 Nov 2026).
export const siteUrl = "https://edwardoseidev.vercel.app";
export const homePath = "/portfolio";
export const resumeUrl = "/Edward_Osei-Nyarko_Resume.pdf";
export const printPath = "/portfolio/print";
export const hiringPath = "/hiring";
export const skipLabel = "Skip to content";
export const mainId = "main-content";

// The header shows it on every page, and the header runs in the browser.
// It lives here rather than in profile.ts so the browser is sent this one
// word and not the whole profile.
export const brand = "devONE";

export const stickyNav = {
  /** What a screen reader calls the list of section links. */
  label: "Sections",
} as const;

// One button, two jobs. The words are also its accessible name, so each must
// say what a press will do.
export const scrollButton = {
  toWork: "See the work",
  toTop: "Back to top",
} as const;
