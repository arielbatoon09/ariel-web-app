"use client";

import { useState } from "react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollCarousel } from "@/hooks/use-scroll-carousel";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  highlight?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "01",
    quote: "I'm genuinely impressed with Ariel's web development skills at such a young age. He's easy to work with, professional, and I'd happily work with him again anytime.",
    author: "Bea Suavengco",
    role: "CEO",
    company: "UrbanFarmer TV",
    highlight: "Forbes 30 Under 30, 2025"
  },
  {
    id: "02",
    quote: "Ariel brought our vision to life in record time. His technical precision and frontend styling made our dashboard look and feel incredibly premium.",
    author: "David Chen",
    role: "CTO",
    company: "Ventus Health",
    highlight: "Fast-Track Seed Funded"
  },
  {
    id: "03",
    quote: "A rare engineer who blends backend stability with gorgeous visual interactions. Our conversion rate increased by 20% after the launch.",
    author: "Sarah Jenkins",
    role: "VP of Product",
    company: "Craftly",
    highlight: "Series A Scaleup"
  },
  {
    id: "04",
    quote: "A professional partner from day one. Ariel doesn't just write code—he understands business requirements and designs systems to support them.",
    author: "Marcus Sterling",
    role: "Founder",
    company: "Coreflow API",
    highlight: "Y Combinator W25"
  }
];

export function TestimonialSection() {
  const [isHovered, setIsHovered] = useState(false);
  const { scrollRef, activeIndex, scrollToCard, handleScroll } = useScrollCarousel({
    itemCount: TESTIMONIALS.length,
    gap: 24,
    cardSelector: ".testimonial-card",
    autoPlay: !isHovered,
    autoPlayInterval: 5000
  });

  const canScrollLeft = activeIndex > 0;
  const canScrollRight = activeIndex < TESTIMONIALS.length - 1;

  return (
    <Section id="testimonials" containerClassName="py-12 md:py-16 overflow-hidden" showTopLine={false} showBottomLine={true}>
      <div className="space-y-10">
        {/* Section Heading & Controls Layout */}
        <SectionHeading
          label="Client Feedback"
          title="What partners are saying."
          className="px-4 md:px-8 w-full"
          action={
            <div className="flex items-center gap-2">
              <button
                disabled={!canScrollLeft}
                className={cn(
                  "rounded-none size-10 flex items-center justify-center cursor-pointer border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 transition-all duration-300 bg-background text-foreground",
                  !canScrollLeft && "opacity-30 pointer-events-none"
                )}
                onClick={() => scrollToCard(Math.max(0, activeIndex - 1))}
                aria-label="Previous testimonial"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                disabled={!canScrollRight}
                className={cn(
                  "rounded-none size-10 flex items-center justify-center cursor-pointer border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 transition-all duration-300 bg-background text-foreground",
                  !canScrollRight && "opacity-30 pointer-events-none"
                )}
                onClick={() => scrollToCard(Math.min(TESTIMONIALS.length - 1, activeIndex + 1))}
                aria-label="Next testimonial"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          }
        />

        {/* Scrollable Container with fading edge overlays */}
        <div className="relative w-full">
          {/* Subtle fading edge highlights */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Horizontal scroll track */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 md:px-8 pb-4 scroll-smooth no-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="testimonial-card group relative w-[280px] sm:w-[360px] md:w-[420px] shrink-0 snap-start p-6 md:p-8 border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-900/90 transition-all duration-300 select-none"
              >
                {/* Plus (+) Corner Markers */}
                <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-550 dark:group-hover:text-neutral-400 group-hover:scale-125 transition-all duration-300">
                  +
                </div>
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-550 dark:group-hover:text-neutral-400 group-hover:scale-125 transition-all duration-300">
                  +
                </div>

                <div className="space-y-6 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    {/* Quote Icon */}
                    <Quote className="size-6 text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-400 transition-colors" />

                    {/* Body Quote */}
                    <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans min-h-[96px] md:min-h-[110px]">
                      “{item.quote}”
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <span className="text-xs sm:text-sm font-bold text-foreground font-sans">
                        {item.author}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-neutral-450 dark:text-neutral-500">
                        {item.role}, {item.company}
                      </span>
                    </div>
                    {item.highlight && (
                      <div className="text-[9px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 w-fit">
                        {item.highlight}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots (Calculated based on actual scroll pages) */}
        {TESTIMONIALS.length > 1 && (
          <div className="flex justify-center items-center gap-3 pt-2">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className={cn(
                  "h-1.5 transition-all duration-300 rounded-none cursor-pointer",
                  activeIndex === index
                    ? "w-8 bg-neutral-900 dark:bg-neutral-100"
                    : "w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-455 dark:hover:bg-neutral-500"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
