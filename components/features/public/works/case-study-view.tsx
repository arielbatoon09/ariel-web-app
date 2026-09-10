import { CaseStudyHero } from "@/components/features/public/works/case-study-hero";
import { CaseStudyDetails } from "@/components/features/public/works/case-study-details";
import { CaseStudyOutcomes } from "@/components/features/public/works/case-study-outcomes";
import { CtaSection } from "@/components/common/cta-section";
import type { Project } from "@/constants/projects";

interface CaseStudyViewProps {
  project: Project;
  categoryNames?: string;
  showCta?: boolean;
}

/** Shared case-study layout used by the public page and admin preview. */
export function CaseStudyView({ project, categoryNames, showCta = true }: CaseStudyViewProps) {
  return (
    <>
      <CaseStudyHero project={project} categoryNames={categoryNames} />
      <CaseStudyDetails caseStudy={project.caseStudy} />
      <CaseStudyOutcomes caseStudy={project.caseStudy} title={project.title} />
      {showCta ? <CtaSection /> : null}
    </>
  );
}
