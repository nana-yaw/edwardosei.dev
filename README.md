# devONE

Personal portfolio for Edward Osei-Nyarko. One design in one typeface, written for business owners who need a product built. The hero is a clay house built around an idea, in 3D; below it are the products, the six parts of a build, a simulation to try to break, and case studies of Si Hene and the EWC Care App.

**Live:** [edwardoseidev.vercel.app](https://edwardoseidev.vercel.app)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, TypeScript 5
- **Styling:** Tailwind CSS 4, colours as CSS variables on `:root`
- **Type:** Archivo (variable weight and width)
- **3D:** three.js with React Three Fiber
- **Motion:** GSAP ScrollTrigger and Lenis
- **Deployment:** Vercel

## Architecture

Pages are server components, so all content is in the HTML before any script runs. The hero is a baked still in the HTML; a WebGL canvas mounts over it only on screens at least 48rem wide with WebGL2 and motion allowed, so phones never download three. All copy lives in `src/data/`.

Adinkra symbols and kente strips are on unless the build sets `NEXT_PUBLIC_SHOW_ADINKRA=false` (see `src/data/culture.ts`).

```
src/
  app/
    portfolio/        # The home page, plus /portfolio/print
    work/[slug]/      # Case studies (Si Hene, EWC Care App)
    hiring/           # The page for hiring managers
  components/
    sections/         # Hero, Work, BuildFlow, Approach, Story, Experience, Services, Consultation, Contact
    hero/             # The 3D hero: scene, clay preset, baked still, canvas layer
    breakit/          # "Try to break it": the simulated attacks and the layer stack
    pipe/             # The amber pipe down the page and its scroll scrub
    kente/, adinkra/  # The strips and symbols behind the switch
    motion/           # Scroll motion for the hiring and case study pages
    site/             # Header, footer, scroll button
    work/             # Case study layout and screenshot pair
  data/               # All content (profile, projects, page copy, hero, services, navigation)
  lib/                # Pipe, flow and break-it geometry and state
```

The 3D rules (pins, budgets, fallbacks) are in `CLAUDE.md` under "3D Checklist".

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
npm run test:e2e # Playwright: 3D budget, zero-JS, reduced motion, overflow, header, switch
npm run resume   # Rebuild public/Edward_Osei-Nyarko_Resume.pdf from scripts/resume.md
```

## License

All rights reserved.
