/* ── Copy for the hero ────────────────────────────────────── */
// The hero's headline, introduction and two doors. The words of its picture
// are in heroPicture.ts. The hero tells one story: the owner arrives with an
// idea, the build gives it a home, and the home ends up ready to take
// payments. It says nothing about what the product will bring in.

import { profile } from "./profile";
import { hiringPath, homePath } from "./navigation";

export const hero = {
  // Three sentences, one job each: what he is, what you bring, what you get.
  headline: ["Web developer.", "You bring the idea.", "I build its home."],
  lede: `I'm ${profile.name}, a web developer in Accra, Ghana. You know what you want your product to do. I build what is behind it, the part that makes it come alive.`,
  primary: { label: "Hire me for a project", href: `${homePath}#contact` },
  secondary: { label: "Open to remote roles", href: hiringPath },
  availability: "Available for free consultations and new projects.",
} as const;
