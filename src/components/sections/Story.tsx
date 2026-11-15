import Image from "next/image";
import { profile } from "@/data/profile";
import { sections } from "@/data/site";

/* ── Story ── */
// The one tinted band on the page, so the person reads apart from the work.
export function Story() {
  const { degree, institution, year } = profile.education;

  return (
    <section id="story" className="mt-36 bg-surface lg:mt-44">
      <div className="mx-auto grid w-full max-w-page items-center gap-x-20 gap-y-12 px-4 py-24 sm:px-8 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:px-12 lg:py-32">
        <figure data-reveal className="max-w-sm md:max-w-none">
          <Image
            src="/photos/edward.jpg"
            alt={sections.story.photoAlt}
            width={720}
            height={1080}
            sizes="(min-width: 768px) 32vw, 24rem"
            className="aspect-[4/5] h-auto w-full object-cover object-top"
          />
        </figure>
        <div>
          <h2 className="text-section">{sections.story.title}</h2>
          <p className="mt-10 max-w-[30ch] text-statement">{profile.origin.short}</p>
          <p className="mt-10 border-t border-border pt-5 text-sm text-muted">
            {degree}, {institution}, {year}
          </p>
        </div>
      </div>
    </section>
  );
}
