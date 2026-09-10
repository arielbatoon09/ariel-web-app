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
          "group relative space-y-6 overflow-hidden border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center md:p-8 dark:border-neutral-700 dark:bg-neutral-900/60",
          className
        )}
      >
        <div className="pointer-events-none absolute -top-px -left-px size-2.5 border-t-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -top-px -right-px size-2.5 border-t-2 border-r-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -bottom-px -left-px size-2.5 border-b-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -right-px -bottom-px size-2.5 border-r-2 border-b-2 border-neutral-400 dark:border-neutral-500" />

        <div className="relative z-10 space-y-4">
          <div className="flex justify-center">
            <span className="border border-dashed border-neutral-300 bg-background px-2.5 py-1 font-mono text-[9px] font-bold tracking-widest text-neutral-500 uppercase dark:border-neutral-700 dark:text-neutral-400">
              {badge}
            </span>
          </div>
          <h3 className="mx-auto max-w-lg font-sans text-lg font-bold tracking-tight text-foreground md:text-xl">{title}</h3>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{description}</p>
          <div className="flex justify-center pt-2">
            <ConnectDialog>
              <Button
                size="lg"
                className="h-11 cursor-pointer rounded-none border border-neutral-900 bg-neutral-900 px-8 font-mono text-xs tracking-wider text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-100"
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
