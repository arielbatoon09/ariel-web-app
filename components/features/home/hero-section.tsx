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
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000 ease-out">
          {/* Availability Badge - Clean corporate styling, hoverable with pixel-perfect centered ping */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 border border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-900/50 text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-foreground hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/50 transition-all duration-300 cursor-pointer select-none group/badge">
            <span className="relative flex h-2 w-2 items-center justify-center flex-shrink-0">
              <span className="animate-ping absolute h-2 w-2 rounded-full bg-emerald-400/80 dark:bg-emerald-300/80 opacity-75 group-hover/badge:scale-125 transition-transform duration-300"></span>
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
            </span>
            <span>Open to opportunities & collaborations</span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight text-foreground font-sans leading-[1.1] max-w-3xl">
              Hi, I'm Ariel Batoon. I build high-performance software.
            </h1>
            <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed max-w-2xl">
              I am a Full-Stack Engineer. I partner with ambitious startups and businesses to engineer, optimize, and launch high-performance web applications, custom software, mobile apps, and AI solutions from concept to scale.
            </p>
          </div>

          {/* CTAs with balanced size square buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <ConnectDialog>
              <Button 
                size="lg" 
                className="rounded-none px-6 h-11 text-sm font-medium flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                Let's talk
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </ConnectDialog>
            <Link href="#work">
              <Button variant="outline" size="lg" className="rounded-none px-6 h-11 text-sm font-medium flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-50 dark:hover:bg-neutral-900">
                View my work
              </Button>
            </Link>
          </div>
        </div>

        {/* Offerings Grid - Formatted as an architectural grid using the common reusable GridCard component */}
        <div className="pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-700 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 ease-out">
          <div className="space-y-6">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 block">
              What I Can Do
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-dashed border-neutral-300 dark:border-neutral-700">
              {/* Websites */}
              <GridCard
                icon={<Globe className="size-4 group-hover:rotate-12 transition-transform duration-300" />}
                title="Websites & Web Apps"
                titleClassName="text-xs font-mono font-bold uppercase tracking-wider"
                description="Building responsive, blazing-fast, and search-optimized web platforms built on modern architectures for maximum speed and scale."
              />

              {/* Custom Software */}
              <GridCard
                icon={<Cpu className="size-4 group-hover:scale-110 transition-transform duration-300" />}
                title="Custom Software"
                titleClassName="text-xs font-mono font-bold uppercase tracking-wider"
                description="Developing secure backend systems, robust APIs, and custom administrative tools engineered to scale with your business operations."
              />

              {/* Mobile Apps */}
              <GridCard
                icon={<Smartphone className="size-4 group-hover:translate-y-[-2px] transition-transform duration-300" />}
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
