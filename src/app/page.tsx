import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ScrollButton } from "@/components/site/ScrollButton";
import { KenteBandDefs, KenteStrip } from "@/components/kente/KenteStrip";
import { Seam } from "@/components/kente/Seam";
import { BreakIt } from "@/components/breakit/BreakIt";
import { PagePipe } from "@/components/pipe/PagePipe";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { BuildFlow } from "@/components/sections/BuildFlow";
import { Approach } from "@/components/sections/Approach";
import { Story } from "@/components/sections/Story";
import { Experience } from "@/components/sections/Experience";
import { Services } from "@/components/sections/Services";
import { Consultation } from "@/components/sections/Consultation";
import { Contact } from "@/components/sections/Contact";
import { breakItAnchor } from "@/data/breakIt";
import { buildPartsSection } from "@/data/buildFlow";
import { showAdinkra } from "@/data/culture";
import { homePath, mainId, siteUrl } from "@/data/navigation";
import { profile } from "@/data/profile";
import { meta, sections } from "@/data/site";

export const metadata: Metadata = {
  ...meta.portfolio,
  // The layout's title template only reaches pages below the root, so the
  // home page, now at /, writes its whole title itself.
  title: { absolute: meta.titleTemplate.replace("%s", meta.portfolio.title) },
  alternates: { canonical: homePath },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: siteUrl,
  sameAs: [profile.github, profile.linkedin],
  worksFor: {
    "@type": "Organization",
    name: profile.experience[0].company,
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: profile.education.institution,
  },
};

// The page pipe is laid over the whole of main. A seam is lifted one step
// above it, so the pipe passes behind the seam instead of across it.
const OVER_PIPE = "relative z-[2]";

/** The sections the page pipe feeds, in page order. Each gets one junction. */
const PIPE_STOPS = [
  "project",
  buildPartsSection.id,
  "approach",
  breakItAnchor,
  "story",
  "experience",
  "skills",
  sections.consultation.anchor,
  "contact",
];

// Server-rendered: every word below is in the HTML before any script runs.
export default function PortfolioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // "<" is escaped so no data value can ever close the script tag.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {showAdinkra ? (
        <>
          <KenteBandDefs />
          <div aria-hidden="true">
            <KenteStrip band="a" className="block h-3 w-full sm:h-4 lg:h-5" />
          </div>
        </>
      ) : null}
      <SiteHeader />
      <main id={mainId} className="relative">
        <Hero />
        <Work />
        <Seam bands={["b"]} className={`mt-28 lg:mt-36 ${OVER_PIPE}`} />
        <BuildFlow />
        <Approach />
        <Seam bands={["a", "c"]} weight="thin" className={`mt-28 lg:mt-36 ${OVER_PIPE}`} />
        <BreakIt />
        {/* Story brings a top margin meant for the Approach section. The
            section above already ends in its own space, so this cancels the
            margin. */}
        <div className="-mt-36 lg:-mt-44">
          <Story />
        </div>
        <Experience />
        <Services />
        <Consultation />
        <Seam bands={["c"]} className={`mt-28 lg:mt-36 ${OVER_PIPE}`} />
        <Contact />
        <PagePipe stops={PIPE_STOPS} flowStop={buildPartsSection.id} />
      </main>
      <SiteFooter />
      <ScrollButton />
    </>
  );
}
