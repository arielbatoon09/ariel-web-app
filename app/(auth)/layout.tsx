"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative Grid System */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Left vertical line */}
        <div className="absolute top-0 bottom-0 left-6 w-0 border-l border-dashed border-neutral-200 md:left-8 dark:border-neutral-800" />
        {/* Right vertical line */}
        <div className="absolute top-0 right-6 bottom-0 w-0 border-l border-dashed border-neutral-200 md:right-8 dark:border-neutral-800" />
        {/* Top horizontal line */}
        <div className="absolute top-16 right-0 left-0 h-0 border-t border-dashed border-neutral-200 dark:border-neutral-800" />

        {/* Intersecting Plus (+) symbols */}
        <div className="absolute top-16 left-6 z-10 -translate-x-1/2 -translate-y-1/2 bg-background px-1 text-xs font-light text-neutral-400/80 select-none md:left-8 dark:text-neutral-600/80">
          +
        </div>
        <div className="absolute top-16 right-6 z-10 translate-x-1/2 -translate-y-1/2 bg-background px-1 text-xs font-light text-neutral-400/80 select-none md:right-8 dark:text-neutral-600/80">
          +
        </div>
      </div>

      {/* Floating Header */}
      <div className="absolute top-6 right-6 left-6 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center space-x-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-[420px] space-y-8">
        {/* Brand/Logo Area */}
        <div className="flex flex-col items-center text-center">
          <Link href="/">
            <div className="relative flex h-16 items-center justify-center">
              <Image
                src="/icons/ab-logo-text-dark.png"
                className="block h-28 w-auto object-contain dark:hidden"
                alt="ab logo"
                width={200}
                height={200}
                style={{ width: "auto" }}
                priority
              />
              <Image
                src="/icons/ab-logo-text-white.png"
                className="hidden h-16 w-auto object-contain dark:block"
                alt="ab logo"
                width={160}
                height={160}
                style={{ width: "auto" }}
                priority
              />
            </div>
          </Link>
        </div>

        {/* Content Container with dashed borders */}
        <div className="relative border border-dashed border-neutral-200 bg-white/85 p-8 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/60">
          {/* Plus signs on card corners */}
          <div className="pointer-events-none absolute -top-1.5 -left-1.5 z-10 bg-background px-0.5 text-[10px] text-neutral-400/80 dark:text-neutral-600/80">
            +
          </div>
          <div className="pointer-events-none absolute -top-1.5 -right-1.5 z-10 bg-background px-0.5 text-[10px] text-neutral-400/80 dark:text-neutral-600/80">
            +
          </div>
          <div className="pointer-events-none absolute -bottom-1.5 -left-1.5 z-10 bg-background px-0.5 text-[10px] text-neutral-400/80 dark:text-neutral-600/80">
            +
          </div>
          <div className="pointer-events-none absolute -right-1.5 -bottom-1.5 z-10 bg-background px-0.5 text-[10px] text-neutral-400/80 dark:text-neutral-600/80">
            +
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
