import { Fragment } from "react";
import { ToolsList } from "@/components/sections/ToolsList";
import { services, servicesSection } from "@/data/services";

/* ── What I can build for you ── */
// A grid, because eight stacked rows would waste the width and make a long
// page longer. Four across from 1280px, two from 768px, one on a phone. Cells
// read left to right, then down, in the same order as the markup, so the
// keyboard and a screen reader meet them in the order the eye does. The
// section's id stays `skills`: nav links and older bookmarks point at it.
export function Services() {
  return (
    <section
      id="skills"
      className="mx-auto w-full max-w-page px-4 pt-32 sm:px-8 lg:px-12 lg:pt-40"
    >
      <h2 className="text-section">{servicesSection.title}</h2>
      {/* Hairlines come from the gaps, so every cell is ruled on all sides and
          cells in a row are the same height without any card dressing. */}
      <dl className="mt-14 grid gap-px border border-border bg-border md:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => (
          <div key={service.name} className="flex flex-col bg-background p-5 md:p-6">
            <dt className="font-stretch-[var(--stretch-display)] text-[1.25rem] font-semibold leading-[1.2]">
              {service.name}
            </dt>
            {/* The proof link is pushed to the foot of the cell, so the links
                line up along each row however long the names above run.
                The one-line descriptions were cut to keep the screen near
                80 words (Edward, 15 Nov 2026); the case studies carry the detail. */}
            <dd className="mt-2 flex flex-1 flex-col md:mt-3">
              <p className="mt-auto pt-4 text-[0.9375rem] md:pt-6">
                {service.proof.lead}{" "}
                {service.proof.links.map((link, index) => (
                  <Fragment key={link.href}>
                    {index > 0 ? ` ${servicesSection.proofJoin} ` : null}
                    <a
                      href={link.href}
                      className="underline decoration-border underline-offset-4 hover:decoration-accent active:text-muted"
                    >
                      {link.label}
                    </a>
                  </Fragment>
                ))}
              </p>
            </dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-24 text-title">{servicesSection.toolsTitle}</h3>
      <ToolsList />
    </section>
  );
}
