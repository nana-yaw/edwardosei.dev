import { profile } from "@/data/profile";
import { resumeUrl } from "@/data/navigation";
import { replyTime, sections } from "@/data/site";

/* ── Contact ── */
export function Contact() {
  const links = [
    { label: sections.contact.links.github, href: profile.github },
    { label: sections.contact.links.linkedin, href: profile.linkedin },
    { label: sections.contact.links.resume, href: resumeUrl },
  ];

  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-page px-4 pb-32 pt-40 sm:px-8 lg:px-12 lg:pb-40 lg:pt-52"
    >
      <h2 className="text-display">{sections.contact.title}</h2>
      <p className="mt-8 max-w-[48ch] text-lede text-muted">{sections.contact.lede}</p>
      <p className="mt-12">
        <a
          href={`mailto:${profile.email}`}
          data-track="email"
          className="whitespace-nowrap text-[1.0625rem] font-semibold underline decoration-accent underline-offset-8 hover:text-accent active:text-muted sm:font-stretch-[var(--stretch-display)] sm:text-title"
        >
          {profile.email}
        </a>
      </p>
      <p className="mt-6 text-muted">{replyTime}</p>
      <h3 className="mt-20 font-stretch-[var(--stretch-display)] text-title font-semibold">
        {sections.contact.nextStepsTitle}
      </h3>
      <ol className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2 xl:grid-cols-4">
        {sections.contact.nextSteps.map((step, index) => (
          <li key={step} className="border-t border-border pt-6">
            <span className="font-semibold">{index + 1}</span>
            <p className="mt-3 max-w-[40ch] text-muted">{step}</p>
          </li>
        ))}
      </ol>
      <ul className="mt-16 flex flex-wrap gap-x-10 gap-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="whitespace-nowrap underline decoration-border underline-offset-8 hover:decoration-accent active:text-muted"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
