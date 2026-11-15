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
npm run test:e2e     # Playwright against a dev build, in the installed Chrome (PW_PORT reuses a running server)
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

## Single-Design Rebuild (feat/3d-portfolio-rebuild, Nov 2026)
Supersedes the 4-theme system and story mode described above. One design, one typeface (Archivo, variable weight and width), no mono font, colours only as CSS variables on `:root`. `/portfolio/print` and the `@media print` block stay as they are. The resume PDF is a one-page, ATS-friendly resume built from `scripts/resume.md` with `npm run resume`. The reader is a business owner who needs a product built (Edward, 14 Nov 2026): plain words, outcomes first, and nothing about how a client's product is protected or put together inside. NAAT is not shown. The home page has two doors: "Hire me for a project" and "Open to remote roles", which opens `/hiring` (general engineering practice only). Adinkra symbols and kente strips sit behind one switch, `showAdinkra` in `src/data/culture.ts` (on unless `NEXT_PUBLIC_SHOW_ADINKRA=false`); Edward chose on 15 Nov 2026 to launch with it on, before hearing from the National Folklore Board. Name no payment provider anywhere. Hallmark's audit is the slop gate: no tracked-caps labels or eyebrows, no middle-dot meta strings, `overflow-x: clip` (never `hidden`) on html and body, instant `:focus-visible`, about 80 words per screen.

## 3D Checklist (every WebGL change must pass this)
- **Pins (exact, no carets):** three 0.187.0, @react-three/fiber 9.8.2 (React 19, peer `>=19 <19.4`), @types/three 0.187.0, gsap 3.15.1, @gsap/react 2.1.2, lenis 1.3.27, @playwright/test 1.64.1. drei only if a helper earns its place, pinned when added. Do not mix R3F 8 or drei 9 APIs.
- **Next config:** `transpilePackages: ['three']`. The canvas is a client component loaded with `dynamic(..., { ssr: false })`.
- **Budget:** under 100 draw calls and 100k vertices on any device. The hero target is under 60 calls and 25k vertices (raised from 30 and 5k by Edward, 14 Nov 2026, for the clay hero). Three lights at most, textures 2048px or less.
- **Shadows:** one shadow-casting light with soft shadows is allowed where the canvas runs, which is tablet and desktop only (allowed by Edward, 14 Nov 2026; before that the rule was no shadows). Shadow map 2048px or less, updated only on frames that render. Phones never run the canvas, so they are unaffected.
- **DPR capped at 2:** `dpr={[1, 2]}`.
- **Disposal:** dispose every geometry and material created outside JSX on unmount. No allocation inside `useFrame`.
- **Static scene:** `frameloop="demand"`; call `invalidate()` only when scroll progress or pointer tilt changes.
- **Reduced motion:** no Lenis, no ScrollTrigger scrub, no canvas; everything renders in its final state.
- **Zero JS:** all content is server-rendered HTML. Animation and WebGL are enhancements only.
- **Static fallback:** a baked still of the hero (`src/components/hero/hero-still.webp`) is the server-rendered default image; the canvas mounts over it only when WebGL2 is available without a major performance caveat, the viewport is at least 48rem wide and motion is allowed, and falls back to the still if the context is lost. Phones keep the still and never download three. Re-bake the still whenever the hero scene or the palette changes.
- **Measured, not assumed:** dev builds publish `renderer.info` to `window.__r3f`; a Playwright test asserts the budget, a non-blank canvas, the zero-JS content and the reduced-motion branch at 360, 768 and 1440 px.
