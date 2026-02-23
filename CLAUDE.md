# Portfolio Web App - edwardosei.dev

## Project Overview
A standalone Next.js portfolio for Edward Osei-Nyarko featuring **4 switchable visual themes** (Dark Cinematic, Clean Minimal, Bold Creative, Interactive Terminal). The multi-theme system itself serves as a technical showcase. Targets both recruiters and engineering peers.

## CRITICAL: Read the Anti-Slop Direction First
**Before implementing anything**, read `docs/plans/2026-02-23-anti-slop-design-direction.md`. It overrides generic design choices in the prototypes and original design doc with intentional, personal, non-AI-sloppy direction.

## Documents (read in this order)
1. `docs/plans/2026-02-23-anti-slop-design-direction.md` — **READ FIRST.** Design principles, kill list, Edward's real story, per-theme redesign, D.O-N.E brand identity.
2. `docs/ewc-architecture-portfolio.md` — **Sanitized architecture reference for public use.** 42 tables, 92 indexes, 6-role RBAC, security layers, test suite breakdown. Use this for all project showcase content (terminal tabs, architecture diagrams, code references). The unsanitized `docs/ewc-architecture.md` has internal details (rate limit thresholds, session durations, spoofing detection specifics) — NEVER expose those in the portfolio.
3. `docs/plans/2026-02-23-portfolio-implementation.md` — Task-by-task implementation plan.
4. `docs/plans/2026-02-23-portfolio-design.md` — Original design doc (use for architecture/tech stack, but anti-slop doc overrides visual/copy decisions).

## Reference Prototypes
4 HTML prototypes in `reference-prototypes/`. Use for **layout and interaction patterns ONLY**. Do NOT copy their decorative effects (gradient orbs, particles, glassmorphism, etc.) — see anti-slop doc for what to keep vs kill.
- `1-dark-cinematic.html` — Use: layout structure, section order, card designs
- `2-clean-minimal.html` — Use: typography pairing, whitespace ratios, content layout
- `3-bold-creative.html` — Use: asymmetric grid, numbered sections, feature mosaic
- `4-interactive-terminal.html` — Use: 5-tab explorer, git log, terminal chrome, typing interaction

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 + CSS Modules per theme
- **Animation**: Framer Motion
- **Fonts**: Inter, Playfair Display, Space Grotesk, Fira Code
- **Deployment**: Vercel
- **NO Spline 3D avatar** — use real photo with per-theme treatment instead (see anti-slop doc)

## Architecture
**Theme-variant components (Approach A)**: Each theme gets its own component set for full creative freedom. A shared data layer feeds all themes. Theme context drives which variant renders.

```
src/
  components/
    themes/
      cinematic/   -> CinematicHero, CinematicProject, etc.
      minimal/     -> MinimalHero, MinimalProject, etc.
      bold/        -> BoldHero, BoldProject, etc.
      terminal/    -> TerminalHero, TerminalProject, etc.
    sections/
      Hero.tsx     -> reads theme context, renders correct variant
      Project.tsx  -> same pattern
  data/
    profile.ts     -> all personal/professional content
    projects.ts    -> project details, screenshots, tech stack
  hooks/
    useTheme.ts    -> theme context + localStorage persistence
  lib/
    themes.ts      -> theme definitions, metadata, colors
```

## Key Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint check
```

## Key Conventions
- **Anti-slop first**: Every visual element must earn its place. If it doesn't communicate something, remove it.
- **Security-first identity**: Edward's security instinct is a portfolio differentiator. Show the 6-layer defense, 24 security test files, mutation testing, SHA-256 audit chain prominently — not as a footnote. See the "Security-First Engineering Identity" section in the anti-slop doc.
- Use prototypes for LAYOUT PATTERNS only — replace all decorative effects and generic copy per anti-slop doc
- Each theme is visually independent — don't compromise one theme's design for consistency
- All data comes from `src/data/` — never hardcode content in components
- Use Edward's real voice for all copy (see anti-slop doc for his story and approved taglines)
- Section order: Hero → Featured Project → Origin Story → Experience → Skills → Contact (project BEFORE about)
- Framer Motion for purposeful animations only (not decorative) — raw CSS @keyframes OK for simple transitions
- `prefers-reduced-motion` must disable all animations
- WCAG 2.1 AA contrast on all themes
- Responsive: mobile-first, test at 375px / 768px / 1024px / 1440px
- Real photo of Edward (or initials "EO" placeholder), NOT 3D avatar
