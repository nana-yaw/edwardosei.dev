import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Project } from "@/components/sections/Project";
import { Story } from "@/components/sections/Story";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function PortfolioPage() {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-full rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
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
    </>
  );
}
