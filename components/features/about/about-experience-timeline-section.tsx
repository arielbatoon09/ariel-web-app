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
        
        <div className="relative border-l border-dashed border-neutral-300 dark:border-neutral-700 ml-3 pl-8 space-y-12">
          {EXPERIENCES.map((exp, index) => {
            const isPresent = exp.period.toLowerCase().includes("present");
            return (
              <div key={index} className="relative group space-y-4">
                {/* Timeline node marker - perfectly centered on line */}
                <span className={cn(
                  "absolute -left-10 top-1 size-4 flex items-center justify-center text-[8px] font-bold select-none transition-all duration-300 border border-dashed",
                  isPresent 
                    ? "border-neutral-900 dark:border-white text-white dark:text-black bg-neutral-900 dark:bg-white border-solid scale-105"
                    : "bg-background border-neutral-400 dark:border-neutral-600 text-neutral-400 dark:text-neutral-500",
                  "group-hover:border-neutral-900 dark:group-hover:border-white group-hover:text-foreground group-hover:bg-neutral-50 dark:group-hover:bg-neutral-900 group-hover:scale-110"
                )}>
                  +
                </span>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h4 className="text-base font-bold text-foreground font-sans group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-250">
                        {exp.company}
                      </h4>
                    </div>
                    {isPresent ? (
                      <span className="text-[10px] font-mono border border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black px-2.5 py-0.5 uppercase tracking-wider font-bold select-none transition-all duration-300">
                        Present
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono border border-dashed border-neutral-300 dark:border-neutral-700 px-2 py-0.5 text-neutral-500 uppercase w-fit select-none">
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
                          "space-y-3 relative",
                          rIdx > 0 && "border-t border-dashed border-neutral-250 dark:border-neutral-800 pt-6 mt-6"
                        )}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h5 className="text-sm font-bold text-foreground/80 font-sans">{role.title}</h5>
                          <span className="text-[9px] font-mono text-neutral-455">{role.period}</span>
                        </div>
                        
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans max-w-3xl">
                          {role.description}
                        </p>
                        
                        {/* Highlights list */}
                        <div className="space-y-1.5 pl-1.5">
                          {role.highlights.map((highlight, hIdx) => (
                            <div 
                              key={hIdx} 
                              className="flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-405 leading-relaxed font-sans"
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
