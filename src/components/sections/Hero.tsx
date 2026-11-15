import type { ReactNode } from "react";
import { hero } from "@/data/hero";
import { build } from "@/data/heroPicture";
import { HeroCanvasLayer } from "@/components/hero/HeroCanvasLayer";
import { HeroStill } from "@/components/hero/HeroStill";
import { IDEA_LEAD, LABEL_ANCHORS, VIEW, type AnchorName } from "@/components/hero/framing";

/** Widest the stage may be before its height would push the hero past the first screen. */
const STAGE_MAX_WIDTH = `calc((100svh - var(--header-height) - 4rem) * ${(VIEW.width / VIEW.height).toFixed(4)})`;

// A label waits dimmed where the build is about to play, and the canvas
// lights it as its part goes in. Everywhere else it is simply lit. The wait
// is the same one the still uses: held back from the first paint for six
// seconds at most, so the labels never stay dim beside a picture that came
// back on its own. A live canvas takes the wait over with `data-building`.
const WAITING =
  "transition-opacity duration-300 md:motion-safe:not-noscript:delay-[6s] md:motion-safe:not-noscript:starting:opacity-35 group-data-[still]:transition-none group-data-[building]:opacity-35 group-data-[building]:delay-0 group-data-[building]:data-[lit]:opacity-100";
// What only exists once the wall is lit has nothing to sit beside before then, so it waits unseen.
const WAITING_UNSEEN =
  "transition-opacity duration-300 md:motion-safe:not-noscript:delay-[6s] md:motion-safe:not-noscript:starting:opacity-0 group-data-[still]:transition-none group-data-[building]:opacity-0 group-data-[building]:delay-0 group-data-[building]:data-[lit]:opacity-100";

// The idea's rule dims and lights with its label once the canvas owns the
// labels. Before that it is simply lit, like every other rule.
const WAITING_RULE =
  "transition-opacity duration-300 group-data-[still]:transition-none group-data-[building]:opacity-35 group-data-[building]:data-[lit]:opacity-100";

// A label that names a part of the picture. Where the canvas is live it is
// turned into a toggle button that lights its part (see HeroCanvasLayer);
// everywhere else it is plain text. The ring shows at once, with no fade.
const PART = "rounded-xs outline-offset-4 outline-accent focus-visible:outline-2 [&[role=button]]:cursor-pointer";

// The order the build lights them in.
const STEPS = {
  idea: 0,
  plumbing: 1,
  firstRun: 2,
  housing: 2 + build.plumbing.runs.length,
  firstPart: 3 + build.plumbing.runs.length,
  live: 3 + build.plumbing.runs.length + build.housing.parts.length,
  launch: 4 + build.plumbing.runs.length + build.housing.parts.length,
  paying: 5 + build.plumbing.runs.length + build.housing.parts.length,
} as const;

interface CalloutProps {
  /** Which point of the picture it hangs from. The canvas keeps it there while the camera moves. */
  name: AnchorName;
  /** The amber rule is for what is amber in the picture. */
  accent?: boolean;
  /** Set when the whole callout, rule included, lights as one step. */
  step?: number;
  /** Where the callout sits in the phone's two-column list, or how it waits. */
  className?: string;
  /** A second length of rule running back from the callout's start to the floating bulb, as a share of the stage's width. Set for the idea only. */
  lead?: number;
  children: ReactNode;
}

/* ── One label, tied to its part of the picture ── */
// From 640px up a hairline runs from the part to the text column. On a phone
// the callouts are a plain list under the picture.
function Callout({ name, accent = false, step, className = "", lead, children }: CalloutProps) {
  const anchor = LABEL_ANCHORS[name];
  // The idea's rule waits with its label: while the bulb is on its way down
  // and the wall is not up yet, there is nothing at its end. The other rules
  // stay lit, because their parts are built where their rules already point.
  const waits = lead !== undefined;
  return (
    <li
      data-step={step}
      data-anchor={name}
      // Raised by a margin, not a transform: untransformed text sits on whole pixels.
      className={`sm:pointer-events-auto sm:absolute sm:-mt-[0.625em] sm:flex sm:items-start sm:gap-2 sm:whitespace-nowrap ${className}`}
      style={{ left: anchor.left, top: anchor.top }}
    >
      {lead !== undefined ? (
        // Only while the build plays, and only while the bulb floats there:
        // the canvas marks it gone when the bulb sets off.
        <span
          aria-hidden="true"
          data-lead
          className="absolute right-full top-[0.625em] hidden h-px bg-accent transition-opacity duration-300 data-[gone]:opacity-0 sm:group-data-[building]:block"
          style={{ width: `${(lead * 100).toFixed(3)}cqw` }}
        />
      ) : null}
      <span
        aria-hidden="true"
        data-step={waits ? STEPS.idea : undefined}
        data-idea={waits ? "" : undefined}
        className={`hidden h-px shrink-0 sm:mt-[0.625em] sm:block ${accent ? "bg-accent" : "bg-border"} ${waits ? WAITING_RULE : ""}`}
        // The stage is a size container, so the rule can reach the text column whatever the stage's width.
        style={{ width: `calc(${(anchor.reach * 100).toFixed(3)}cqw + 0.75rem)` }}
      />
      <div>{children}</div>
    </li>
  );
}

