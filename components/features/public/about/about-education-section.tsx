import { GraduationCap } from "lucide-react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GridCard } from "@/components/common/grid-card";

export function AboutEducationSection() {
  return (
    <Section id="about-education" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        <SectionHeading icon={<GraduationCap className="size-5" />} title="Education" variant="sub" />

        <GridCard className="w-full space-y-2 border border-dashed border-neutral-300 p-5 md:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h4 className="font-sans text-sm font-bold text-foreground">Bachelor of Science in Information Technology</h4>
              <p className="font-mono text-xs tracking-wide text-neutral-400">Specialization in Software Engineering</p>
            </div>
            <span className="w-fit border border-dashed border-neutral-300 px-2 py-0.5 font-mono text-[10px] text-neutral-500 uppercase dark:border-neutral-700">
              Graduated
            </span>
          </div>
          <p className="pt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Focus on systems analysis, database design structures, object-oriented concepts, and project management. Completed advanced electives in
            secure application architecture and web-based solutions.
          </p>
        </GridCard>
      </div>
    </Section>
  );
}
