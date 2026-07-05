"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectDialog } from "@/components/common/connect-dialog";

import { Section } from "@/components/common/section";

interface CtaSectionProps {
  className?: string;
  badge?: string;
  title?: string;
  description?: string;
  buttonText?: string;
}

export function CtaSection({
  className,
  badge = "Collaboration",
  title = "Let's build something exceptional.",
  description = "Have a project in mind or looking to hire a full-stack engineer? Let's align on scope, deadlines, and technical specifications.",
  buttonText = "Initiate Conversation",
}: CtaSectionProps) {
  return (
    <Section id="cta" containerClassName="py-6 md:py-8" showTopLine={false} showBottomLine={false}>
      <div
        className={cn(
          "group relative space-y-6 overflow-hidden rounded-none bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 p-6 text-center md:p-8 dark:from-indigo-950/15 dark:via-purple-950/10 dark:to-pink-950/15",
          className
        )}
      >
        {/* Subtle Radial Glow Effects */}
        <div className="pointer-events-none absolute -top-24 -left-24 size-48 rounded-full bg-indigo-500/10 blur-3xl transition-transform duration-700 group-hover:scale-125 dark:bg-indigo-500/15" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 size-48 rounded-full bg-pink-500/10 blur-3xl transition-transform duration-700 group-hover:scale-125 dark:bg-pink-500/15" />

        <div className="relative z-10 space-y-4">
          <div className="flex justify-center">
            <span className="text-indigo-650 border border-indigo-100 bg-indigo-50/80 px-2.5 py-1 font-mono text-[9px] font-bold tracking-widest uppercase dark:border-indigo-900/50 dark:bg-indigo-950/50 dark:text-indigo-400">
              {badge}
            </span>
          </div>
          <h3 className="mx-auto max-w-lg font-sans text-lg font-bold tracking-tight text-foreground md:text-xl">{title}</h3>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{description}</p>
          <div className="flex justify-center pt-2">
            <ConnectDialog>
              <Button
                size="lg"
                className="h-11 cursor-pointer rounded-none border border-neutral-900 bg-neutral-900 px-8 font-mono text-xs tracking-wider text-white uppercase shadow-[0_4px_20px_rgba(99,102,241,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-[0_4px_25px_rgba(99,102,241,0.25)] dark:border-white dark:bg-white dark:text-black dark:shadow-[0_4px_20px_rgba(244,63,94,0.1)] dark:hover:bg-neutral-100 dark:hover:shadow-[0_4px_25px_rgba(244,63,94,0.25)]"
              >
                {buttonText}
                <ArrowUpRight className="ml-1.5 size-4" />
              </Button>
            </ConnectDialog>
          </div>
        </div>
      </div>
    </Section>
  );
}
