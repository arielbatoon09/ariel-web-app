"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Section } from "@/components/common/section";
import { GridCard } from "@/components/common/grid-card";
import { Button } from "@/components/ui/button";
import { Globe, Cpu, Smartphone, Brain, ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { ConnectDialog } from "@/components/common/connect-dialog";

// Light SVG Apple Logo
const AppleLogo = () => (
  <svg className="size-3.5 fill-current text-white" viewBox="0 0 170 170">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.39.13-9.13-1.85-14.22-5.93-3.65-3.03-7.55-7.79-11.72-14.3-8.14-12.87-14.28-27.79-18.42-44.74-4.14-16.96-6.21-32.84-6.21-47.65 0-16.63 4.11-29.87 12.33-39.73 8.22-9.87 18.28-14.88 30.19-15.02 6.07 0 12.55 1.76 19.46 5.28 6.91 3.52 11.55 5.28 13.91 5.28 2.16 0 6.64-1.74 13.43-5.22 6.79-3.48 13.43-5.1 19.92-4.86 12.98.61 23.33 5.37 31.06 14.29 6.22 7.18 10.37 15.34 12.44 24.5-14.99 6.13-22.37 16.32-22.13 30.56.24 10.59 4.17 19.44 11.8 26.54 7.63 7.1 16.9 10.96 27.81 11.57-2.31 6.84-5.32 13.56-9.03 20.16zM119.22 32.24c0-7.72 2.76-14.88 8.28-21.49 6.22-7.46 13.88-11.28 22.98-11.47.13.9.2-1.75.2-2.55 0 7.84-2.82 15.11-8.47 21.82-5.06 5.97-12.46 10.03-22.18 12.18-1.07.25-1.92.35-2.55.35-4.11-.27-8.28-2.61-8.28-6.52v-1.78z" />
  </svg>
);

// Light SVG Play Store Logo
const PlayStoreLogo = () => (
  <svg className="size-3.5 fill-current text-white" viewBox="0 0 512 512">
    <path d="M325.3 234.3L104.6 14l280.8 161.2-60.1 59.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58 33.3-60.7-59.7 60.7-59.7 58 33.3c15.2 8.7 25.4 22.9 25.4 43.1s-10.2 34.4-25.4 43zm-86.7 52L104.6 498l220.7-220.4 60.1 52z" />
  </svg>
);

// Minimalist Web Globe Icon
const GlobeIcon = () => (
  <svg className="size-3.5 fill-none stroke-current stroke-2 text-white" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// Minimalist Web Monitor Icon
const MonitorIcon = () => (
  <svg className="size-3.5 fill-none stroke-current stroke-2 text-white" viewBox="0 0 24 24">
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
);

// Minimalist Eye Preview Icon
const EyeIcon = () => (
  <svg className="size-3.5 fill-none stroke-current stroke-2 text-white" viewBox="0 0 24 24">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Minimalist Folder Cases Icon
const FolderIcon = () => (
  <svg className="size-3.5 fill-none stroke-current stroke-2 text-white" viewBox="0 0 24 24">
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
);

interface HeroCardData {
  id: string;
  badges: string[];
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const HERO_CARDS: HeroCardData[] = [
  {
    id: "mobile",
    badges: ["IOS & ANDROID APPS", "REACT NATIVE", "HIGH PERFORMANCE"],
    title: "Mobile App Development",
    description: "Designing and engineering responsive, native-quality iOS and Android applications built on robust architecture.",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500",
    Icon: Smartphone,
  },
  {
    id: "dashboard",
    badges: ["ENTERPRISE SAAS", "NEXT.JS / REACT", "REAL-TIME ANALYTICS"],
    title: "Web Apps & Dashboards",
    description: "Developing secure database configurations, admin panels, and custom dashboards engineered to streamline operations.",
    iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
    iconColor: "text-orange-500",
    Icon: LayoutDashboard,
  },
  {
    id: "websites",
    badges: ["BLAZING FAST SEO", "PREMIUM AESTHETICS", "FLUID MICRO-ANIMATIONS"],
    title: "Websites & Landing Pages",
    description: "Crafting search-optimized marketing websites and landing pages featuring premium glassmorphism layouts and responsive flows.",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-500",
    Icon: Globe,
  },
];

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Section containerClassName="pt-6 md:pt-10 pb-4 md:pb-8" showBottomLine={true} showTopLine={false}>
      <div className="space-y-20 lg:space-y-24">
        {/* Hero Content Section */}
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:items-end lg:gap-16">
          {/* Left Column (Copy and CTAs) */}
          <div className="max-w-4xl animate-in space-y-8 duration-1000 ease-out fade-in slide-in-from-top-4 lg:col-span-7">
            {/* Availability Badge */}
            <div className="group/badge inline-flex cursor-pointer items-center gap-2.5 border border-neutral-200/50 bg-neutral-50 px-3 py-1 font-mono text-[10px] tracking-wider text-neutral-500 uppercase transition-all duration-300 select-none hover:border-neutral-300 hover:bg-neutral-100/60 hover:text-foreground dark:border-neutral-800/50 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/50">
              <span className="relative flex h-2 w-2 flex-shrink-0 items-center justify-center">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400/80 opacity-75 transition-transform duration-300 group-hover/badge:scale-125 dark:bg-emerald-300/80"></span>
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
              </span>
              <span>Open to opportunities & collaborations</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="max-w-3xl font-sans text-4xl leading-[1.15] font-bold tracking-tight text-foreground md:text-5xl lg:text-[44px]">
                Hi, I&apos;m Ariel Batoon. <br className="hidden sm:inline" />
                Building Quality Software.
              </h1>
              <p className="max-w-2xl font-sans text-base leading-relaxed text-neutral-500 md:text-lg dark:text-neutral-400">
                Full-Stack Engineer partnering with ambitious startups to design, build, and scale custom web applications, mobile apps, and AI
                integrations.
              </p>
            </div>

            {/* CTAs */}
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

          {/* Right Column (Interactive 3D Stack Cards) */}
          <div className="relative flex h-[380px] w-full items-center justify-center overflow-hidden lg:col-span-5 lg:overflow-visible lg:pr-12">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="xs:max-w-[290px] relative flex h-full w-full max-w-[250px] items-center justify-center sm:max-w-[330px] lg:max-w-[340px]"
              style={{ perspective: 1200, transformStyle: "preserve-3d" }}
            >
              {HERO_CARDS.map((card, idx) => {
                // Calculate position relative to active index
                const diff = (idx - activeIndex + HERO_CARDS.length) % HERO_CARDS.length;
                let position: "center" | "left" | "right" = "center";
                if (diff === 1) position = "right";
                if (diff === HERO_CARDS.length - 1) position = "left";

                // Framer Motion positional animation setups - using Z-axis depth for real 3D stacked layering
                const variants = {
                  left: {
                    x: "-28%",
                    y: "4%",
                    z: -100,
                    scale: 0.88,
                    rotate: -10,
                    zIndex: 10,
                    opacity: 0.65,
                    cursor: "pointer",
                  },
                  center: {
                    x: "0%",
                    y: "0%",
                    z: 0,
                    scale: 1,
                    rotate: 0,
                    zIndex: 30,
                    opacity: 1,
                    cursor: "default",
                  },
                  right: {
                    x: "28%",
                    y: "4%",
                    z: -100,
                    scale: 0.88,
                    rotate: 10,
                    zIndex: 10,
                    opacity: 0.65,
                    cursor: "pointer",
                  },
                };

                return (
                  <motion.div
                    key={card.id}
                    animate={variants[position]}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                    }}
                    onClick={() => {
                      if (position !== "center") {
                        setActiveIndex(idx);
                      }
                    }}
                    className="absolute flex h-[340px] w-full flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white/95 p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] transition-shadow duration-300 dark:border-neutral-800/80 dark:bg-neutral-950/95 dark:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.35)]"
                  >
                    {/* Plus decorations at the card corners for architectural styling */}
                    <span className="absolute -top-1.5 -left-1.5 font-mono text-[9px] text-neutral-300 select-none dark:text-neutral-700">+</span>
                    <span className="absolute -top-1.5 -right-1.5 font-mono text-[9px] text-neutral-300 select-none dark:text-neutral-700">+</span>
                    <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[9px] text-neutral-300 select-none dark:text-neutral-700">+</span>
                    <span className="absolute -right-1.5 -bottom-1.5 font-mono text-[9px] text-neutral-300 select-none dark:text-neutral-700">+</span>

                    <div className="space-y-4">
                      {/* Top Badges Row */}
                      <div className="flex flex-wrap gap-1.5">
                        {card.badges.map((badge, bIdx) => {
                          const isDarkBadge = bIdx === 0;
                          return (
                            <span
                              key={badge}
                              className={
                                isDarkBadge
                                  ? "rounded-full bg-neutral-900 px-2.5 py-0.5 font-mono text-[8px] font-semibold tracking-wider text-white dark:bg-neutral-800"
                                  : "rounded-full border border-dashed border-neutral-300 px-2.5 py-0.5 font-mono text-[8px] tracking-wider text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
                              }
                            >
                              {isDarkBadge ? `⟨ ${badge} ⟩` : badge}
                            </span>
                          );
                        })}
                      </div>

                      {/* Header App Info */}
                      <div className="flex items-center gap-3.5 pt-1">
                        <div className="flex size-11 shrink-0 items-center justify-center border border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
                          <card.Icon className="size-5 text-neutral-800 dark:text-neutral-200" />
                        </div>
                        <h3 className="font-sans text-base font-extrabold tracking-tight text-foreground">{card.title}</h3>
                      </div>

                      {/* Description */}
                      <p className="font-sans text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{card.description}</p>
                    </div>

                    {/* Bottom Action Badges */}
                    <div className="flex items-center gap-2 border-t border-dashed border-neutral-200 pt-3.5 dark:border-neutral-800">
                      {card.id === "mobile" ? (
                        <>
                          {/* App Store button */}
                          <div className="flex h-8 items-center gap-1.5 rounded-md bg-neutral-900 px-3 text-white select-none dark:bg-neutral-800">
                            <AppleLogo />
                            <div className="flex flex-col text-left font-sans">
                              <span className="text-[6px] leading-none text-neutral-400 uppercase">Download on the</span>
                              <span className="text-[10px] leading-tight font-bold">App Store</span>
                            </div>
                          </div>

                          {/* Google Play button */}
                          <div className="flex h-8 items-center gap-1.5 rounded-md bg-neutral-900 px-3 text-white select-none dark:bg-neutral-800">
                            <PlayStoreLogo />
                            <div className="flex flex-col text-left font-sans">
                              <span className="text-[6px] leading-none text-neutral-400 uppercase">GET IT ON</span>
                              <span className="text-[10px] leading-tight font-bold">Google Play</span>
                            </div>
                          </div>
                        </>
                      ) : card.id === "dashboard" ? (
                        <>
                          {/* Web App Launch Button */}
                          <div className="flex h-8 items-center gap-1.5 rounded-md bg-neutral-900 px-3 text-white select-none dark:bg-neutral-800">
                            <GlobeIcon />
                            <div className="flex flex-col text-left font-sans">
                              <span className="text-[6px] leading-none text-neutral-400 uppercase">LAUNCH</span>
                              <span className="text-[10px] leading-tight font-bold">Web App</span>
                            </div>
                          </div>

                          {/* Explore Dashboard Button */}
                          <div className="flex h-8 items-center gap-1.5 rounded-md bg-neutral-900 px-3 text-white select-none dark:bg-neutral-800">
                            <MonitorIcon />
                            <div className="flex flex-col text-left font-sans">
                              <span className="text-[6px] leading-none text-neutral-400 uppercase">EXPLORE</span>
                              <span className="text-[10px] leading-tight font-bold">SaaS Portal</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Live Preview Button */}
                          <div className="flex h-8 items-center gap-1.5 rounded-md bg-neutral-900 px-3 text-white select-none dark:bg-neutral-800">
                            <EyeIcon />
                            <div className="flex flex-col text-left font-sans">
                              <span className="text-[6px] leading-none text-neutral-400 uppercase">PREVIEW</span>
                              <span className="text-[10px] leading-tight font-bold">Live Sites</span>
                            </div>
                          </div>

                          {/* View Case Studies Button */}
                          <div className="flex h-8 items-center gap-1.5 rounded-md bg-neutral-900 px-3 text-white select-none dark:bg-neutral-800">
                            <FolderIcon />
                            <div className="flex flex-col text-left font-sans">
                              <span className="text-[6px] leading-none text-neutral-400 uppercase">VIEW</span>
                              <span className="text-[10px] leading-tight font-bold">Case Studies</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Dynamic ambient shadow representing vertical float displacement */}
            <motion.div
              animate={{
                scaleX: [0.9, 1.05, 0.9],
                opacity: [0.35, 0.18, 0.35],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute bottom-2 left-1/2 h-4 w-[60%] -translate-x-1/2 rounded-[100%] bg-neutral-900/10 blur-xl dark:bg-black/55"
            />
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
