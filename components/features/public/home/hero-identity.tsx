"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function HeroIdentity() {
  return (
    <div className="relative mx-auto flex w-full max-w-md items-center justify-center py-2 sm:max-w-lg lg:col-span-6 lg:mx-0 lg:max-w-none lg:justify-end lg:py-4 lg:pr-0 lg:pl-8">
      <div className="relative w-full max-w-[22rem] sm:max-w-md">
        {/* Outer dashed frame */}
        <div className="pointer-events-none absolute -inset-2 border border-dashed border-neutral-300 sm:-inset-3 dark:border-neutral-700" />
        <div className="pointer-events-none absolute -top-2 -left-2 z-20 bg-background px-1 font-mono text-[10px] text-neutral-400 sm:-top-3 sm:-left-3 dark:text-neutral-600">
          +
        </div>
        <div className="pointer-events-none absolute -top-2 -right-2 z-20 bg-background px-1 font-mono text-[10px] text-neutral-400 sm:-top-3 sm:-right-3 dark:text-neutral-600">
          +
        </div>
        <div className="pointer-events-none absolute -bottom-2 -left-2 z-20 bg-background px-1 font-mono text-[10px] text-neutral-400 sm:-bottom-3 sm:-left-3 dark:text-neutral-600">
          +
        </div>
        <div className="pointer-events-none absolute -right-2 -bottom-2 z-20 bg-background px-1 font-mono text-[10px] text-neutral-400 sm:-right-3 sm:-bottom-3 dark:text-neutral-600">
          +
        </div>

        {/* Corner brackets */}
        <div className="pointer-events-none absolute -top-px -left-px z-30 size-3 border-t-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -top-px -right-px z-30 size-3 border-t-2 border-r-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -bottom-px -left-px z-30 size-3 border-b-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -right-px -bottom-px z-30 size-3 border-r-2 border-b-2 border-neutral-400 dark:border-neutral-500" />

        <div className="relative aspect-[4/5] overflow-hidden border border-neutral-200 bg-neutral-100 sm:aspect-[3/4] dark:border-neutral-800 dark:bg-neutral-900">
          <Image
            src="/ariel-batoon-profile-day.png"
            alt="Ariel Batoon"
            fill
            sizes="(max-width: 1024px) 90vw, 28vw"
            className="object-cover object-[center_18%] dark:hidden"
            priority
          />
          <Image
            src="/ariel-batoon-profile-night.png"
            alt="Ariel Batoon"
            fill
            sizes="(max-width: 1024px) 90vw, 28vw"
            className="hidden object-cover object-[center_18%] dark:block"
            priority
          />

          {/* Soft vignette only */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/80" />

          {/* Single subtle scan line */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 z-10 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
            animate={{ top: ["8%", "72%"] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "linear", repeatDelay: 1.2 }}
          />

          {/* Minimal status */}
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-3 sm:p-4">
            <div className="inline-flex items-center gap-2 border border-white/15 bg-black/40 px-2.5 py-1 backdrop-blur-sm">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative size-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.18em] text-white uppercase">Online</span>
            </div>
            <span className="font-mono text-[10px] tracking-wider text-white/70">01</span>
          </div>

          {/* Identity plate */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4">
            <div className="border border-neutral-800/20 bg-neutral-950/80 p-3.5 backdrop-blur-md sm:p-4 dark:border-white/15 dark:bg-black/55">
              <p className="font-mono text-[10px] tracking-[0.2em] text-neutral-300 uppercase dark:text-white/55">Identity</p>
              <p className="mt-1.5 font-sans text-xl font-bold tracking-tight text-white sm:text-2xl">Ariel Batoon</p>
              <p className="mt-1 font-mono text-xs tracking-wide text-neutral-100 sm:text-[13px]">Software Engineer · Indie Builder</p>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-dashed border-white/25 pt-3 font-mono text-[10px] tracking-wider text-neutral-200 uppercase dark:text-white/80">
                <span>Full-Stack</span>
                <span className="text-white/40">/</span>
                <span>AI</span>
                <span className="text-white/40">/</span>
                <span>Mobile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
