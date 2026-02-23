# Anti-Slop Design Direction

> This document overrides the generic design choices in the original design doc and prototypes. Read this FIRST before implementing any theme.

## Brand Identity: D.O-N.E

**Developer Osei-Nyarko Edward = D.O-N.E**

This is the site's logo/wordmark. It's personal, memorable, and carries meaning — Edward ships things, he gets them *done*. Use this as the primary brand element across all themes.

### Logo Treatment Per Theme

**Cinematic ("Showcase")**:
- Nav logo: `D.O-N.E` in clean Inter weight 300, letter-spaced. The periods and hyphen are the design — let the punctuation breathe.
- Footer: Full expansion "Developer Osei-Nyarko Edward" in small caps below the mark.

**Minimal ("Editorial")**:
- Nav logo: `D.O-N.E` in Playfair Display italic. Elegant, like a magazine masthead.
- Could also be rendered as a simple monogram lockup: the letters D O N E stacked or arranged in a 2x2 grid with thin rules between them.

**Bold ("Statement")**:
- Nav logo: `D.O-N.E` in Space Grotesk bold, oversized. Maybe the periods are accent-colored (coral or electric blue).
- Hero potential: Use as a massive background watermark behind the name, partially cropped.

**Terminal ("Engineer")**:
- Nav logo: `$ done` or `./done` — styled as a command. The prompt IS the brand.
- Could also appear as: `[D.O-N.E] ~$` as the terminal prompt prefix throughout the theme.
- Footer: `exit 0 // D.O-N.E — Developer Osei-Nyarko Edward`

### Usage Rules
- The logo replaces "Edward Osei-Nyarko" in the nav — the full name appears in the hero.
- On the theme chooser landing page, `D.O-N.E` is the centered brand mark above the theme cards.
- Favicon: A simple `D` or `D.` mark that works at 16x16.

---

## The Problem with the Original Prototypes

The HTML prototypes in `reference-prototypes/` contain solid structure and layout ideas, but they lean on AI-generated design clichés. Use them for **layout and interaction patterns** but REPLACE the following:

### Kill List — Remove These From All Themes

| Cliché | Why it's slop | Replace with |
|--------|--------------|--------------|
| Gradient mesh orbs | Every AI portfolio has these | Nothing. Negative space is more confident. |
| Floating particles | Decorative noise, no meaning | Real content: architecture diagram, code snippet |
| "I build systems that scale" | Generic, could be anyone | Edward's actual words (see copy below) |
| "Let's build something great" | Cookie-cutter CTA | "Get in touch" or just the email. Confident, simple. |
| Counter animations on scroll | Every template site | Static numbers. The stats are impressive enough without animation gimmicks. |
| Frosted glass everything | Overused glassmorphism trend | Solid backgrounds with clear hierarchy |
| Mouse-follow glow/parallax | Decorative, no purpose | Remove or replace with meaningful interaction |
| Marquee tech ticker | Template filler | Structured skill groups only |
| "Available for opportunities" pulse badge | LinkedIn energy | Remove entirely or make it a subtle line in contact section |
| Generic SVG icons for features | Feels template-generated | Use descriptive text. The feature descriptions are strong enough. |

### Keep List — These Work

| Element | Why it works |
|---------|-------------|
| 4-theme switching concept | Genuinely unique, demonstrates engineering skill |
| Terminal 5-tab project explorer | Actually useful, shows technical depth |
| Git log styled experience (terminal) | Authentic to the engineer identity |
| Clean Minimal's typography (Playfair + Inter) | Elegant, distinctive pairing |
| Bold's asymmetric layout | Memorable, breaks formula |
| Device mockup screenshots | Professional project presentation |
| Responsive hamburger menus | Functional, not decorative |

## Edward's Story — Use This, Not AI Boilerplate

### Origin (for About section)

Edward's own words, lightly edited for flow:

