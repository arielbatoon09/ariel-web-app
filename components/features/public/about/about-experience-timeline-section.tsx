import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { EXPERIENCES } from "@/constants/about";

export function AboutExperienceTimelineSection() {
  return (
    <Section id="about-experience" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        <SectionHeading icon={<Briefcase className="size-5" />} title="Work Experience" variant="sub" />

        <div className="relative ml-3 space-y-12 border-l border-dashed border-neutral-300 pl-8 dark:border-neutral-700">
          {EXPERIENCES.map((exp, index) => {
            const isPresent = exp.period.toLowerCase().includes("present");
            return (
              <div key={index} className="group relative space-y-4">
                {/* Timeline node marker - perfectly centered on line */}
                <span
                  className={cn(
                    "absolute top-1 -left-10 flex size-4 items-center justify-center border border-dashed text-[8px] font-bold transition-all duration-300 select-none",
                    isPresent
                      ? "scale-105 border-solid border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-neutral-400 bg-background text-neutral-400 dark:border-neutral-600 dark:text-neutral-500",
                    "group-hover:scale-110 group-hover:border-neutral-900 group-hover:bg-neutral-50 group-hover:text-foreground dark:group-hover:border-white dark:group-hover:bg-neutral-900"
                  )}
                >
                  +
                </span>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="font-sans text-base font-bold text-foreground transition-colors duration-250 group-hover:text-neutral-900 dark:group-hover:text-white">
                        {exp.company}
                      </h4>
                    </div>
                    {isPresent ? (
                      <span className="border border-neutral-900 bg-neutral-900 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-white uppercase transition-all duration-300 select-none dark:border-white dark:bg-white dark:text-black">
                        Present
                      </span>
                    ) : (
                      <span className="w-fit border border-dashed border-neutral-300 px-2 py-0.5 font-mono text-[10px] text-neutral-500 uppercase select-none dark:border-neutral-700">
                        {exp.period}
                      </span>
                    )}
                  </div>

                  {/* Roles layout */}
                  <div className="space-y-6 pt-2">
                    {exp.roles.map((role, rIdx) => (
                      <div
                        key={rIdx}
                        className={cn(
                          "relative space-y-3",
                          rIdx > 0 && "border-neutral-250 mt-6 border-t border-dashed pt-6 dark:border-neutral-800"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-sans text-sm font-bold text-foreground/80">{role.title}</h5>
                          <span className="text-neutral-455 font-mono text-[9px]">{role.period}</span>
                        </div>

                        <p className="max-w-3xl font-sans text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{role.description}</p>

                        {/* Highlights list */}
                        <div className="space-y-1.5 pl-1.5">
                          {role.highlights.map((highlight, hIdx) => (
                            <div
                              key={hIdx}
                              className="dark:text-neutral-405 flex items-start gap-2 font-sans text-xs leading-relaxed text-neutral-500"
                            >
                              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
