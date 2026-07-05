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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Challenge & Solution */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <Target className="size-5 text-neutral-400" />
                <h2 className="text-xl font-bold tracking-tight font-sans">
                  The Challenge
                </h2>
              </div>
              <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                {caseStudy.challenge}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="size-5 text-neutral-400" />
                <h2 className="text-xl font-bold tracking-tight font-sans">
                  The Engineering Solution
                </h2>
              </div>
              <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                {caseStudy.solution}
              </p>
            </div>
          </div>

          {/* Spacer right column */}
          <div className="lg:col-span-4 hidden lg:block" />
        </div>

        {/* Core Implementation Features - Full Width 3-Column Grid */}
        <div className="space-y-6 pt-10 border-t border-dashed border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-foreground mb-4">
            <Cpu className="size-5 text-neutral-400" />
            <h2 className="text-xl font-bold tracking-tight font-sans">
              Key Technical Features
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {caseStudy.features.map((feature, idx) => (
              <div key={idx} className="p-5 border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-900/90 hover:border-neutral-450 transition-colors duration-300">
                <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">0{idx + 1}.</span>
                  {feature.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
