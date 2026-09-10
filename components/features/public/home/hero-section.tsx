"use client";

import { Section } from "@/components/common/section";
import { GridCard } from "@/components/common/grid-card";
import { Button } from "@/components/ui/button";
import { Globe, Cpu, Smartphone, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ConnectDialog } from "@/components/common/connect-dialog";
import { HeroIdentity } from "./hero-identity";
import { SoftwareEngineerSelect } from "./software-engineer-select";

export function HeroSection() {
  return (
    <Section containerClassName="pt-6 md:pt-10 pb-4 md:pb-8" showBottomLine={true} showTopLine={false}>
      <div className="space-y-20 lg:space-y-24">
        {/* Hero Content Section */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Left Column (Copy and CTAs) */}
          <div className="mx-auto flex max-w-xl animate-in flex-col items-center space-y-8 duration-1000 ease-out fade-in slide-in-from-top-4 lg:col-span-6 lg:mx-0 lg:items-start">
            {/* Availability Badge */}
            <div className="group/badge inline-flex items-center gap-2.5 border border-neutral-200/50 bg-neutral-50 px-3 py-1 font-mono text-[10px] tracking-wider text-neutral-500 uppercase transition-all duration-300 select-none hover:border-neutral-300 hover:bg-neutral-100/60 hover:text-foreground dark:border-neutral-800/50 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/50">
              <span className="relative flex h-2 w-2 flex-shrink-0 items-center justify-center">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400/80 opacity-75 transition-transform duration-300 group-hover/badge:scale-125 dark:bg-emerald-300/80"></span>
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
              </span>
              <span>Open to opportunities & collaborations</span>
            </div>

            {/* Heading */}
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="w-full font-sans text-4xl leading-[1.15] font-bold tracking-tight text-foreground md:text-5xl lg:max-w-2xl lg:text-[3rem]">
                Hi, I&apos;m Ariel Batoon. <br className="hidden sm:inline" />
                <SoftwareEngineerSelect />
              </h1>
              <p className="w-full font-sans text-base leading-relaxed text-neutral-500 md:text-lg lg:max-w-[490px] dark:text-neutral-400">
                Engineering scalable software, from web and mobile applications to backend infrastructure and AI-powered solutions.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex w-full flex-col items-stretch justify-center gap-4 pt-2 sm:w-auto sm:flex-row sm:items-center lg:justify-start">
              <ConnectDialog>
                <Button
                  size="lg"
                  className="flex h-11 w-full cursor-pointer items-center justify-center rounded-none px-6 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 sm:w-auto"
                >
                  Let&apos;s talk
                  <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </ConnectDialog>
              <Link href="/works" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex h-11 w-full items-center justify-center rounded-none px-6 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-50 sm:w-auto dark:hover:bg-neutral-900"
                >
                  View my work
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column — identity portrait */}
          <HeroIdentity />
        </div>

        {/* Offerings Grid */}
        <div className="animate-in border-t border-dashed border-neutral-300 pt-8 delay-200 duration-1000 ease-out fade-in slide-in-from-bottom-4 dark:border-neutral-700">
          <div className="space-y-6">
            <span className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase dark:text-neutral-500">What I Can Do</span>

            <div className="grid grid-cols-1 border-t border-l border-dashed border-neutral-300 sm:grid-cols-2 lg:grid-cols-4 dark:border-neutral-700">
              <GridCard
                icon={<Globe className="size-4 transition-transform duration-300 group-hover:rotate-12" />}
                title="Websites & Web Apps"
                titleClassName="text-xs font-mono font-bold uppercase tracking-wider"
                description="Building responsive, blazing-fast, and search-optimized web platforms built on modern architectures for maximum speed and scale."
              />

              <GridCard
                icon={<Cpu className="size-4 transition-transform duration-300 group-hover:scale-110" />}
                title="Custom Software"
                titleClassName="text-xs font-mono font-bold uppercase tracking-wider"
                description="Developing secure backend systems, robust APIs, and custom administrative tools engineered to scale with your business operations."
              />

              <GridCard
                icon={<Smartphone className="size-4 transition-transform duration-300 group-hover:translate-y-[-2px]" />}
                title="Mobile Development"
                titleClassName="text-xs font-mono font-bold uppercase tracking-wider"
                description="Designing and engineering high-performance iOS and Android mobile applications built on robust, native architecture."
              />

              <GridCard
                icon={<Brain className="size-4 group-hover:animate-pulse" />}
                title="Generative AI"
                titleClassName="text-xs font-mono font-bold uppercase tracking-wider"
                description="Build AI-powered MVPs with intelligent chat, content generation, workflow automation, and seamless LLM integrations."
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
