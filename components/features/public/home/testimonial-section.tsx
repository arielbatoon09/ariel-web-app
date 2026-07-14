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
    quote:
      "I'm genuinely impressed with Ariel's web development skills at such a young age. He's easy to work with, professional, and I'd happily work with him again anytime.",
    author: "Bea Suavengco",
    role: "CEO",
    company: "UrbanFarmer TV",
    highlight: "Forbes 30 Under 30, 2025",
  },
  {
    id: "02",
    quote:
      "Ariel brought our vision to life in record time. His technical precision and frontend styling made our dashboard look and feel incredibly premium.",
    author: "David Chen",
    role: "CTO",
    company: "Ventus Health",
    highlight: "Fast-Track Seed Funded",
  },
  {
    id: "03",
    quote: "A rare engineer who blends backend stability with gorgeous visual interactions. Our conversion rate increased by 20% after the launch.",
    author: "Sarah Jenkins",
    role: "VP of Product",
    company: "Craftly",
    highlight: "Series A Scaleup",
  },
  {
    id: "04",
    quote:
      "A professional partner from day one. Ariel doesn't just write code—he understands business requirements and designs systems to support them.",
    author: "Marcus Sterling",
    role: "Founder",
    company: "Coreflow API",
    highlight: "Y Combinator W25",
  },
];

export function TestimonialSection() {
  const [isHovered, setIsHovered] = useState(false);
  const { scrollRef, activeIndex, dotsCount, scrollToCard, handleScroll } = useScrollCarousel({
    itemCount: TESTIMONIALS.length,
    gap: 24,
    cardSelector: ".testimonial-card",
    autoPlay: !isHovered,
    autoPlayInterval: 5000,
  });

  const canScrollLeft = activeIndex > 0;
  const canScrollRight = activeIndex < dotsCount - 1;

  return (
    <Section id="testimonials" containerClassName="py-12 md:py-16 overflow-hidden" showTopLine={false} showBottomLine={true}>
      <div className="space-y-10">
        {/* Section Heading & Controls Layout */}
        <SectionHeading
          label="Client Feedback"
          title="What partners are saying."
          className="w-full px-4 md:px-8"
          action={
            <div className="flex items-center gap-2">
              <button
                disabled={!canScrollLeft}
                className={cn(
                  "flex size-10 cursor-pointer items-center justify-center rounded-none border border-dashed border-neutral-300 bg-background text-foreground transition-all duration-300 hover:border-neutral-900 dark:border-neutral-700 dark:hover:border-neutral-100",
                  !canScrollLeft && "pointer-events-none opacity-30"
                )}
                onClick={() => scrollToCard(Math.max(0, activeIndex - 1))}
                aria-label="Previous testimonial"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                disabled={!canScrollRight}
                className={cn(
                  "flex size-10 cursor-pointer items-center justify-center rounded-none border border-dashed border-neutral-300 bg-background text-foreground transition-all duration-300 hover:border-neutral-900 dark:border-neutral-700 dark:hover:border-neutral-100",
                  !canScrollRight && "pointer-events-none opacity-30"
                )}
                onClick={() => scrollToCard(Math.min(dotsCount - 1, activeIndex + 1))}
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
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 hidden w-16 bg-gradient-to-r from-background to-transparent md:block" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 hidden w-16 bg-gradient-to-l from-background to-transparent md:block" />

          {/* Horizontal scroll track */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-4 md:px-8"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="testimonial-card group relative w-[280px] shrink-0 snap-start border border-dashed border-neutral-300 bg-neutral-50 p-6 transition-all duration-300 select-none hover:border-neutral-900 hover:bg-neutral-100 sm:w-[360px] md:w-[420px] md:p-8 dark:border-neutral-700 dark:bg-neutral-900/60 dark:hover:border-neutral-100 dark:hover:bg-neutral-900/90"
              >
                {/* Plus (+) Corner Markers */}
                <div className="group-hover:text-neutral-550 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 transition-all duration-300 group-hover:scale-125 dark:text-neutral-700 dark:group-hover:text-neutral-400">
                  +
                </div>
                <div className="group-hover:text-neutral-550 absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 transition-all duration-300 group-hover:scale-125 dark:text-neutral-700 dark:group-hover:text-neutral-400">
                  +
                </div>

                <div className="flex h-full flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {/* Quote Icon */}
                    <Quote className="size-6 text-neutral-300 transition-colors group-hover:text-neutral-400 dark:text-neutral-700" />

                    {/* Body Quote */}
                    <p className="min-h-[96px] font-sans text-xs leading-relaxed text-neutral-600 sm:text-sm md:min-h-[110px] md:text-base dark:text-neutral-300">
                      “{item.quote}”
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="space-y-2 border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                      <span className="font-sans text-xs font-bold text-foreground sm:text-sm">{item.author}</span>
                      <span className="text-neutral-450 font-mono text-[9px] tracking-wider uppercase sm:text-[10px] dark:text-neutral-500">
                        {item.role}, {item.company}
                      </span>
                    </div>
                    {item.highlight && (
                      <div className="w-fit font-mono text-[9px] tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
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
        {dotsCount > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            {Array.from({ length: dotsCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className={cn(
                  "h-1.5 cursor-pointer rounded-none transition-all duration-300",
                  activeIndex === index
                    ? "w-8 bg-neutral-900 dark:bg-neutral-100"
                    : "hover:bg-neutral-455 w-2 bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-500"
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
