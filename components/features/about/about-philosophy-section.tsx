import { Cpu } from "lucide-react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { PHILOSOPHIES, lucideIconMap } from "@/constants/about";

export function AboutPhilosophySection() {
  return (
    <Section id="about-philosophy" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        <SectionHeading icon={<Cpu className="size-5" />} title="Engineering Philosophy" variant="sub" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PHILOSOPHIES.map((phi, idx) => {
            const IconComponent = lucideIconMap[phi.iconName] || Cpu;
            return (
              <div key={idx} className="border border-dashed border-neutral-300 dark:border-neutral-700 p-6 bg-neutral-50 dark:bg-neutral-900/60 space-y-3 flex items-start gap-4">
                <div className="p-2 border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-950/20 shrink-0">
                  <IconComponent className="size-5 text-neutral-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold font-sans text-foreground">{phi.title}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">{phi.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
