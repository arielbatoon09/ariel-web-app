import { Target, CheckCircle2, Cpu } from "lucide-react";
import { Section } from "@/components/common/section";
import type { CaseStudy } from "@/constants/projects";
import { GridCard } from "@/components/common/grid-card";

interface CaseStudyDetailsProps {
  caseStudy: CaseStudy;
}

export function CaseStudyDetails({ caseStudy }: CaseStudyDetailsProps) {
  const features = caseStudy.features || [];

  return (
    <Section id="cs-details" containerClassName="py-12 md:py-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-16">
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Target className="size-5 text-neutral-400" />
              <h2 className="font-sans text-xl font-bold tracking-tight">The Challenge</h2>
            </div>
            <div
              className="prose prose-neutral dark:prose-invert max-w-none font-sans text-sm leading-relaxed text-neutral-600 md:text-base dark:text-neutral-400 [&_li]:my-1 [&_ol]:list-decimal [&_ul]:list-disc"
              dangerouslySetInnerHTML={{ __html: caseStudy.challenge }}
            />
          </div>

          <div className="space-y-4 border-t border-dashed border-neutral-200 pt-8 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="size-5 text-neutral-400" />
              <h2 className="font-sans text-xl font-bold tracking-tight">The Engineering Solution</h2>
            </div>
            <div
              className="prose prose-neutral dark:prose-invert max-w-none font-sans text-sm leading-relaxed text-neutral-600 md:text-base dark:text-neutral-400 [&_li]:my-1 [&_ol]:list-decimal [&_ul]:list-disc"
              dangerouslySetInnerHTML={{ __html: caseStudy.solution }}
            />
          </div>
        </div>

        {features.length > 0 ? (
          <div className="space-y-6 border-t border-dashed border-neutral-200 pt-10 dark:border-neutral-800">
            <div className="mb-4 flex items-center gap-2 text-foreground">
              <Cpu className="size-5 text-neutral-400" />
              <h2 className="font-sans text-xl font-bold tracking-tight">Key Technical Features</h2>
            </div>

            <div className="grid grid-cols-1 border-t border-l border-dashed border-neutral-300 md:grid-cols-2 lg:grid-cols-3 dark:border-neutral-700">
              {features.map((feature, idx) => (
                <GridCard
                  key={`${feature.title}-${idx}`}
                  number={String(idx + 1).padStart(2, "0")}
                  title={feature.title}
                  titleClassName="text-sm font-bold text-foreground"
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
