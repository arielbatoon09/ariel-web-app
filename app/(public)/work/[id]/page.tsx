import { notFound } from "next/navigation";
import { ALL_PROJECTS } from "@/constants/projects";
import { CaseStudyHero } from "@/components/features/works/case-study-hero";
import { CaseStudyDetails } from "@/components/features/works/case-study-details";
import { CaseStudyOutcomes } from "@/components/features/works/case-study-outcomes";
import { CtaSection } from "@/components/common/cta-section";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_PROJECTS.map((project) => ({
    id: project.id,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const project = ALL_PROJECTS.find((p) => p.id === resolvedParams.id);
  if (!project) return {};

  return {
    title: `${project.title} | Case Study`,
    description: project.description,
  };
}

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const project = ALL_PROJECTS.find((p) => p.id === resolvedParams.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <CaseStudyHero project={project} />
      <CaseStudyDetails caseStudy={project.caseStudy} />
      <CaseStudyOutcomes caseStudy={project.caseStudy} />
      <CtaSection />
    </div>
  );
}
