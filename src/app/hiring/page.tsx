import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ScrollMotion } from "@/components/motion/ScrollMotion";
import { Experience } from "@/components/sections/Experience";
import { ToolsList } from "@/components/sections/ToolsList";
import { hiringPath, mainId, resumeUrl } from "@/data/navigation";
import { profile } from "@/data/profile";
import { hiring, sections } from "@/data/site";

export const metadata: Metadata = {
  title: hiring.title,
  description: hiring.headline,
  alternates: { canonical: hiringPath },
};

const containerClass = "mx-auto w-full max-w-page px-4 sm:px-8 lg:px-12";
const linkClass =
  "whitespace-nowrap underline decoration-border underline-offset-8 hover:decoration-accent active:text-muted";

/* ── For hiring managers ── */
// The second door from the home page. Role, resume and links first, then
// working practice in general terms.
export default function HiringPage() {
  const links = [
    { label: hiring.links.github, href: profile.github },
    { label: hiring.links.linkedin, href: profile.linkedin },
    { label: hiring.links.email, href: `mailto:${profile.email}` },
    hiring.workLink,
  ];

  return (
    <>
      <ScrollMotion>
        <SiteHeader pinned />
        <main id={mainId}>
          {/* ── Opening ── */}
          <section
            className={`${containerClass} grid items-center gap-x-16 gap-y-12 pb-12 pt-10 lg:min-h-[calc(88svh-var(--header-height))] lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:py-8`}
          >
            <div>
              <h1 className="max-w-[18ch] text-display">{hiring.headline}</h1>
              <p className="mt-8 max-w-[52ch] text-lede text-muted">{hiring.lede}</p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a
                  href={resumeUrl}
                  className="inline-flex h-12 items-center whitespace-nowrap bg-accent px-6 font-semibold text-accent-ink transition-[background-color] duration-150 hover:bg-foreground active:bg-muted"
                >
                  {hiring.resumeLabel}
                </a>
                {links.map((link) => (
                  <a key={link.href} href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <figure className="max-w-sm lg:max-w-none">
              <Image
                src="/photos/edward.jpg"
                alt={sections.story.photoAlt}
                width={720}
                height={1080}
                priority
                sizes="(min-width: 1024px) 30vw, 24rem"
                className="aspect-[4/5] h-auto w-full object-cover object-top"
              />
            </figure>
          </section>

          {/* ── Practice ── */}
          <section className={`${containerClass} pt-20`}>
            <h2 className="text-section">{hiring.practiceTitle}</h2>
            <dl className="mt-14 border-b border-border">
              {hiring.practice.map((item) => (
                <div
                  key={item.name}
                  data-reveal
                  className="grid gap-x-16 gap-y-2 border-t border-border py-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
                >
                  <dt className="font-stretch-[var(--stretch-display)] text-title font-semibold">
                    {item.name}
                  </dt>
                  <dd className="max-w-[48ch] text-lede text-muted">{item.detail}</dd>
                </div>
              ))}
            </dl>
          </section>

          <Experience detail="full" />

          {/* ── Tools ── */}
          <section className={`${containerClass} pb-32 pt-36 lg:pb-40 lg:pt-52`}>
            <h2 className="text-section">{hiring.toolsTitle}</h2>
            <ToolsList />
          </section>
        </main>
        <SiteFooter />
      </ScrollMotion>
    </>
  );
}
