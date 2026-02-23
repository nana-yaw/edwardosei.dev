# devONE

Personal portfolio for Edward Osei-Nyarko featuring 4 switchable visual themes. The multi-theme system itself serves as a technical showcase.

**Live:** [edwardoseidev.vercel.app](https://edwardoseidev.vercel.app)

## Themes

| Theme | Style | Fonts |
|-------|-------|-------|
| **Editorial** | Clean & minimal | Playfair Display + Inter |
| **Showcase** | Dark & cinematic | Inter |
| **Statement** | Bold & creative | Space Grotesk |
| **Engineer** | Interactive terminal | Inter + Fira Code |

Visitors can switch themes via the carousel widget, keyboard arrow keys, or mobile swipe gestures. Theme choice persists in localStorage.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, TypeScript 5
- **Styling:** Tailwind CSS 4 + CSS custom properties per theme
- **Animation:** Framer Motion
- **Deployment:** Vercel

## Architecture

Each theme has its own component set for full creative freedom. A shared data layer (`src/data/`) feeds all themes, and theme context drives which variant renders.

```
src/
  components/
    themes/
      cinematic/   # CinematicHero, CinematicNav, etc.
      minimal/     # MinimalHero, MinimalNav, etc.
      bold/        # BoldHero, BoldNav, etc.
      terminal/    # TerminalHero, TerminalNav, etc.
    sections/      # Theme-aware wrappers (Hero, Nav, etc.)
  data/            # All content (profile, projects, navigation)
  hooks/           # useTheme context + localStorage persistence
  lib/             # Theme definitions, metadata
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## License

All rights reserved.