"I studied physics at the University of Cape Coast in Ghana. For my final project, I programmed an Arduino UNO with C++ to regulate temperature in LDPE plastic moulds — a system designed to turn plastic waste into household products and reduce waste on campus and eventually across Ghana.

That project cracked something open. The curiosity of how writing code creates digital brains that solve real problems — I couldn't let go of it. I chose software development because of what it can do for people's daily lives. The EWC Care App exists because my church community needed better tools for pastoral care. Every project I take on starts with the same question: who does this help?"

### Tagline Options (pick ONE per theme, or use across all)

- "From physics to production systems — solving problems that matter."
- "I write code that serves communities."
- "Backend engineer. Problem-first thinker."
- "Physics taught me systems. Code lets me build them."

DO NOT use: "I build systems that scale", "Full-stack developer", "Passionate about technology", "Let's build something great together"

### Professional Voice

Edward is: direct, thoughtful, community-minded, technically rigorous, unpretentious.
Edward is NOT: flashy, buzzword-heavy, self-promotional, generic.

Write copy the way a confident engineer talks to a peer — not the way LinkedIn posts read.

## Redesigned Theme Directions

### Theme 1: Cinematic → "Showcase"

**Keep from prototype**: Dark background, dramatic presentation, section reveals on scroll, timeline experience layout.

**Replace**: Remove ALL decorative CSS effects (orbs, particles, glow, noise overlay). The drama comes from **the work itself**, not visual effects.

