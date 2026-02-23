# Multi-Theme Portfolio App - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a standalone Next.js portfolio at `/Users/edwardosei-nyarko/Projects/edwardosei.dev` with 4 switchable visual themes (Cinematic, Minimal, Bold, Terminal), a Spline 3D avatar, and EWC Care App showcase.

**Architecture:** Theme-variant components (Approach A) — each theme gets its own full component set sharing a common data layer. Theme context drives which variant renders. Landing page lets visitors choose a theme; a floating switcher persists throughout.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Framer Motion, @splinetool/react-spline, Vercel

---

## Task 1: Scaffold the Next.js Project

**Files:**
- Create: `/Users/edwardosei-nyarko/Projects/edwardosei.dev/` (entire project scaffold)

**Step 1: Create the Next.js app**

```bash
cd /Users/edwardosei-nyarko/Projects
npx create-next-app@latest edwardosei.dev --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack
```

Accept defaults. This gives us Next.js 16 + Tailwind CSS 4 + App Router + src directory.

**Step 2: Install additional dependencies**

```bash
cd /Users/edwardosei-nyarko/Projects/edwardosei.dev
npm install framer-motion @splinetool/react-spline lucide-react clsx
npm install -D @types/node
```

**Step 3: Set up project directory structure**

Create the following directories:

```
src/
  components/
    themes/
      cinematic/
      minimal/
      bold/
      terminal/
    sections/
    ui/
  data/
  hooks/
  lib/
  styles/
public/
  screenshots/
  avatar/
  fonts/
```

**Step 4: Initialize git repo and commit**

```bash
cd /Users/edwardosei-nyarko/Projects/edwardosei.dev
git init
git add -A
git commit -m "chore: scaffold Next.js 16 portfolio app with dependencies"
```

---

## Task 2: Data Layer - Profile & Project Content

**Files:**
- Create: `src/data/profile.ts`
- Create: `src/data/projects.ts`
- Create: `src/data/navigation.ts`

**Step 1: Create the profile data file**

```typescript
// src/data/profile.ts
export const profile = {
  name: "Edward Osei-Nyarko",
  firstName: "Edward",
  lastName: "Osei-Nyarko",
  title: "Backend Engineer",
  tagline: "I build systems that scale.",
  email: "edward.osei.nyarko@gmail.com",
  github: "https://github.com/nana-yaw",
  githubHandle: "nana-yaw",
  linkedin: "https://linkedin.com/in/edward-osei-nyarko-5789b3118",
  location: "Ghana",
  availableForWork: true,

  about: {
    short: "Backend engineer with 4+ years of experience building scalable APIs, test infrastructure, and distributed systems for SaaS platforms.",
    long: "I'm a backend engineer with a physics background, which taught me to think in systems, model complexity, and debug reality. Over 4+ years, I've built production platforms serving thousands of users, specializing in PHP ecosystems (Symfony, Laravel), Node.js, and modern full-stack TypeScript. Currently working remotely with US-based teams, I thrive in async-first environments where clear communication and autonomous ownership drive results.",
    highlights: [
      "Physics background — systems thinking & modeling complexity",
      "4+ years building production backend systems",
      "Remote-first with US-based engineering teams",
      "Strong communicator in fast-paced startup environments",
    ],
  },

  experience: [
    {
      company: "RentPost, Inc.",
      role: "Backend Engineer",
      location: "Remote, US",
      period: "Jul 2023 - Present",
      current: true,
      achievements: [
        "Designed PostgreSQL database isolation architecture for parallel test execution using template-based cloning, reducing total test runtime by 50% with 2-4 concurrent workers",
        "Built cross-repository orchestration layer decoupling frontend and backend tests through CLI interfaces, establishing clean service boundaries",
        "Developed PASETO token-based authentication system for test automation, enabling secure stateless API access without session overhead",
        "Engineered parallel test runner with timing persistence and data-driven load balancing, maintaining 92% pass rate across 24 automated tests",
        "Refactored infrastructure scripts following YAGNI principles, reducing codebase by 61% while preserving functionality",
        "Developed and optimized SaaS APIs using PHP/Symfony with PSR-12 compliance",
        "Implemented interactive onboarding tour with driver.js, improving user adoption",
      ],
    },
    {
      company: "Turntabl Ghana Ltd.",
      role: "Software Engineer",
      location: "Accra, Ghana",
      period: "2021 - 2023",
      current: false,
      achievements: [
        "Built News Aggregator REST API using Spring Boot and Kotlin, scaling from 100 to 1,000+ users after company website integration",
        "Optimized API performance for internal systems; wrote technical documentation for engineer onboarding",
        "Mentored junior engineers on best practices, fostering team growth and improving code quality",
      ],
    },
  ],

  education: {
    degree: "B.Sc. Physics",
    institution: "University of Cape Coast, Ghana",
    year: 2015,
  },

  skills: {
    backend: ["PHP", "Node.js", "TypeScript", "JavaScript", "Kotlin", "Java", "SQL", "Bash"],
    frameworks: ["Symfony", "Laravel", "Spring Boot", "Next.js", "React"],
    databases: ["PostgreSQL", "MySQL", "Convex"],
    cloud: ["Docker", "AWS", "Linux", "Nginx", "CI/CD"],
    testing: ["Cypress", "Playwright", "Vitest", "PHPUnit", "JUnit", "Stryker"],
  },

  stats: {
    yearsExperience: "4+",
    countriesWorked: 2,
  },
} as const;
```

