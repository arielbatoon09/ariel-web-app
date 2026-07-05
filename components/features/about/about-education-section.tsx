import { GraduationCap } from "lucide-react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";

export function AboutEducationSection() {
  return (
    <Section id="about-education" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        <SectionHeading icon={<GraduationCap className="size-5" />} title="Education" variant="sub" />

        <div className="border border-dashed border-neutral-300 dark:border-neutral-700 p-6 max-w-3xl space-y-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
            <div>
              <h4 className="text-sm font-bold text-foreground font-sans">Bachelor of Science in Information Technology</h4>
              <p className="text-xs text-neutral-400 font-mono tracking-wide">Specialization in Software Engineering</p>
            </div>
            <span className="text-[10px] font-mono border border-dashed border-neutral-300 dark:border-neutral-700 px-2 py-0.5 text-neutral-500 uppercase w-fit">
              Graduated
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed pt-2">
            Focus on systems analysis, database design structures, object-oriented concepts, and project management. Completed advanced electives in secure application architecture and web-based solutions.
          </p>
        </div>
      </div>
    </Section>
  );
}
