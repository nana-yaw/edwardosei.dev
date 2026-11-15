import Image from "next/image";
import Link from "next/link";
import { sections } from "@/data/site";
import {
  getAlsoBuiltProjects,
  getClientProject,
  getFeaturedProject,
} from "@/data/projects";
import { ScreenshotPair } from "@/components/work/ScreenshotPair";

const linkClass =
  "underline decoration-border underline-offset-8 hover:decoration-accent active:text-muted";
const rowClass =
  "mt-28 grid items-center gap-x-16 gap-y-10 border-t border-border pt-16";

/* ── Work ── */
// The section id stays `project`: nav links and older bookmarks point at it.
// Three products, each a picture beside a few plain sentences.
// Every way here (the nav link, a shared link, a case study's way back, the
// scroll button) lands at one place: the scroll margin cancels the header's
// scroll padding and goes 66px further, two past where usePastHero counts
// the hero as gone, so the page arrives past the hero. The section opens with
// clear space, so its heading still lands well inside the screen.
export function Work() {
  const sihene = getClientProject("sihene");
  const featured = getFeaturedProject();
  const others = getAlsoBuiltProjects();

  return (
    <section
      id="project"
      className="mx-auto w-full max-w-page scroll-mt-[calc(-1*var(--header-height)_-_66px)] px-4 pt-32 sm:px-8 lg:px-12 lg:pt-40"
    >
      <h2 className="max-w-[16ch] text-section">{sections.work.title}</h2>

      {/* ── Si Hene ── */}
      <article
        data-reveal
        className="mt-16 grid items-center gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
      >
        <ScreenshotPair
          desktop={sihene.caseStudy.desktop}
          mobile={sihene.caseStudy.mobile}
        />
        <div>
          <h3 className="text-title">{sihene.name}</h3>
          <p className="mt-4 max-w-[46ch] text-muted">{sihene.summary}</p>
          <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <Link href={sihene.caseStudy.path} className={linkClass}>
              {sections.work.caseStudyLabel}
            </Link>
            {sihene.liveUrl ? (
              <a href={sihene.liveUrl} className={linkClass}>
                {sections.work.liveLabel}
              </a>
            ) : null}
          </p>
        </div>
      </article>

      {/* ── EWC Care App ── */}
      <article
        data-reveal
        className={`${rowClass} lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}
      >
        <figure className="border border-border lg:order-2">
          <Image
            src={featured.cover.src}
            alt={featured.cover.alt}
            width={featured.cover.width}
            height={featured.cover.height}
            sizes="(min-width: 1024px) 56vw, 100vw"
            className="h-auto w-full"
          />
        </figure>
        <div>
          <h3 className="text-title">{featured.name}</h3>
          <p className="mt-4 max-w-[46ch] text-muted">{featured.summary}</p>
          <p className="mt-8 max-w-[24ch] text-statement">{featured.statement}</p>
          <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <Link href={featured.caseStudy.path} className={linkClass}>
              {sections.work.caseStudyLabel}
            </Link>
            {featured.liveUrl ? (
              <a href={featured.liveUrl} className={linkClass}>
                {sections.work.liveLabel}
              </a>
            ) : null}
          </p>
        </div>
      </article>

      {/* ── Everything else ── */}
      {others.map((project) => (
        <article
          key={project.slug}
          data-reveal
          className={`${rowClass} lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]`}
        >
          <figure className="border border-border">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              width={project.cover.width}
              height={project.cover.height}
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="h-auto w-full"
            />
          </figure>
          <div>
            <h3 className="text-title">{project.name}</h3>
            <p className="mt-4 max-w-[46ch] text-muted">{project.summary}</p>
            {project.liveUrl ? (
              <p className="mt-8">
                <a href={project.liveUrl} className={linkClass}>
                  {sections.work.liveLabel}
                </a>
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </section>
  );
}