**Step 2: Create the projects data file**

```typescript
// src/data/projects.ts
export const projects = [
  {
    slug: "ewc-care-app",
    name: "EWC Care App",
    subtitle: "Full-Stack Pastoral Care Management PWA",
    description: "A comprehensive pastoral care management system for Empowerment Worship Centre. Built for Community Pastors and Circle Guides to manage church members, track pastoral care activities, monitor attendance, handle case management, and support spiritual growth initiatives.",
    longDescription: "Production PWA serving 5+ communities with real-time data synchronization, role-based access control, and AI-powered insights. Manages member data, care interactions, attendance tracking, case management, and spiritual growth initiatives.",
    liveUrl: null, // requires auth
    githubUrl: "https://github.com/nana-yaw",
    featured: true,

    stats: {
      databaseTables: "30+",
      tests: "280+",
      rbacTiers: 5,
      dataSync: "Real-time",
    },

    techStack: [
      "Next.js 16", "React 19", "TypeScript 5", "Convex", "Tailwind CSS 4",
      "Radix UI", "Google Gemini AI", "Web Push", "Vitest", "Playwright",
    ],

    features: [
      {
        name: "GPS Geofenced Check-In",
        description: "Haversine distance calculation with spoofing detection. Members check in within verified venue boundaries. QR code self-check-in and manual search.",
        category: "attendance",
      },
      {
        name: "AI-Powered Insights",
        description: "Gemini-powered pastoral analytics generating actionable care recommendations from interaction patterns.",
        category: "ai",
      },
      {
        name: "Enterprise Audit Logging",
        description: "Immutable audit log with SHA-256 integrity chain. 7-year retention. Compliance-ready.",
        category: "security",
      },
      {
        name: "QR Code Attendance",
        description: "Dynamic QR token generation with expiration. Self-service check-in for members via any device.",
        category: "attendance",
      },
      {
        name: "Push Notifications",
        description: "VAPID web push with in-app notification center. Birthday alerts, care reminders, follow-up scheduling.",
        category: "engagement",
      },
      {
        name: "Offline PWA",
        description: "Service worker caching, install prompt, offline-first architecture. Responsive with dark/light theme support.",
        category: "pwa",
      },
      {
        name: "5-Tier RBAC",
        description: "Hybrid RBAC+ABAC permission system. Super admin, pastor, circle guide, staff, viewer. PII field filtering by role.",
        category: "security",
      },
      {
        name: "Case Management",
        description: "Pastoral care cases with priority, status workflow, assignee tracking, activity timelines, and internal notes.",
        category: "care",
      },
    ],

    screenshots: [
      { src: "/screenshots/dashboard.png", alt: "Dashboard with shepherd queue and care stats", device: "desktop" },
      { src: "/screenshots/checkin.png", alt: "Check-in station with live attendance", device: "desktop" },
      { src: "/screenshots/members.png", alt: "Member management with search and filters", device: "desktop" },
      { src: "/screenshots/mobile-dashboard.png", alt: "Mobile dashboard view", device: "mobile" },
      { src: "/screenshots/case-detail.png", alt: "Case detail with activity timeline", device: "desktop" },
      { src: "/screenshots/attendance-analytics.png", alt: "Attendance trends and analytics", device: "desktop" },
    ],

    architecture: {
      layers: [
        { name: "Client", tech: "Next.js 16 + React 19", details: "App Router, RSC, PWA with service worker" },
        { name: "Real-time", tech: "Convex", details: "Subscriptions, optimistic updates, serverless functions" },
        { name: "Auth & Security", tech: "Convex Auth + RBAC", details: "Magic link, 5-tier roles, PII projection, rate limiting" },
        { name: "Data", tech: "Convex DB", details: "30+ tables, denormalized counters, soft delete, integrity chain" },
      ],
    },

    testing: {
      unit: "Vitest - 280+ tests covering components, security, phone utils, geolocation",
      e2e: "Python Playwright - check-in flows, scheduling, QR display, visitor tracking",
      mutation: "Stryker - security-focused mutation testing for critical logic",
      security: "Dedicated suite: RBAC enforcement, PII projection, rate limiting, auth guards, XSS prevention",
    },
  },
] as const;
```

