# Portfolio Web App - Design Document

## Overview

A standalone Next.js portfolio app for Edward Osei-Nyarko featuring **4 switchable visual themes** (Dark Cinematic, Clean Minimal, Bold Creative, Interactive Terminal). The multi-theme system itself serves as a technical showcase. Targets both recruiters and engineering peers.

## Decisions

- **Standalone repo** — separate from EWC, independent deployment on Vercel
- **Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4**
- **Approach A: Theme-variant components** — each theme gets its own component set, shared data layer
- **Spline 3D avatar** — interactive, theme-adaptive lighting
- **EWC Care App showcase** — curated screenshots + video walkthrough (app requires auth)
- **Landing page theme chooser + floating persistent switcher**
- **Audience**: recruiters and engineering peers equally (progressive disclosure)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 + CSS Modules per theme |
| Animation | Framer Motion |
| 3D Avatar | @splinetool/react-spline |
| Fonts | Inter, Playfair Display, Space Grotesk, Fira Code (self-hosted) |
| Deployment | Vercel |

## Themes

### 1. Dark & Cinematic
- Background: #050505 to #0a0a0f
- Accents: blue (#4f7df5), purple (#8b5cf6), cyan (#22d3ee)
- Font: Inter
- Animations: gradient mesh orbs, floating particles, mouse-follow glow, frosted-glass nav
- Avatar lighting: dramatic rim light, blue/purple ambient

### 2. Clean & Minimal
- Background: off-white (#fafaf9)
- Accents: deep navy/charcoal (#1a1a2e)
- Fonts: Playfair Display (headings) + Inter (body)
- Animations: subtle fade-in reveals
- Avatar lighting: soft, flat, neutral daylight

### 3. Bold & Creative
- Background: near-black (#0a0a0a)
- Accents: deep purple (#7c3aed), electric blue (#3b82f6), hot coral (#ff6b6b), yellow (#fbbf24)
- Font: Space Grotesk
- Animations: custom cursor, typed text, counter animation, marquee ticker, parallax
- Avatar lighting: color-cycling gradient

### 4. Interactive & Terminal
- Background: #0a0e17
- Accents: green (#4ade80), amber (#f59e0b), cyan (#22d3ee)
- Fonts: Fira Code (terminal) + Inter (body)
- Animations: typing effect, tab switching, git-log reveals, scanline effect
- Avatar lighting: green wireframe/phosphor glow

## Page Flow

1. **First visit** (`/`) — Theme chooser landing page. 4 cards with live mini-previews. Pick one.
2. **Portfolio** — Full portfolio renders in chosen theme. Floating theme switcher (bottom-right pill) always accessible.
3. **Returning visitors** — Skip landing, load last-chosen theme from localStorage.
4. **Theme transitions** — Framer Motion AnimatePresence for smooth crossfade.

## Sections

### Hero
- Name, title, tagline, availability badge, CTAs
- 3D Spline avatar embedded with theme-adaptive lighting
- Each theme renders completely different layout and animations

### About
- Physics background, 4+ years, remote with US teams
- Stats: years, tables, tests, countries

### Featured Project: EWC Care App
- Description, key stats (30+ tables, 280+ tests, 5-tier RBAC, real-time sync)
- Tech stack badges
- Feature highlights (GPS geofence, AI insights, audit logging, QR attendance, push notifications, offline PWA)
- Curated screenshots in device mockup frames (laptop + phone)
- Video walkthrough embed (screen recording)
- Architecture diagram

### Experience
- RentPost (Jul 2023 - Present, Remote US)
- Turntabl Ghana (2021 - 2023, Accra)
- Key achievements per role

### Skills
- Backend: PHP, Node.js, TypeScript, JavaScript, Kotlin, Java, SQL, Bash
- Frameworks: Symfony, Laravel, Spring Boot, Next.js, React
- Databases: PostgreSQL, MySQL, Convex
- Cloud & DevOps: Docker, AWS, Linux, Nginx, CI/CD
- Testing: Cypress, Playwright, Vitest, PHPUnit, JUnit, Stryker

### Testimonials (future)
- Quotes from colleagues/managers
- Placeholder section initially

### Blog (future)
- MDX-powered technical articles
- Placeholder section initially

### Contact
- Email, GitHub, LinkedIn
- Each theme renders differently

## Project Structure

```
portfolio/
  src/
    app/
      page.tsx                    # Theme chooser landing
      portfolio/page.tsx          # Main portfolio (reads theme)
      blog/                       # Future blog section
      layout.tsx                  # Providers, theme context
    components/
      themes/
        cinematic/                # Cinematic section variants
        minimal/                  # Minimal section variants
        bold/                     # Bold section variants
        terminal/                 # Terminal section variants
      sections/
        Hero.tsx                  # Theme-aware router
        About.tsx
        Project.tsx
        Experience.tsx
        Skills.tsx
        Testimonials.tsx
        Contact.tsx
      ThemeChooser.tsx            # Landing page selector
      ThemeSwitcher.tsx           # Floating persistent switcher
      Avatar3D.tsx                # Spline embed
      ProjectScreenshots.tsx      # Screenshot carousel/grid
      DeviceMockup.tsx            # Device frame wrapper
    data/
      profile.ts                  # Personal/professional data
      projects.ts                 # Project details, screenshots
    hooks/
      useTheme.ts                 # Theme context + localStorage
    lib/
      themes.ts                   # Theme definitions, metadata
    styles/
      globals.css                 # Shared base + CSS variables
      cinematic.module.css
      minimal.module.css
      bold.module.css
      terminal.module.css
  public/
    screenshots/                  # EWC Care App screenshots
    avatar/                       # Fallback avatar images
    fonts/                        # Self-hosted fonts
```

## Accessibility

- WCAG 2.1 AA contrast on all themes
- prefers-reduced-motion disables all animations
- Keyboard navigation, focus visible, skip links
- Semantic HTML, proper heading hierarchy, aria-labels
- Same content structure regardless of visual theme

## Out of Scope (v1)

- Blog CMS (placeholder section only)
- Testimonials content (placeholder section only)
- Analytics dashboard
- Contact form backend
- i18n / multi-language
