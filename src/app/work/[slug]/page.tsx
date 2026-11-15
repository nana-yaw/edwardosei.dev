import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/work/CaseStudy";
import { getCaseStudies } from "@/data/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Only the case studies in the data exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return getCaseStudies().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getCaseStudies().find((candidate) => candidate.slug === slug);
  if (!project) return {};
  const path = project.caseStudy.path;
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: path },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getCaseStudies().find((candidate) => candidate.slug === slug);
  if (!project) notFound();

  return (
    <CaseStudy name={project.name} liveUrl={project.liveUrl} study={project.caseStudy} />
  );
}