**Step 3: Create navigation data**

```typescript
// src/data/navigation.ts
export const navItems = [
  { label: "About", href: "#about" },
  { label: "Project", href: "#project" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;
```

**Step 4: Commit**

```bash
git add src/data/
git commit -m "feat: add profile, projects, and navigation data layer"
```

---

## Task 3: Theme System - Context, Hook & Definitions

**Files:**
- Create: `src/lib/themes.ts`
- Create: `src/hooks/useTheme.ts`
- Create: `src/components/ThemeProvider.tsx`

**Step 1: Create theme definitions**

```typescript
// src/lib/themes.ts
export type ThemeId = "cinematic" | "minimal" | "bold" | "terminal";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  preview: string; // CSS gradient for the mini preview
  font: {
    heading: string;
    body: string;
    mono?: string;
  };
}

export const themes: Record<ThemeId, ThemeDefinition> = {
  cinematic: {
    id: "cinematic",
    name: "Dark & Cinematic",
    description: "Dramatic lighting, smooth animations, Apple-inspired polish",
    preview: "linear-gradient(135deg, #050505 0%, #1a1a2e 50%, #4f7df5 100%)",
    font: { heading: "Inter", body: "Inter" },
  },
  minimal: {
    id: "minimal",
    name: "Clean & Minimal",
    description: "Elegant typography, generous whitespace, timeless sophistication",
    preview: "linear-gradient(135deg, #fafaf9 0%, #e8e8e4 50%, #1a1a2e 100%)",
    font: { heading: "Playfair Display", body: "Inter" },
  },
  bold: {
    id: "bold",
    name: "Bold & Creative",
    description: "Asymmetric layouts, custom cursor, award-winning energy",
    preview: "linear-gradient(135deg, #0a0a0a 0%, #7c3aed 50%, #ff6b6b 100%)",
    font: { heading: "Space Grotesk", body: "Space Grotesk" },
  },
  terminal: {
    id: "terminal",
    name: "Interactive Terminal",
    description: "CLI-inspired, typing animations, engineer's showcase",
    preview: "linear-gradient(135deg, #0a0e17 0%, #1a2332 50%, #4ade80 100%)",
    font: { heading: "Inter", body: "Inter", mono: "Fira Code" },
  },
};

export const themeOrder: ThemeId[] = ["cinematic", "minimal", "bold", "terminal"];
export const defaultTheme: ThemeId = "cinematic";
```

**Step 2: Create the theme hook**

```typescript
// src/hooks/useTheme.ts
"use client";

import { createContext, useContext } from "react";
import type { ThemeId } from "@/lib/themes";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  hasChosen: boolean;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
```

**Step 3: Create the ThemeProvider component**

```typescript
// src/components/ThemeProvider.tsx
"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { ThemeContext } from "@/hooks/useTheme";
import { defaultTheme, type ThemeId } from "@/lib/themes";

const STORAGE_KEY = "portfolio-theme";
const CHOSEN_KEY = "portfolio-theme-chosen";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(defaultTheme);
  const [hasChosen, setHasChosen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    const chosen = localStorage.getItem(CHOSEN_KEY) === "true";
    if (saved) setThemeState(saved);
    if (chosen) setHasChosen(true);
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: ThemeId) => {
    setThemeState(newTheme);
    setHasChosen(true);
    localStorage.setItem(STORAGE_KEY, newTheme);
    localStorage.setItem(CHOSEN_KEY, "true");
    document.documentElement.setAttribute("data-theme", newTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (!mounted) return null;

  return (
    <ThemeContext value={{ theme, setTheme, hasChosen }}>
      {children}
    </ThemeContext>
  );
}
```

**Step 4: Commit**

