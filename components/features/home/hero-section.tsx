import { Section } from "@/components/common/section";
import { GridCard } from "@/components/common/grid-card";
import { Button } from "@/components/ui/button";
import { Globe, Cpu, Smartphone, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ConnectDialog } from "@/components/common/connect-dialog";

export function HeroSection() {
  return (
    <Section containerClassName="pt-6 md:pt-10 pb-4 md:pb-8" showBottomLine={true} showTopLine={false}>
      <div className="space-y-16">
        {/* Hero Content Section */}
        <div className="max-w-4xl animate-in space-y-8 duration-1000 ease-out fade-in slide-in-from-top-4">
          {/* Availability Badge - Clean corporate styling, hoverable with pixel-perfect centered ping */}
          <div className="group/badge inline-flex cursor-pointer items-center gap-2.5 border border-neutral-200/50 bg-neutral-50 px-3 py-1 font-mono text-[10px] tracking-wider text-neutral-500 uppercase transition-all duration-300 select-none hover:border-neutral-300 hover:bg-neutral-100/60 hover:text-foreground dark:border-neutral-800/50 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/50">
            <span className="relative flex h-2 w-2 flex-shrink-0 items-center justify-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400/80 opacity-75 transition-transform duration-300 group-hover/badge:scale-125 dark:bg-emerald-300/80"></span>
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
            </span>
            <span>Open to opportunities & collaborations</span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="max-w-3xl font-sans text-4xl leading-[1.1] font-bold tracking-tight text-foreground md:text-5xl lg:text-[56px]">
              Hi, I&apos;m Ariel Batoon. I build high-performance software.
            </h1>
            <p className="max-w-2xl font-sans text-base leading-relaxed text-neutral-500 md:text-lg dark:text-neutral-400">
              I am a Full-Stack Engineer. I partner with ambitious startups and businesses to engineer, optimize, and launch high-performance web
              applications, custom software, mobile apps, and AI solutions from concept to scale.
            </p>
          </div>

          {/* CTAs with balanced size square buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <ConnectDialog>
              <Button
                size="lg"
                className="flex h-11 cursor-pointer items-center justify-center rounded-none px-6 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
              >
                Let&apos;s talk
                <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </ConnectDialog>
            <Link href="#work">
              <Button
                variant="outline"
                size="lg"
                className="flex h-11 items-center justify-center rounded-none px-6 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                View my work
              </Button>
            </Link>
          </div>
        </div>

        {/* Offerings Grid - Formatted as an architectural grid using the common reusable GridCard component */}
        <div className="animate-in border-t border-dashed border-neutral-300 pt-8 delay-200 duration-1000 ease-out fade-in slide-in-from-bottom-4 dark:border-neutral-700">
          <div className="space-y-6">
            <span className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase dark:text-neutral-500">What I Can Do</span>

            <div className="grid grid-cols-1 border-t border-l border-dashed border-neutral-300 sm:grid-cols-2 lg:grid-cols-4 dark:border-neutral-700">
              {/* Websites */}
              <GridCard
                icon={<Globe className="size-4 transition-transform duration-300 group-hover:rotate-12" />}
                title="Websites & Web Apps"
                titleClassName="text-xs font-mono font-bold uppercase tracking-wider"
                description="Building responsive, blazing-fast, and search-optimized web platforms built on modern architectures for maximum speed and scale."
              />

              {/* Custom Software */}
              <GridCard
                icon={<Cpu className="size-4 transition-transform duration-300 group-hover:scale-110" />}
                title="Custom Software"
                titleClassName="text-xs font-mono font-bold uppercase tracking-wider"
                description="Developing secure backend systems, robust APIs, and custom administrative tools engineered to scale with your business operations."
              />

              {/* Mobile Apps */}
              <GridCard
                icon={<Smartphone className="size-4 transition-transform duration-300 group-hover:translate-y-[-2px]" />}
                title="Mobile Development"
                titleClassName="text-xs font-mono font-bold uppercase tracking-wider"
                description="Designing and engineering high-performance iOS and Android mobile applications built on robust, native architecture."
              />

              {/* AI Applications */}
              <GridCard
                icon={<Brain className="size-4 group-hover:animate-pulse" />}
                title="AI Applications"
                titleClassName="text-xs font-mono font-bold uppercase tracking-wider"
                description="Integrating intelligent machine learning capabilities, semantic search systems, and automated agents into your product workflows."
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
