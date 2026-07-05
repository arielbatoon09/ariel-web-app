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
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="flex items-center gap-2 text-foreground">
            <FileText className="size-4.5 text-neutral-400" />
            <h3 className="font-mono text-sm tracking-wider uppercase">Measurable Impact</h3>
          </div>

          <div className="space-y-4">
            {caseStudy.results.map((result, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-2 size-1.5 flex-shrink-0 rounded-full bg-neutral-900 dark:bg-neutral-100" />
                <p className="text-xs leading-relaxed text-neutral-600 md:text-sm dark:text-neutral-400">{result}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Business outcomes panel */}
        <div className="self-start lg:col-span-4 lg:border-l lg:border-dashed lg:border-neutral-300 lg:pl-8 lg:dark:border-neutral-700">
          <div className="space-y-4 border border-dashed border-neutral-300 bg-neutral-50 p-6 transition-colors duration-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/60 dark:hover:bg-neutral-900/90">
            <h4 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">Need a similar system?</h4>
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              I specialize in engineering performance-optimized applications configured to solve specific operational bottlenecks.
            </p>
            <div className="pt-1">
              <ConnectDialog>
                <Button className="h-10 w-full cursor-pointer rounded-none font-mono text-xs tracking-wider uppercase">Let&apos;s Build It</Button>
              </ConnectDialog>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