```bash
git add src/lib/themes.ts src/hooks/useTheme.ts src/components/ThemeProvider.tsx
git commit -m "feat: add theme system with context, hook, and provider"
```

---

## Task 4: Root Layout & Global Styles

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Step 1: Update the root layout**

Set up ThemeProvider, fonts, and metadata in `src/app/layout.tsx`. Import all 4 Google Fonts (Inter, Playfair Display, Space Grotesk, Fira Code). Wrap children in ThemeProvider.

**Step 2: Set up global CSS**

Define CSS custom properties per theme using `[data-theme="cinematic"]`, `[data-theme="minimal"]`, etc. Include base resets, smooth scroll, and `prefers-reduced-motion` handling. Each theme selector sets `--bg`, `--text`, `--accent`, `--font-heading`, `--font-body`, etc.

**Step 3: Verify dev server starts**

```bash
npm run dev
```

Visit `http://localhost:3000` — should show blank page with no errors.

**Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: configure root layout with theme provider and global styles"
```

---

## Task 5: Theme Chooser Landing Page

**Files:**
- Create: `src/components/ThemeChooser.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Build the ThemeChooser component**

A full-viewport page with a centered grid of 4 theme cards. Each card shows:
- Theme gradient preview
- Theme name and description
- Click sets theme and navigates to `/portfolio`
- Subtle hover animations via Framer Motion

If the user has already chosen a theme (localStorage), redirect them directly to `/portfolio`.

**Step 2: Wire up the landing page**

Update `src/app/page.tsx` to render ThemeChooser.

**Step 3: Verify in browser**

Visit `http://localhost:3000` — see 4 theme cards. Clicking one should save to localStorage.

**Step 4: Commit**

```bash
git add src/components/ThemeChooser.tsx src/app/page.tsx
git commit -m "feat: add theme chooser landing page with 4 theme cards"
```

---

## Task 6: Portfolio Page Shell & Theme Router

**Files:**
- Create: `src/app/portfolio/page.tsx`
- Create: `src/components/sections/Hero.tsx`
- Create: `src/components/sections/About.tsx`
- Create: `src/components/sections/Project.tsx`
- Create: `src/components/sections/Experience.tsx`
- Create: `src/components/sections/Skills.tsx`
- Create: `src/components/sections/Contact.tsx`
- Create: `src/components/ThemeSwitcher.tsx`

**Step 1: Create theme-aware section router components**

Each section component reads the current theme from context and renders the corresponding theme variant. Initially, render placeholder `<div>` stubs per theme that say "Cinematic Hero", "Minimal Hero", etc.

**Step 2: Create the portfolio page**

`src/app/portfolio/page.tsx` — renders all sections in order with the ThemeSwitcher floating in the bottom-right corner.

**Step 3: Build the ThemeSwitcher**

Floating pill in bottom-right. Shows 4 colored dots. Click opens a mini panel with theme names. Framer Motion AnimatePresence for expand/collapse.

**Step 4: Verify**

Visit `http://localhost:3000`, pick a theme, see placeholder sections. Click the floating switcher, change themes — placeholders update.

**Step 5: Commit**

```bash
git add src/app/portfolio/ src/components/sections/ src/components/ThemeSwitcher.tsx
git commit -m "feat: add portfolio page shell with theme router and floating switcher"
```

---

## Task 7: Cinematic Theme - All Sections

**Files:**
- Create: `src/components/themes/cinematic/CinematicHero.tsx`
- Create: `src/components/themes/cinematic/CinematicAbout.tsx`
- Create: `src/components/themes/cinematic/CinematicProject.tsx`
- Create: `src/components/themes/cinematic/CinematicExperience.tsx`
- Create: `src/components/themes/cinematic/CinematicSkills.tsx`
- Create: `src/components/themes/cinematic/CinematicContact.tsx`
- Create: `src/components/themes/cinematic/index.ts`
- Create: `src/styles/cinematic.module.css`

Port the prototype from `/tmp/portfolio-prototypes/1-dark-cinematic.html` into React components. Reference that file for exact styles, animations, and structure. Key elements:

- Gradient mesh orbs with CSS @keyframes
- Mouse-follow parallax glow (useEffect + mousemove listener)
- Floating CSS particles in hero
- Frosted-glass sticky navbar
- Intersection Observer scroll reveals (Framer Motion `whileInView`)
- Film grain noise overlay
- All data from `src/data/profile.ts` and `src/data/projects.ts`

