"use client";

import { Section } from "@/components/common/section";
import { DiscoveryBookingWidget } from "@/components/features/public/book/discovery-booking-widget";

type BookCallSectionProps = {
  /** Home section shows a headline block above the calendar. */
  showIntro?: boolean;
  sectionId?: string;
};

export function BookCallSection({ showIntro = false, sectionId }: BookCallSectionProps) {
  return (
    <Section
      id={sectionId}
      containerClassName={showIntro ? "pt-8 md:pt-12 pb-2 md:pb-4" : "py-12 md:py-16"}
      showTopLine={false}
      showBottomLine={true}
    >
      <div className={showIntro ? "space-y-8" : undefined}>
        {showIntro && (
          <div className="max-w-3xl space-y-3">
            <span className="text-neutral-450 block font-mono text-[10px] tracking-[0.2em] uppercase dark:text-neutral-500">START A PROJECT</span>
            <h2 className="font-sans text-4xl leading-[1.05] font-extrabold tracking-tight text-foreground md:text-5xl lg:text-[56px]">
              Ready to build?
            </h2>
            <p className="max-w-2xl font-sans text-sm leading-relaxed text-neutral-500 md:text-base dark:text-neutral-400">
              Pick a time and let&apos;s scope your project. One call — no fluff, just a real conversation about what you need.
            </p>
          </div>
        )}

        <DiscoveryBookingWidget compact={showIntro} />
      </div>
    </Section>
  );
}
