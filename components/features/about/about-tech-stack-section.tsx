"use client";

import { useState } from "react";
import { Code2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { TECH_STACK, lucideIconMap } from "@/constants/about";
import Image from "next/image";

export function AboutTechStackSection() {
  const [activeCategory, setActiveCategory] = useState("Frontend");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Section id="about-skills" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <SectionHeading icon={<Code2 className="size-5" />} title="Technical Skillset" variant="sub" />
          
          {/* Category Selector Dropdown */}
          <div className="relative inline-block text-left z-30">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-3 px-3 py-2 text-[10px] font-mono border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 text-foreground hover:border-neutral-450 cursor-pointer min-w-[200px] uppercase tracking-wider transition-colors duration-200"
            >
              <span>Category: {activeCategory}</span>
              <ChevronDown className={cn("size-3.5 text-neutral-450 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
            </button>
            
            {isDropdownOpen && (
              <>
                {/* Invisible backdrop to close the dropdown when clicking outside */}
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 mt-1 w-full min-w-[200px] z-20 border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 shadow-md">
                  {TECH_STACK.map((group) => (
                    <button
                      key={group.category}
                      onClick={() => {
                        setActiveCategory(group.category);
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-[10px] font-mono hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors uppercase tracking-wider cursor-pointer border-b border-dashed border-neutral-100 last:border-0 dark:border-neutral-850",
                        activeCategory === group.category
                          ? "text-foreground font-bold bg-neutral-100/50 dark:bg-neutral-900/80"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {TECH_STACK.find((group) => group.category === activeCategory)?.skills.map((skill, idx) => {
            const LucideIconComponent = skill.lucideIcon ? lucideIconMap[skill.lucideIcon] : null;
            
            return (
              <div
                key={idx}
                className="group relative flex items-center gap-2.5 p-2.5 border border-dashed border-neutral-250 dark:border-neutral-750 bg-neutral-100/30 dark:bg-neutral-800/10 hover:bg-white dark:hover:bg-neutral-900/50 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  "--hover-border": skill.color,
                } as React.CSSProperties}
              >
                {/* Subtle Border Glow on Hover */}
                <div 
                  className="absolute inset-0 border border-dashed border-transparent group-hover:border-[var(--hover-border)] transition-colors duration-300 pointer-events-none" 
                />
                
                {/* Tech Icon Container */}
                <div className="size-5 shrink-0 flex items-center justify-center relative">
                  {skill.iconUrl ? (
                    <Image
                      src={skill.iconUrl}
                      alt={skill.name}
                      width={18}
                      height={18}
                      className="size-4.5 object-contain transition-all duration-300 group-hover:scale-110"
                    />
                  ) : skill.slug ? (
                    <Image
                      src={`https://cdn.simpleicons.org/${skill.slug}`}
                      alt={skill.name}
                      width={18}
                      height={18}
                      className="size-4.5 object-contain filter dark:brightness-95 transition-all duration-300 group-hover:scale-110"
                    />
                  ) : LucideIconComponent ? (
                    <LucideIconComponent 
                      className="size-4.5 transition-all duration-300 group-hover:scale-110" 
                      style={{ color: skill.color }} 
                    />
                  ) : (
                    <Code2 className="size-4.5 text-neutral-400" />
                  )}
                </div>

                {/* Tech Name */}
                <span className="text-[10px] font-mono truncate text-neutral-600 dark:text-neutral-355 group-hover:text-foreground transition-colors">
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
