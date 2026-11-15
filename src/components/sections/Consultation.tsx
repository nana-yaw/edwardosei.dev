import { profile } from "@/data/profile";
import { sections } from "@/data/site";

/* ── Consultations ── */
// Sits between the services and the contact section: an owner who is not ready
// to hire can still start a conversation.
export function Consultation() {
  const { consultation } = sections;
  const href = `mailto:${profile.email}?subject=${encodeURIComponent(consultation.emailSubject)}`;

  return (
    <section
      id={consultation.anchor}
      className="mx-auto mt-28 w-full max-w-page px-4 sm:px-8 lg:mt-36 lg:px-12"
    >
      <div className="grid gap-x-16 gap-y-8 border border-border bg-surface p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:p-16">
        <h2 className="text-section">{consultation.title}</h2>
        <div>
          <p className="text-lede">{consultation.lede}</p>
          <p className="mt-4 max-w-[48ch] text-muted">{consultation.outcome}</p>
          <a
            href={href}
            className="mt-8 inline-flex h-12 items-center whitespace-nowrap bg-accent px-6 font-semibold text-accent-ink transition-[background-color] duration-150 hover:bg-foreground active:bg-muted"
          >
            {consultation.action}
          </a>
        </div>
      </div>
    </section>
  );
}
