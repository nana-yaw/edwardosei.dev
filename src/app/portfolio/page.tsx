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
      <Hero />
      <Project />
      <Story />
      <Experience />
      <Skills />
      <Contact />
      <ThemeSwitcher />
    </>
  );
}
