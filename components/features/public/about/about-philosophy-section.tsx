import { Cpu } from "lucide-react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { PHILOSOPHIES, lucideIconMap } from "@/constants/about";

export function AboutPhilosophySection() {
  return (
    <Section id="about-philosophy" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        <SectionHeading icon={<Cpu className="size-5" />} title="Engineering Philosophy" variant="sub" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PHILOSOPHIES.map((phi, idx) => {
            const IconComponent = lucideIconMap[phi.iconName] || Cpu;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 space-y-3 border border-dashed border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900/60"
              >
                <div className="shrink-0 border border-dashed border-neutral-300 bg-neutral-100/50 p-2 dark:border-neutral-700 dark:bg-neutral-950/20">
                  <IconComponent className="size-5 text-neutral-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-sans text-sm font-bold text-foreground">{phi.title}</h4>
                  <p className="font-sans text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{phi.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
