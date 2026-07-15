"use client";

import { useState } from "react";
import { Code2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { TECH_STACK } from "@/constants/about";
import Image from "next/image";

function TechIcon({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || "/technology/empty.svg");

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={18}
      height={18}
      className="size-4.5 object-contain transition-all duration-300 group-hover:scale-110"
      onError={() => {
        setImgSrc("/technology/empty.svg");
      }}
    />
  );
}

export function AboutTechStackSection() {
  const [activeCategory, setActiveCategory] = useState("Frontend");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Section id="about-skills" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SectionHeading icon={<Code2 className="size-5" />} title="Technical Skillset" variant="sub" />

          {/* Category Selector Dropdown */}
          <div className="relative z-30 inline-block text-left">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hover:border-neutral-450 flex min-w-[200px] cursor-pointer items-center justify-between gap-3 border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2 font-mono text-[10px] tracking-wider text-foreground uppercase transition-colors duration-200 dark:border-neutral-700 dark:bg-neutral-900/60"
            >
              <span>Category: {activeCategory}</span>
              <ChevronDown className={cn("text-neutral-450 size-3.5 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
            </button>

            {isDropdownOpen && (
              <>
                {/* Invisible backdrop to close the dropdown when clicking outside */}
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 z-20 mt-1 w-full min-w-[200px] border border-dashed border-neutral-300 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-950">
                  {TECH_STACK.map((group) => (
                    <button
                      key={group.category}
                      onClick={() => {
                        setActiveCategory(group.category);
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "dark:border-neutral-850 w-full cursor-pointer border-b border-dashed border-neutral-100 px-3 py-2 text-left font-mono text-[10px] tracking-wider uppercase transition-colors last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-900",
                        activeCategory === group.category
                          ? "bg-neutral-100/50 font-bold text-foreground dark:bg-neutral-900/80"
                          : "text-neutral-500 hover:text-foreground"
                      )}
                    >
                      {group.category}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Compact Grid of Interactive Tech Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {TECH_STACK.find((group) => group.category === activeCategory)?.skills.map((skill, idx) => {
            return (
              <div
                key={idx}
                className="group border-neutral-250 dark:border-neutral-750 relative flex items-center gap-2.5 border border-dashed bg-neutral-50 p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900/90"
                style={
                  {
                    "--hover-border": skill.color,
                  } as React.CSSProperties
                }
              >
                {/* Subtle Border Glow on Hover */}
                <div className="pointer-events-none absolute inset-0 border border-dashed border-transparent transition-colors duration-300 group-hover:border-[var(--hover-border)]" />

                {/* Tech Icon Container */}
                <div className="relative flex size-5 shrink-0 items-center justify-center">
                  <TechIcon key={skill.iconPath} src={skill.iconPath} alt={skill.name} />
                </div>

                {/* Tech Name */}
                <span className="dark:text-neutral-355 truncate font-mono text-[10px] text-neutral-600 transition-colors group-hover:text-foreground">
                  {skill.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
