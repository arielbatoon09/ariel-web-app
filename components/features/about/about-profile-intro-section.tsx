import Image from "next/image";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";

export function AboutProfileIntroSection() {
  return (
    <Section id="about-intro" containerClassName="pt-6 md:pt-10 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-16">
        {/* Header Title */}
        <SectionHeading
          label="About Me"
          title="Ariel Batoon. Software Engineer & Product Builder."
          description="A detailed look at my experience, technical skillset, philosophy, and professional background."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-stretch pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-700">
          {/* Profile Image Column (Left) */}
          <div className="lg:col-span-5 relative group flex flex-col justify-stretch">
            <div className="absolute inset-[-8px] border border-dashed border-neutral-200 dark:border-neutral-800 rounded-none pointer-events-none group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-colors duration-300 z-10" />
            <div className="absolute top-[-8px] right-[-8px] select-none pointer-events-none text-[10px] font-light text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-hover:scale-150 transition-all duration-300 z-20">
              +
            </div>
            <div className="absolute bottom-[-8px] right-[-8px] select-none pointer-events-none text-[10px] font-light text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-hover:scale-150 transition-all duration-300 z-20">
              +
            </div>
            
            <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-full min-h-[400px] overflow-hidden bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-none flex-1">
              <Image
                src="/ariel-batoon-profile-day.png"
                alt="Ariel Batoon Profile (Light Mode)"
                fill
                sizes="(max-w-768px) 100vw, 40vw"
                className="object-cover block dark:hidden"
                priority
              />
              <Image
                src="/ariel-batoon-profile-night.png"
                alt="Ariel Batoon Profile (Dark Mode)"
                fill
                sizes="(max-w-768px) 100vw, 40vw"
                className="object-cover hidden dark:block"
                priority
              />
            </div>
          </div>

          {/* Biography Content Column (Right) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground font-sans tracking-tight">
                Crafting robust software architectures with absolute clarity.
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                I am a Full-Stack Engineer specializing in constructing scalable, modern digital environments. Over the past 3+ years, I have worked across diverse paradigms, engineering frontend systems, responsive web dashboards, relational and non-relational database systems, and mobile applications.
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                My approach is rooted in collaborative engineering. I act as an extension of a founder's vision—translating nebulous product ideas into comprehensive technical specifications, implementing features on schedule, and maintaining high code standards.
              </p>
            </div>

            {/* Core Values / Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 relative mt-6 pt-6 border-t border-dashed border-neutral-200 dark:border-neutral-800 gap-y-6 sm:gap-y-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none text-[11px] font-light text-neutral-400 dark:text-neutral-500 bg-background px-1 hidden sm:block z-10">
                +
              </div>

              <div className="sm:border-r sm:border-b sm:border-dashed sm:border-neutral-200 sm:dark:border-neutral-800 pb-6 sm:pr-6 space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  3+ Years Experience
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                  Active engineering across both corporate departments and independent freelance products.
                </p>
              </div>

              <div className="sm:border-b sm:border-dashed sm:border-neutral-200 sm:dark:border-neutral-800 pb-6 sm:pl-6 space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  20+ Completed Projects
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                  Successfully delivering full-stack platforms, custom systems, and mobile applications.
                </p>
              </div>

              <div className="sm:border-r sm:border-dashed sm:border-neutral-200 sm:dark:border-neutral-800 pt-6 sm:pr-6 space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  Full-Stack Architecture
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                  Engineering secure backends, robust database structures, and snappy frontend interfaces.
                </p>
              </div>

              <div className="pt-6 sm:pl-6 space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  Execution & Transparency
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                  Locking down project scope, holding weekly syncs, and deploying high-uptime software.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
