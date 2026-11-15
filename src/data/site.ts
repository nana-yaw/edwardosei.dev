/* ── Page copy for the single design ──────────────────────── */
// Headings, labels and link text that belong to the page rather than
// to Edward's profile or to one project. Written for a business owner who
// needs a product built: plain words, outcomes first, no internals.

import { profile } from "./profile";
import { brand, hiringPath, homePath, printPath, resumeUrl } from "./navigation";

export const sections = {
  work: {
    title: "Products I have built and launched",
    caseStudyLabel: "Read the case study",
    liveLabel: "Visit the live site",
  },
  approach: {
    title: "How I build",
    // Order matters: research on disclosing AI use says to lead with who
    // answers for the work, then say plainly that AI writes the drafts.
    points: [
      {
        name: "One person answers for it",
        detail: "You talk to me, I build it, and I answer for the result.",
      },
      {
        name: "I check every change",
        detail:
          "I read, test and release each change myself.",
      },
      {
        name: "AI writes the first draft",
        detail:
          "I use AI models and build agents to draft the code. That is how one developer can deliver a whole product.",
      },
    ],
  },
  story: { title: "Physics first, then code", photoAlt: "Edward Osei-Nyarko" },
  experience: {
    title: "Where I have worked",
    resumeNote: "The full history is in the resume.",
  },
  // The services themselves are in services.ts.
  skills: {
    title: "What I can build for you",
    toolsTitle: "Tools I use",
  },
  // Edward's decisions (15 Nov 2026): consultations are free, run 30 minutes
  // and are asked for by email, so the button opens one.
  consultation: {
    anchor: "consultation",
    title: "Available for consultations",
    lede: "Not sure what your idea needs yet? Talk it through with me first. It is a free 30-minute call.",
    outcome:
      "You leave knowing what it would take to build, what to do first, and whether I am the right person for it.",
    action: "Ask for a free consultation",
    emailSubject: "Consultation",
  },
  contact: {
    title: "Have a product in mind?",
    links: { github: "GitHub", linkedin: "LinkedIn", resume: "Resume (PDF)" },
    lede: "Send me your mockups, or just describe what you need. I will tell you what it would take to build.",
    // Edward's decisions (15 Nov 2026): no prices on the site, clients in
    // Ghana and abroad, quotes in either currency, and a monthly care plan
    // after launch. With no prices shown, the steps say what an email leads to.
    nextStepsTitle: "What happens next",
    nextSteps: [
      "We talk it through on a free 30-minute call, at a time that suits you. I work on GMT.",
      "I send a written quote in US dollars or cedis: what I will build, the price and the dates.",
      "I build it in stages and show you each one working as it is done.",
      "It goes live at your own address. After that, a monthly care plan keeps it running, if you want one.",
    ],
  },
} as const;

// Edward's promise (15 Nov 2026), shown next to each email button.
export const replyTime = "I reply within 48 hours.";

export const caseStudy = {
  backLabel: "Back to all work",
} as const;

/* ── The page for hiring managers ── */
// General practice only. Nothing here says how a client's product is put
// together or protected.
export const hiring = {
  title: "For hiring managers",
  headline: "Backend and full-stack engineer, open to a remote role.",
  lede: `I'm ${profile.name}, a backend engineer working remotely from ${profile.location}. I also build and launch whole products on my own.`,
  resumeLabel: "Read the resume",
  links: { github: "GitHub", linkedin: "LinkedIn", email: "Email" },
  workLink: { label: "See the products", href: `${homePath}#project` },
  // Edward's answers (15 Nov 2026): backend and full-stack roles,
  // part-time or contract from now, either way of being engaged, and
  // overlap for stand-ups and meetings.
  termsTitle: "Working together",
  terms: [
    { name: "Part-time or contract", detail: "I can start now." },
    {
      name: "Contractor or employer of record",
      detail: "Whichever suits your company.",
    },
    {
      name: "On GMT, in your meetings",
      detail: "I always overlap with your stand-ups and team meetings.",
    },
  ],
  // General on purpose: no company is named here (Edward, 15 Nov 2026).
  storyTitle: "A test suite, twice as fast",
  story:
    "At my current job, the browser tests ran one after another against one shared database and took about 45 minutes. I gave each parallel worker its own copy of the database, cloned from a ready-made template, a technique the team already used for its unit tests. The tests sign in with a token instead of through the screens, and the slowest tests start first so the workers finish together. The suite now runs in about 23 minutes on two workers.",
  practiceTitle: "How I work",
  practice: [
    {
      name: "Tests ship with the work",
      detail:
        "Si Hene has 822 automated test files.",
    },
    {
      name: "I test the tests",
      detail:
        "I use mutation testing: break the code on purpose and confirm a test fails.",
    },
    {
      name: "This site is tested too",
      detail:
        "Browser checks cover its 3D budget, keyboard use and reduced motion.",
    },
    {
      name: "AI drafts, I review",
      detail:
        "I build with AI coding agents, read every diff and own every line.",
    },
  ],
  toolsTitle: "Tools I use",
} as const;

/* ── What search results and link previews show ── */
export const meta = {
  siteName: `${brand} | ${profile.name}`,
  /** A page's own title goes where the %s is. */
  titleTemplate: `%s | ${brand}`,
  description:
    "Web developer who builds web apps for business owners, from an idea or mockups to live payments.",
  // No url: with none, a link preview uses the page's own address. Pages
  // add a canonical link instead of their own openGraph, which would drop
  // the share image the root provides.
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: `${brand} | ${profile.name}`,
  },
  portfolio: {
    title: "Portfolio",
    description: `${profile.name} builds web apps for business owners, from an idea or mockups to live payments.`,
  },
  // The picture a shared link shows.
  preview: {
    alt: `${brand} | ${profile.name}, web developer`,
    line: "Web apps for business owners, from an idea or mockups to live payments.",
  },
} as const;

export const notFoundPage = {
  title: "Page not found",
  lede: "That address does not match anything on this site.",
  action: "Back to the portfolio",
} as const;

export const skillGroupLabels = {
  backend: "Languages",
  frameworks: "Frameworks",
  databases: "Databases",
  cloud: "Infrastructure",
  testing: "Testing",
} as const;

export const footer = {
  links: [
    { label: hiring.title, href: hiringPath },
    { label: "Print version", href: printPath },
    { label: "Resume (PDF)", href: resumeUrl },
  ],
} as const;
