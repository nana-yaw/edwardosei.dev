import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ScrollMotion } from "@/components/motion/ScrollMotion";
import { ScreenshotPair } from "@/components/work/ScreenshotPair";
import type { CaseStudyContent } from "@/data/projects";
import { homePath, mainId } from "@/data/navigation";
import { caseStudy } from "@/data/site";

interface CaseStudyProps {
  name: string;
  liveUrl: string | null;
  study: CaseStudyContent;
}

const containerClass = "mx-auto w-full max-w-page px-4 sm:px-8 lg:px-12";
const linkClass =
  "underline decoration-border underline-offset-8 hover:decoration-accent active:text-muted";
const termClass = "font-stretch-[var(--stretch-display)] font-semibold";

/* ── Case study ── */
// One layout for every project page: the opening with its captures, three
// statements, what people do with the product, then its size.
export function CaseStudy({ name, liveUrl, study }: CaseStudyProps) {
  const backHref = `${homePath}#project`;

  return (
    <ScrollMotion>
      <SiteHeader pinned />
      <main id={mainId}>
        {/* ── Opening ── */}
        <section
          className={`${containerClass} flex flex-col justify-between gap-y-12 pb-8 pt-10 lg:min-h-[calc(88svh-var(--header-height))] lg:pt-8`}
        >
          <div className="grid flex-1 items-center gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div>
              <h1 className="text-display">{name}</h1>
              <p className="mt-6 max-w-[40ch] text-lede text-muted">{study.lede}</p>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
                {liveUrl ? (
                  <a
                    href={liveUrl}
                    className="inline-flex h-12 items-center whitespace-nowrap bg-accent px-6 font-semibold text-accent-ink transition-[background-color] duration-150 hover:bg-foreground active:bg-muted"
                  >
                    {study.visitLabel}
                  </a>
                ) : null}
                <a
                  href={backHref}
                  className={`inline-flex h-12 items-center whitespace-nowrap ${linkClass}`}
                >
                  {caseStudy.backLabel}
                </a>
              </div>
            </div>
            <ScreenshotPair desktop={study.desktop} mobile={study.mobile} priority />
          </div>
          <dl className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-x-16 border-t border-border pt-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {study.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-sm text-muted">{fact.label}</dt>
                <dd className="mt-1">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Three statements ── */}
        <section className={`${containerClass} pt-16 lg:pt-24`}>
          <div>
            {study.rows.map((row) => (
              <div
                key={row.title}
                data-reveal
                className="grid gap-x-16 gap-y-6 border-t border-border py-16 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:py-24"
              >
                <h2 className="text-section">{row.title}</h2>
                <p className="max-w-[34ch] text-statement">{row.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── What people do with it ── */}
        <section className="mt-16 bg-surface lg:mt-32">
          <div className={`${containerClass} py-24 lg:py-32`}>
            <h2 className="max-w-[18ch] text-section">{study.surfacesTitle}</h2>
            <dl className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-[repeat(3,minmax(0,1fr))]">
              {study.surfaces.map((surface) => (
                <div key={surface.name} className="border-t border-border pt-6">
                  <dt className={`text-title ${termClass}`}>{surface.name}</dt>
                  <dd className="mt-3 max-w-[38ch] text-muted">{surface.detail}</dd>
                </div>
              ))}
            </dl>
            {study.more ? (
              <div data-reveal className="mx-auto mt-20 max-w-5xl">
                <ScreenshotPair desktop={study.more.desktop} mobile={study.more.mobile} />
              </div>
            ) : null}
          </div>
        </section>

        {/* ── Size ── */}
        <section className={`${containerClass} pb-32 pt-36 lg:pb-40 lg:pt-52`}>
          <h2 className="text-section">{study.figuresTitle}</h2>
          <dl className="mt-14 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-x-12 gap-y-12 md:grid-cols-[repeat(3,minmax(0,1fr))]">
            {study.figures.map((figure) => (
              <div key={figure.label} className="flex flex-col-reverse border-t border-border pt-5">
                <dt className="mt-1 text-muted">{figure.label}</dt>
                <dd className={`text-section ${termClass}`}>{figure.value}</dd>
              </div>
            ))}
          </dl>
          {study.figuresNote ? (
            <p className="mt-10 text-sm text-muted">{study.figuresNote}</p>
          ) : null}
          <p className="mt-16 flex flex-wrap gap-x-10 gap-y-3 text-lede">
            {liveUrl ? (
              <a href={liveUrl} className={linkClass}>
                {study.visitLabel}
              </a>
            ) : null}
            <a href={backHref} className={linkClass}>
              {caseStudy.backLabel}
            </a>
          </p>
        </section>
      </main>
      <SiteFooter />
    </ScrollMotion>
  );
}
