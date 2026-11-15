import { sections } from "@/data/site";

/* ── Approach ── */
// Says plainly that the code is written with AI, and who answers for it.
export function Approach() {
  return (
    <section
      id="approach"
      className="mx-auto w-full max-w-page px-4 pt-36 sm:px-8 lg:px-12 lg:pt-48"
    >
      <h2 className="text-section">{sections.approach.title}</h2>
      <dl className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-[repeat(3,minmax(0,1fr))]">
        {sections.approach.points.map((point) => (
          <div key={point.name} data-reveal className="border-t border-border pt-6">
            <dt className="font-stretch-[var(--stretch-display)] text-title font-semibold">
              {point.name}
            </dt>
            <dd className="mt-3 max-w-[40ch] text-muted">{point.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
