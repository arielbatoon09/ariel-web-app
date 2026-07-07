import { Target, CheckCircle2, Cpu } from "lucide-react";
import { Section } from "@/components/common/section";
import type { CaseStudy } from "@/constants/projects";

interface CaseStudyDetailsProps {
  caseStudy: CaseStudy;
}

export function CaseStudyDetails({ caseStudy }: CaseStudyDetailsProps) {
  return (
    <Section id="cs-details" containerClassName="py-12 md:py-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-16">
        {/* Challenge & Solution Layout Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Challenge & Solution */}
          <div className="space-y-10 lg:col-span-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <Target className="size-5 text-neutral-400" />
                <h2 className="font-sans text-xl font-bold tracking-tight">The Challenge</h2>
              </div>
              <p className="font-sans text-sm leading-relaxed text-neutral-600 md:text-base dark:text-neutral-400">{caseStudy.challenge}</p>
            </div>

            <div className="space-y-4 border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="size-5 text-neutral-400" />
                <h2 className="font-sans text-xl font-bold tracking-tight">The Engineering Solution</h2>
              </div>
              <p className="font-sans text-sm leading-relaxed text-neutral-600 md:text-base dark:text-neutral-400">{caseStudy.solution}</p>
            </div>
          </div>

          {/* Spacer right column */}
          <div className="hidden lg:col-span-4 lg:block" />
        </div>

        {/* Core Implementation Features - Full Width 3-Column Grid */}
        <div className="space-y-6 border-t border-dashed border-neutral-200 pt-10 dark:border-neutral-800">
          <div className="mb-4 flex items-center gap-2 text-foreground">
            <Cpu className="size-5 text-neutral-400" />
            <h2 className="font-sans text-xl font-bold tracking-tight">Key Technical Features</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {caseStudy.features.map((feature, idx) => (
              <div
                key={idx}
                className="hover:border-neutral-450 border border-dashed border-neutral-300 bg-neutral-50 p-5 transition-colors duration-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/60 dark:hover:bg-neutral-900/90"
              >
                <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                  <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">0{idx + 1}.</span>
                  {feature.title}
                </h4>
                <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
