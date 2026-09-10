import { FileText } from "lucide-react";
import { Section } from "@/components/common/section";
import { ShareButtons } from "@/components/features/public/articles/share-buttons";
import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/constants/projects";

interface CaseStudyOutcomesProps {
  caseStudy: CaseStudy;
  title: string;
}

/** Pick a column count that avoids a lonely leftover item in the last column. */
function getImpactColumnCount(count: number) {
  if (count <= 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  if (count === 4 || count === 5) return 2; // 2+2 or 3+2 instead of 3+1 / 2+2+1
  return 3; // 6+ fills evenly in threes
}

export function CaseStudyOutcomes({ caseStudy, title }: CaseStudyOutcomesProps) {
  const results = caseStudy.results || [];
  const columnCount = getImpactColumnCount(results.length);

  return (
    <Section id="cs-outcomes" containerClassName="py-12 md:py-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        {results.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-foreground">
              <FileText className="size-4.5 text-neutral-400" />
              <h3 className="font-mono text-sm tracking-wider uppercase">Measurable Impact</h3>
            </div>

            <ul
              className={cn(
                "gap-x-10 [column-fill:_balance]",
                columnCount === 1 && "columns-1",
                columnCount === 2 && "columns-1 sm:columns-2",
                columnCount === 3 && "columns-1 sm:columns-2 lg:columns-3"
              )}
            >
              {results.map((result, index) => (
                <li key={index} className="mb-4 flex break-inside-avoid items-start gap-3 last:mb-0">
                  <div className="mt-2 size-1.5 flex-shrink-0 rounded-full bg-neutral-900 dark:bg-neutral-100" />
                  <p className="text-xs leading-relaxed text-neutral-600 md:text-sm dark:text-neutral-400">{result}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <ShareButtons title={title} label="Share this project:" />
      </div>
    </Section>
  );
}
