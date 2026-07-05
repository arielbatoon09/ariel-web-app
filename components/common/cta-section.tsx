"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectDialog } from "@/components/common/connect-dialog";

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
    <div className={cn(
      "relative overflow-hidden border border-dashed border-neutral-300 dark:border-neutral-700 p-10 md:p-12 text-center space-y-6 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 dark:from-indigo-950/15 dark:via-purple-950/10 dark:to-pink-950/15 group",
      className
    )}>
      {/* Subtle Radial Glow Effects */}
      <div className="absolute -top-24 -left-24 size-48 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 size-48 rounded-full bg-pink-500/10 dark:bg-pink-500/15 blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
      
      <div className="relative z-10 space-y-4">
        <div className="flex justify-center">
          <span className="text-[9px] font-mono tracking-widest text-indigo-650 dark:text-indigo-400 uppercase font-bold bg-indigo-50/80 dark:bg-indigo-950/50 px-2.5 py-1 border border-indigo-100 dark:border-indigo-900/50">
            {badge}
          </span>
        </div>
        <h3 className="text-lg md:text-xl font-bold font-sans tracking-tight text-foreground max-w-lg mx-auto">
          {title}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
        <div className="pt-2 flex justify-center">
          <ConnectDialog>
            <Button 
              size="lg" 
              className="rounded-none font-mono text-xs uppercase tracking-wider cursor-pointer h-11 px-8 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-black border border-neutral-900 dark:border-white shadow-[0_4px_20px_rgba(99,102,241,0.1)] dark:shadow-[0_4px_20px_rgba(244,63,94,0.1)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.25)] dark:hover:shadow-[0_4px_25px_rgba(244,63,94,0.25)] transition-all duration-300 hover:-translate-y-0.5"
            >
              {buttonText}
              <ArrowUpRight className="ml-1.5 size-4" />
            </Button>
          </ConnectDialog>
        </div>
      </div>
    </div>
  );
}
