import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Project } from "@/components/sections/Project";
import { Story } from "@/components/sections/Story";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { ScrollButton } from "@/components/ScrollButton";
import { TerminalShortcuts } from "@/components/themes/terminal";
import { ThemeFavicon } from "@/components/ThemeFavicon";
import { PostHogThemeTracker } from "@/components/PostHogProvider";
import { StoryOrchestrator } from "@/components/StoryOrchestrator";
import { StoryOverlay } from "@/components/StoryOverlay";
import { StoryNavProvider } from "@/context/StoryNavContext";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Edward Osei-Nyarko — Software developer building production systems. 42 database tables, 280+ tests, 6 security layers, 4 visual themes.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: "https://edwardosei.dev",
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

export default function PortfolioPage() {
  return (
    <StoryNavProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-full rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <StoryOrchestrator />
      <StoryOverlay />
      <Nav />
      <main id="main-content">
        <Hero />
        <Project />
        <Story />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <ThemeSwitcher />
      <ScrollButton />
      <TerminalShortcuts />
      <ThemeFavicon />
      <PostHogThemeTracker />
    </StoryNavProvider>
  );
}