**Commit after each section pair (hero+about, project, experience+skills, contact).**

---

## Task 8: Minimal Theme - All Sections

**Files:**
- Create: `src/components/themes/minimal/MinimalHero.tsx`
- Create: `src/components/themes/minimal/MinimalAbout.tsx`
- Create: `src/components/themes/minimal/MinimalProject.tsx`
- Create: `src/components/themes/minimal/MinimalExperience.tsx`
- Create: `src/components/themes/minimal/MinimalSkills.tsx`
- Create: `src/components/themes/minimal/MinimalContact.tsx`
- Create: `src/components/themes/minimal/index.ts`
- Create: `src/styles/minimal.module.css`

Port from `/tmp/portfolio-prototypes/2-clean-minimal.html`. Key elements:

- Playfair Display serif headings + Inter body
- Off-white background, deep navy text
- Generous whitespace (140px section gaps desktop)
- Thin horizontal rule dividers
- Subtle fade-in-from-below reveals
- Content max-width 720px
- Two-column experience layout

**Commit after each section pair.**

---

## Task 9: Bold Theme - All Sections

**Files:**
- Create: `src/components/themes/bold/BoldHero.tsx`
- Create: `src/components/themes/bold/BoldAbout.tsx`
- Create: `src/components/themes/bold/BoldProject.tsx`
- Create: `src/components/themes/bold/BoldExperience.tsx`
- Create: `src/components/themes/bold/BoldSkills.tsx`
- Create: `src/components/themes/bold/BoldContact.tsx`
- Create: `src/components/themes/bold/index.ts`
- Create: `src/styles/bold.module.css`

Port from `/tmp/portfolio-prototypes/3-bold-creative.html`. Key elements:

- Custom cursor (dot + ring with mix-blend-mode)
- Asymmetric hero layout with staggered typography
- Gradient orb animation (3 blurred circles)
- Typed text cycling effect
- Numbered sections (01-06) as background text with parallax
- Counter animation on scroll for stats
- Marquee tech ticker
- Feature mosaic with wide/tall cards

**Commit after each section pair.**

---

## Task 10: Terminal Theme - All Sections

**Files:**
- Create: `src/components/themes/terminal/TerminalHero.tsx`
- Create: `src/components/themes/terminal/TerminalAbout.tsx`
- Create: `src/components/themes/terminal/TerminalProject.tsx`
- Create: `src/components/themes/terminal/TerminalExperience.tsx`
- Create: `src/components/themes/terminal/TerminalSkills.tsx`
- Create: `src/components/themes/terminal/TerminalContact.tsx`
- Create: `src/components/themes/terminal/index.ts`
- Create: `src/styles/terminal.module.css`

Port from `/tmp/portfolio-prototypes/4-interactive-terminal.html`. Key elements:

- Terminal windows with traffic light dots
- Typing animation (per-character with random delays)
- 5-tab project explorer (package.json, features, architecture, security, testing)
- Git log styled experience with commit hashes
- skills.json dependency tree
- `$ connect --with edward` contact section
- Fira Code for terminal elements + Inter for body
- Auto-hiding navbar, scanline effect

**Commit after each section pair.**

---

## Task 11: 3D Avatar Component (Spline)

**Files:**
- Create: `src/components/Avatar3D.tsx`

**Step 1: Create Spline scene placeholder**

Build the Avatar3D component with Spline React embed. Initially use a placeholder Spline scene URL (the user will create their custom avatar scene in Spline later and swap the URL).

The component accepts a `theme` prop and adjusts:
- Cinematic: dramatic rim lighting
- Minimal: soft neutral daylight
- Bold: color-cycling gradient
- Terminal: green wireframe

**Step 2: Integrate into each theme's Hero component**

Add Avatar3D to each theme's hero section.

**Step 3: Commit**

```bash
git add src/components/Avatar3D.tsx
git commit -m "feat: add Spline 3D avatar component with theme-adaptive lighting"
```

---

## Task 12: Project Screenshots & Device Mockups

**Files:**
- Create: `src/components/DeviceMockup.tsx`
- Create: `src/components/ProjectScreenshots.tsx`

**Step 1: Build DeviceMockup component**

A wrapper that renders an image inside a laptop or phone frame (pure CSS border-radius + shadows). Props: `device: "desktop" | "mobile"`, `src`, `alt`.

**Step 2: Build ProjectScreenshots component**