**New approach**:
- Hero: Name large and bold, one-line tagline from options above, clean dark background (#0a0a0a), no decorative elements. Photo of Edward (real, not 3D avatar) with subtle treatment (desaturation or duotone). Confidence through restraint on dark.
- Project section: THIS is where the visual impact goes. Full-width screenshots in device frames. An actual architecture diagram (SVG, not decorative — show the real Convex/Next.js/RBAC layers). Real code snippet from the EWC codebase (a particularly clean mutation or query). Let the engineering speak.
- Skills: Simple grouped tags. No glow, no hover effects. Just clean organization.
- Contact: Just the links. No "let's build something great" heading.

**Feel**: Like a well-made documentary — the subject matter is compelling enough.

### Theme 2: Minimal → "Editorial"

**Keep from prototype**: Playfair Display + Inter, whitespace, thin rules, restrained color, fade-in reveals.

**Replace**: This theme was actually the least sloppy. Minor fixes:
- Remove any generic taglines
- The about section should tell Edward's actual story (physics → Arduino → software)
- Project section should feel like a case study in a design magazine

**New approach**:
- Hero: Edward's name in Playfair Display, "Backend Engineer" in Inter, a single sentence from the tagline options. That's it. Let the typography do the work.
- About: Tell the Arduino story. Two paragraphs, personal voice. This is the theme where the story shines because there's nothing else competing for attention.
- Project: Present like a long-form case study. Problem → approach → architecture → results. Screenshots interspersed with text. No flashy cards — just content.
- The entire page should feel like reading a well-typeset article.

**Feel**: Like opening a Monocle magazine — everything is intentional, nothing is decorative.

### Theme 3: Bold → "Statement"

**Keep from prototype**: Asymmetric layout, Space Grotesk, numbered sections, unconventional nav placement, oversized typography.

**Replace**: Remove custom cursor (gimmick). Remove gradient orbs. Remove marquee ticker. Remove counter animations.

**New approach**:
- Hero: MASSIVE typography for the name, but the asymmetry serves a purpose — on one side, "Edward Osei-Nyarko" in huge staggered type. On the other side, a real photo or a key stat from EWC (like "280+ tests" in enormous type as a statement piece).
- The bold design language should make the CONTENT feel bold, not the effects. Big numbers for stats. Oversized pull-quotes from Edward's story. Strong color blocks behind text.
- Feature mosaic for EWC stays — it's a good layout. But kill the decorative icons; use text and numbers.
- Section numbers (01, 02, 03...) stay — they add structure.

**Feel**: Like a Pentagram case study — bold because the work demands it, not because of CSS tricks.

### Theme 4: Terminal → "Engineer"

**Keep from prototype**: Terminal chrome, Fira Code, typing animation (BUT see below), 5-tab project explorer, git log experience, `skills.json` presentation.

**Replace**:
- Typing animation: Instead of fake `$ whoami`, show a REAL code snippet being typed — maybe a clean Convex mutation from EWC, or the haversine distance function. Something that proves engineering skill, not a party trick.
- Remove scanline effect (gimmick).
- The `about.yaml` is clever — keep it but fill with real content.

**New approach**:
- Hero: A terminal showing something real. Maybe `$ cat README.md` and it renders Edward's actual intro. Or `$ git log --oneline` showing real commit messages from EWC.
- Project 5-tab explorer is the crown jewel of this theme. Make sure the content in each tab is REAL:
  - `package.json` — real dependencies from EWC
  - `FEATURES.md` — real feature list
  - `architecture` — real system layers
  - `security` — real security audit results (the PASS list)
  - `testing` — real test suite breakdown
- The terminal aesthetic works because Edward IS an engineer. It's authentic, not cosplay.

**Feel**: Like SSH-ing into a senior engineer's well-documented system.

## Photo / Avatar Decision

**Use a real photo of Edward.** Not a 3D avatar, not a cartoon.

Rationale: The user said "the work speaks for itself." A real photo is more confident and human than a Spline avatar. It also avoids the uncanny valley of AI-generated 3D characters.

Per-theme treatment:
- **Cinematic**: Desaturated or subtle duotone on dark, clean crop
- **Minimal**: Clean headshot, subtle border or no border, grayscale optional
- **Bold**: High contrast, maybe a color block behind it, cropped tight
- **Terminal**: ASCII art version generated from the real photo (this is the one place a stylized treatment fits — it's thematically consistent)

If the user doesn't have a professional headshot, design a clean placeholder with initials "EO" that works across all themes.

## Content-First Architecture Diagram

Instead of decorative graphics, create a REAL architecture diagram for the EWC project section. This is more impressive than any gradient orb:

```
┌─────────────────────────────────────────────────┐
│  Client Layer                                    │
│  Next.js 16 · React 19 · PWA · Tailwind CSS 4  │
├─────────────────────────────────────────────────┤
│  Real-time Layer                                 │
│  Convex Subscriptions · Optimistic Updates       │
├─────────────────────────────────────────────────┤
│  Auth & Security                                 │
│  Magic Link · 5-Tier RBAC · ABAC · PII Filter  │
├─────────────────────────────────────────────────┤
│  Data Layer                                      │
│  30+ Tables · Denormalized Counters · Audit Log │
└─────────────────────────────────────────────────┘
```

Render this as a clean SVG component, styled per theme. It communicates more engineering depth than any particle effect.

## Updated Section Order

Break the generic hero → about → project → skills → contact formula:

1. **Hero** — Name, title, one-line tagline, photo. Brief. Confident.
2. **Featured Project** — Lead with the work. This is what people are here for. Full EWC showcase with screenshots, architecture, and stats.
3. **Origin Story** — The physics → Arduino → software narrative. This is unique and memorable.
4. **Experience** — RentPost and Turntabl with real achievements.
5. **Skills** — Clean grouped tags. Functional, not decorative.
6. **Contact** — Just the links. No fluff.

Moving the project ABOVE the about/story is intentional — show the work first, then explain who built it and why.

## Summary of Changes for Implementation

1. Use reference prototypes for LAYOUT and INTERACTION patterns only
2. Replace ALL generic copy with Edward's real voice (this document)
3. Remove all items on the Kill List
4. Keep all items on the Keep List
5. Use real photo, not Spline 3D avatar (remove @splinetool/react-spline dependency)
6. Reorder sections: hero → project → story → experience → skills → contact
7. Add real architecture diagram SVG component
8. Show real code snippets in terminal theme
9. Every visual element must earn its place — if it doesn't communicate something, remove it
