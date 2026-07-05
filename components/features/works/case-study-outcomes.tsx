import { FileText } from "lucide-react";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { ConnectDialog } from "@/components/common/connect-dialog";
import type { CaseStudy } from "@/constants/projects";

interface CaseStudyOutcomesProps {
  caseStudy: CaseStudy;
}

export function CaseStudyOutcomes({ caseStudy }: CaseStudyOutcomesProps) {
  return (
    <Section id="cs-outcomes" containerClassName="py-12 md:py-16" showTopLine={false} showBottomLine={true}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-2 text-foreground">
            <FileText className="size-4.5 text-neutral-400" />
            <h3 className="text-sm font-mono uppercase tracking-wider">
              Measurable Impact
            </h3>
          </div>

          <div className="space-y-4">
            {caseStudy.results.map((result, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="size-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100 mt-2 flex-shrink-0" />
                <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {result}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Business outcomes panel */}
        <div className="lg:col-span-4 lg:border-l lg:border-dashed lg:border-neutral-300 lg:dark:border-neutral-700 lg:pl-8 self-start">
          <div className="p-6 border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-900/90 transition-colors duration-300 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-foreground">
              Need a similar system?
            </h4>
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              I specialize in engineering performance-optimized applications configured to solve specific operational bottlenecks.
            </p>
            <div className="pt-1">
              <ConnectDialog>
                <Button className="w-full rounded-none h-10 text-xs font-mono uppercase tracking-wider cursor-pointer">
                  Let's Build It
                </Button>
              </ConnectDialog>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