Renders the project screenshots from data in a theme-aware layout:
- Cinematic: floating carousel with perspective
- Minimal: clean grid with subtle shadows
- Bold: tilted/overlapping with parallax
- Terminal: terminal-framed `cat screenshot.png`

**Step 3: Capture actual screenshots**

Take screenshots of the running EWC Care App and place in `public/screenshots/`. Key screens: dashboard, check-in station, member management, case detail, attendance analytics, mobile view.

**Step 4: Commit**

```bash
git add src/components/DeviceMockup.tsx src/components/ProjectScreenshots.tsx public/screenshots/
git commit -m "feat: add project screenshots with device mockups"
```

---

## Task 13: Theme Transition Animations

**Files:**
- Modify: `src/components/sections/*.tsx`
- Modify: `src/components/ThemeSwitcher.tsx`

**Step 1: Add AnimatePresence to section routers**

Wrap theme-variant rendering in Framer Motion `AnimatePresence` with `mode="wait"`. Add `initial`, `animate`, and `exit` props for smooth crossfade when switching themes.

**Step 2: Enhance ThemeSwitcher transitions**

Animate the panel open/close. Add subtle background blur when panel is open.

**Step 3: Verify smooth theme switching**

Switch between all 4 themes rapidly. No flash, no layout shift.

**Step 4: Commit**

```bash
git add src/components/
git commit -m "feat: add smooth theme transition animations"
```

---

## Task 14: Responsive Design & Accessibility

**Files:**
- Modify: all theme component files
- Modify: all CSS module files

**Step 1: Mobile responsive pass**

Test all 4 themes at 375px (phone), 768px (tablet), 1024px (laptop), 1440px (desktop). Fix any layout breaks. Each theme should have:
- Mobile: single column, hamburger nav or simplified nav
- Tablet: two-column where appropriate
- Desktop: full layouts as per prototypes

**Step 2: Accessibility pass**

- Add `prefers-reduced-motion` media query to disable all animations
- Ensure WCAG 2.1 AA contrast on all themes
- Add aria-labels to icon buttons, navigation landmarks
- Focus visible styles on all interactive elements
- Skip-to-content link
- Proper heading hierarchy (h1 once per page, h2 for sections)

**Step 3: Keyboard navigation test**

Tab through the entire page on each theme. Ensure all interactive elements are reachable and operable.

**Step 4: Commit**

```bash
git add .
git commit -m "fix: responsive design and accessibility improvements across all themes"
```

---

## Task 15: SEO, Metadata & Open Graph

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/opengraph-image.tsx` (or static image)
- Create: `public/favicon.ico`

**Step 1: Add comprehensive metadata**

Title, description, Open Graph tags, Twitter cards. Dynamic per-theme og:image would be ideal but a single strong preview image works for v1.

**Step 2: Add favicon and touch icons**

**Step 3: Commit**

```bash
git add src/app/ public/
git commit -m "feat: add SEO metadata, Open Graph, and favicons"
```

---

## Task 16: Vercel Deployment

**Step 1: Create GitHub repo**

```bash
cd /Users/edwardosei-nyarko/Projects/edwardosei.dev
gh repo create edwardosei.dev --public --source=. --push
```

**Step 2: Deploy to Vercel**

```bash
npx vercel --prod
```

Or connect the GitHub repo to Vercel dashboard for automatic deployments.

**Step 3: Configure custom domain (when ready)**

Point `edwardosei.dev` (or similar) to Vercel.

**Step 4: Verify production build**

```bash
npm run build
```

Ensure no build errors, all pages render, theme switching works.

**Step 5: Commit any deployment config**

```bash
git add .
git commit -m "chore: configure Vercel deployment"
```

---

## Summary

| Task | Description | Est. Complexity |
|------|-------------|----------------|
| 1 | Scaffold Next.js project | Low |
| 2 | Data layer (profile, projects) | Low |
| 3 | Theme system (context, hook, provider) | Medium |
| 4 | Root layout & global styles | Low |
| 5 | Theme chooser landing page | Medium |
| 6 | Portfolio page shell & theme router | Medium |
| 7 | Cinematic theme - all sections | High |
| 8 | Minimal theme - all sections | High |
| 9 | Bold theme - all sections | High |
| 10 | Terminal theme - all sections | High |
| 11 | 3D avatar (Spline) | Medium |
| 12 | Screenshots & device mockups | Medium |
| 13 | Theme transition animations | Medium |
| 14 | Responsive & accessibility | Medium |
| 15 | SEO & metadata | Low |
| 16 | Vercel deployment | Low |
