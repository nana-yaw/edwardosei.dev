import { profile } from "@/data/profile";
import { resumeUrl } from "@/data/navigation";
import { sections } from "@/data/site";

/** "Jul 2023 - Present" reads better on screen as "Jul 2023 to Present". */
function spellOutRange(period: string): string {
  return period.replace(" - ", " to ");
}

interface ExperienceProps {
  /** "full" shows the engineering detail of the current role, for hiring managers. */
  detail?: "plain" | "full";
}

/* ── Experience ── */
export function Experience({ detail = "plain" }: ExperienceProps) {
  return (
    <section
      id="experience"
      className="mx-auto w-full max-w-page px-4 pt-36 sm:px-8 lg:px-12 lg:pt-48"
    >
      <h2 className="text-section">{sections.experience.title}</h2>
      {/* Three rows: the two jobs, then where the rest of the history lives. */}
      <div className="mt-16">
        {profile.experience.map((job) => (
          <article
            key={job.company}
            data-reveal
            className="grid gap-x-16 gap-y-6 border-t border-border py-12 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:py-20"
          >
            <div>
              <h3 className="text-title">{job.company}</h3>
              <p className="mt-3 text-muted">{job.role}</p>
              <p className="text-sm text-muted">
                {spellOutRange(job.period)}, {job.location}
              </p>
            </div>
            <ul className={detail === "full" ? "space-y-5 text-lede" : "space-y-8 text-statement"}>
              {(detail === "full" && job.current
                ? job.achievements.slice(0, 2)
                : job.highlights
              ).map((highlight) => (
                <li key={highlight} className={detail === "full" ? "max-w-[60ch]" : "max-w-[36ch]"}>
                  {highlight}
                </li>
              ))}
            </ul>
          </article>
        ))}
        <p className="border-t border-border py-8 text-muted">
          <a
            href={resumeUrl}
            className="underline decoration-border underline-offset-8 hover:decoration-accent active:text-foreground"
          >
            {sections.experience.resumeNote}
          </a>
        </p>
      </div>
    </section>
  );
}