/* ── Build figure ── */
// The picture and its labels. The labels are real text set level with their
// parts, so they are selectable and present without scripts.
function BuildFigure() {
  return (
    // The labels hang off the stage's right edge from 640px up; the padding is
    // their room. Beside the text the figure also takes most of the gutter,
    // which lets the model stand a little larger.
    <figure data-hero-figure className="group w-full sm:pr-36 xl:-ml-6 xl:w-auto">
      {/* Never taller than the first screen, however wide the column is. */}
      <div className="@container relative mx-auto xl:mr-0" style={{ maxWidth: STAGE_MAX_WIDTH }}>
        <div className="relative" style={{ aspectRatio: `${VIEW.width} / ${VIEW.height}` }}>
          <HeroCanvasLayer />
          <HeroStill label={build.diagramLabel} />
        </div>
        <ul
          role="list"
          className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm leading-tight sm:pointer-events-none sm:absolute sm:inset-0 sm:z-20 sm:mt-0 sm:block sm:text-[0.9375rem]"
        >
          {/* While the bulb floats over the plot, the idea's rule runs on to it. */}
          <Callout name="idea" accent lead={IDEA_LEAD}>
            {/* Its endings make it long: beside the picture it wraps inside the label column. */}
            <p data-step={STEPS.idea} data-idea="" className={`sm:w-[9.25rem] sm:whitespace-normal ${WAITING}`}>
              {build.idea.label}
              <span data-step={STEPS.live} className={WAITING_UNSEEN}>
                {build.idea.liveEnding}
              </span>
              <span data-step={STEPS.paying} className={WAITING_UNSEEN}>
                {build.idea.payingEnding}
              </span>
            </p>
          </Callout>
          <Callout name="plumbing" accent className="max-sm:col-start-2 max-sm:row-span-3 max-sm:row-start-1">
            <p data-step={STEPS.plumbing} className={`font-semibold ${WAITING}`}>
              {build.plumbing.name}
              {/* Two lines beside the picture, so it never runs off the page's right edge. */}
              <span className="block pt-1 font-normal text-muted sm:max-w-[7.5rem] sm:whitespace-normal">
                {build.plumbing.explanation}
              </span>
            </p>
            <ul role="list" className="mt-2 grid gap-1.5">
              {build.plumbing.runs.map((run, index) => (
                <li key={run} data-step={STEPS.firstRun + index} className={WAITING}>
                  <span data-part={`run-${index}`} className={PART}>
                    {run}
                  </span>
                </li>
              ))}
            </ul>
          </Callout>
          <Callout name="housing">
            <p data-step={STEPS.housing} className={`font-semibold ${WAITING}`}>
              <span data-part="housing" className={PART}>
                {build.housing.name}
              </span>
            </p>
            <ul role="list" className="mt-2 grid gap-1.5">
              {build.housing.parts.map((part, index) => (
                <li key={part} data-step={STEPS.firstPart + index} className={WAITING}>
                  {part}
                </li>
              ))}
            </ul>
          </Callout>
          {/* The whole callout waits, rule and all: there is no doorstep to point at until the end. */}
          <Callout name="launch" step={STEPS.launch} className={WAITING_UNSEEN}>
            <p>{build.launch}</p>
          </Callout>
        </ul>
      </div>
    </figure>
  );
}

/* ── Hero ── */
export function Hero() {
  const [job, bring, deliver] = hero.headline;

  return (
    <section
      id="hero"
      // The picture's overscan may reach past a phone's screen edge. Clipped
      // here, it can never make the page wider than the screen.
      className="mx-auto grid w-full max-w-page overflow-x-clip items-center gap-x-8 gap-y-12 px-4 pb-16 pt-8 sm:px-8 lg:px-12 xl:min-h-[calc(100svh-var(--header-height))] xl:grid-cols-[minmax(0,6fr)_minmax(0,8fr)] xl:py-6"
    >
      <div>
        {/* One sentence a line. The invitation is set quieter, so the eye
            reads "Web developer. I build its home." first. */}
        <h1 className="text-[clamp(2rem,0.9rem+4.9vw,3.5rem)] leading-[1.04] xl:text-[clamp(3rem,0.6rem+3.3vw,3.5rem)]">
          <span className="block">{job}</span>{" "}
          <span className="block text-muted">{bring}</span>{" "}
          <span className="block">{deliver}</span>
        </h1>
        <p className="mt-6 max-w-[44ch] text-lede text-muted">{hero.lede}</p>
        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
          <a
            href={hero.primary.href}
            className="inline-flex h-12 items-center whitespace-nowrap bg-accent px-6 font-semibold text-accent-ink transition-[background-color] duration-150 hover:bg-foreground active:bg-muted"
          >
            {hero.primary.label}
          </a>
          <a
            href={hero.secondary.href}
            className="inline-flex h-12 items-center whitespace-nowrap underline decoration-border underline-offset-8 hover:decoration-accent active:text-muted"
          >
            {hero.secondary.label}
          </a>
        </div>
        <p className="mt-5 text-sm text-muted">{hero.availability}</p>
      </div>
      <BuildFigure />
    </section>
  );
}
