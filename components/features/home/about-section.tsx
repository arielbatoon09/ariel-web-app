import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function AboutSection() {
  return (
    <Section id="about" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        {/* Reusable Section Heading */}
        <SectionHeading
          label="About Me"
          title="Meet Ariel Batoon"
        />

        {/* 2-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-700">
          
          {/* Profile Image Column (Left) */}
          <div className="lg:col-span-5 relative group">
            {/* Dashed outer alignment frame with corner plus markers (Square corners, no rounding) */}
            <div className="absolute inset-[-8px] border border-dashed border-neutral-200 dark:border-neutral-800 rounded-none pointer-events-none group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-colors duration-300 z-10" />
            <div className="absolute top-[-8px] right-[-8px] select-none pointer-events-none text-[10px] font-light text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-hover:scale-150 transition-all duration-300 z-20">
              +
            </div>
            <div className="absolute bottom-[-8px] right-[-8px] select-none pointer-events-none text-[10px] font-light text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-hover:scale-150 transition-all duration-300 z-20">
              +
            </div>
            
            {/* Aspect Ratio Container for Profile Image */}
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-none">
              {/* Light Mode Profile Image (Shows Day Profile) - Natural colors */}
              <Image
                src="/ariel-batoon-profile-day.png"
                alt="Ariel Batoon Profile (Light Mode)"
                fill
                sizes="(max-w-768px) 100vw, 40vw"
                className="object-cover block dark:hidden"
                priority
              />
              {/* Dark Mode Profile Image (Shows Night Profile) - Natural colors */}
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
                Engineering high-performance solutions for complex business workflows.
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                I am a Full-Stack Engineer dedicated to building robust, modern, and highly scalable digital systems. With deep competency across front-end rendering engines, secure cloud databases, API integrations, and native mobile builds, I build software that runs seamlessly and delivers measurable business value.
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Rather than working on generic assumptions, I believe in collaborative engineering—partnering directly with startup founders and product teams to translate commercial objectives into strict technical specifications, maintaining absolute transparency at every milestone.
              </p>
            </div>

            {/* Core Values / Professional Highlights - Clean Intersecting Cross Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 relative mt-6 pt-6 border-t border-dashed border-neutral-200 dark:border-neutral-800 gap-y-6 sm:gap-y-0">
              {/* Intersection Center Plus (+) Symbol */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none text-[11px] font-light text-neutral-400 dark:text-neutral-500 bg-background px-1 hidden sm:block z-10">
                +
              </div>

              {/* Stat 1: 3+ Years */}
              <div className="sm:border-r sm:border-b sm:border-dashed sm:border-neutral-200 sm:dark:border-neutral-800 pb-6 sm:pr-6 space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  3+ Years Experience
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Active engineering across both corporate departments and independent freelance products.
                </p>
              </div>

              {/* Stat 2: 20+ Projects */}
              <div className="sm:border-b sm:border-dashed sm:border-neutral-200 sm:dark:border-neutral-800 pb-6 sm:pl-6 space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  20+ Completed Projects
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Successfully delivering full-stack platforms, custom systems, and mobile applications.
                </p>
              </div>

              {/* Detail 3: Full-Stack */}
              <div className="sm:border-r sm:border-dashed sm:border-neutral-200 sm:dark:border-neutral-800 pt-6 sm:pr-6 space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  Full-Stack Architecture
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Engineering secure backends, robust database structures, and snappy frontend interfaces.
                </p>
              </div>

              {/* Detail 4: Transparency */}
              <div className="pt-6 sm:pl-6 space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  Execution & Transparency
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Locking down project scope, holding weekly syncs, and deploying high-uptime software.
                </p>
              </div>
            </div>

            {/* CTA Button Block */}
            <div className="pt-4">
              <Link href="#contact">
                <Button size="lg" className="rounded-none px-6 h-11 text-sm font-medium flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5">
                  Work With Me
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </Section>
  );
}
