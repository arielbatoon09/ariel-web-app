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

        <div className="grid grid-cols-1 items-stretch gap-8 border-t border-dashed border-neutral-300 pt-8 lg:grid-cols-12 lg:gap-16 dark:border-neutral-700">
          {/* Profile Image Column (Left) */}
          <div className="group relative flex flex-col justify-stretch lg:col-span-5">
            <div className="pointer-events-none absolute inset-[-8px] z-10 rounded-none border border-dashed border-neutral-200 transition-colors duration-300 group-hover:border-neutral-300 dark:border-neutral-800 dark:group-hover:border-neutral-700" />
            <div className="pointer-events-none absolute top-[-8px] right-[-8px] z-20 text-[10px] font-light text-neutral-300 transition-all duration-300 select-none group-hover:scale-150 group-hover:text-neutral-600 dark:text-neutral-700 dark:group-hover:text-neutral-400">
              +
            </div>
            <div className="pointer-events-none absolute right-[-8px] bottom-[-8px] z-20 text-[10px] font-light text-neutral-300 transition-all duration-300 select-none group-hover:scale-150 group-hover:text-neutral-600 dark:text-neutral-700 dark:group-hover:text-neutral-400">
              +
            </div>

            <div className="relative aspect-[4/5] min-h-[400px] w-full flex-1 overflow-hidden rounded-none border border-neutral-200 bg-neutral-50 lg:aspect-auto lg:h-full lg:min-h-full dark:border-neutral-800 dark:bg-neutral-900">
              <Image
                src="/ariel-batoon-profile-day.png"
                alt="Ariel Batoon Profile (Light Mode)"
                fill
                sizes="(max-w-768px) 100vw, 40vw"
                className="block object-cover dark:hidden"
                priority
              />
              <Image
                src="/ariel-batoon-profile-night.png"
                alt="Ariel Batoon Profile (Dark Mode)"
                fill
                sizes="(max-w-768px) 100vw, 40vw"
                className="hidden object-cover dark:block"
                priority
              />
            </div>
          </div>

          {/* Biography Content Column (Right) */}
          <div className="space-y-6 lg:col-span-7">
            <div className="space-y-4">
              <h3 className="font-sans text-xl font-bold tracking-tight text-foreground">
                Crafting robust software architectures with absolute clarity.
              </h3>
              <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                I am a Full-Stack Engineer specializing in constructing scalable, modern digital environments. Over the past 3+ years, I have worked
                across diverse paradigms, engineering frontend systems, responsive web dashboards, relational and non-relational database systems, and
                mobile applications.
              </p>
              <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                My approach is rooted in collaborative engineering. I act as an extension of a founder&apos;s vision—translating nebulous product
                ideas into comprehensive technical specifications, implementing features on schedule, and maintaining high code standards.
              </p>
            </div>

            {/* Core Values / Highlights */}
            <div className="relative mt-6 grid grid-cols-1 gap-y-6 border-t border-dashed border-neutral-200 pt-6 sm:grid-cols-2 sm:gap-y-0 dark:border-neutral-800">
              <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 bg-background px-1 text-[11px] font-light text-neutral-400 select-none sm:block dark:text-neutral-500">
                +
              </div>

              <div className="space-y-1.5 pb-6 sm:border-r sm:border-b sm:border-dashed sm:border-neutral-200 sm:pr-6 sm:dark:border-neutral-800">
                <h4 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">3+ Years Experience</h4>
                <p className="font-sans text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Active engineering across both corporate departments and independent freelance products.
                </p>
              </div>

              <div className="space-y-1.5 pb-6 sm:border-b sm:border-dashed sm:border-neutral-200 sm:pl-6 sm:dark:border-neutral-800">
                <h4 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">20+ Completed Projects</h4>
                <p className="font-sans text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Successfully delivering full-stack platforms, custom systems, and mobile applications.
                </p>
              </div>

              <div className="space-y-1.5 pt-6 sm:border-r sm:border-dashed sm:border-neutral-200 sm:pr-6 sm:dark:border-neutral-800">
                <h4 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">Full-Stack Architecture</h4>
                <p className="font-sans text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Engineering secure backends, robust database structures, and snappy frontend interfaces.
                </p>
              </div>

              <div className="space-y-1.5 pt-6 sm:pl-6">
                <h4 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">Execution & Transparency</h4>
                <p className="font-sans text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
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
