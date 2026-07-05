"use client";

import { useEffect } from "react";
import { Section } from "@/components/common/section";
import Cal, { getCalApi } from "@calcom/embed-react";

export default function BookCallPage() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "discovery-call" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Book Call Hero Header */}
      <Section containerClassName="pt-10 md:pt-16 pb-6 md:pb-10" showBottomLine={true} showTopLine={false}>
        <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000 ease-out">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-450 dark:text-neutral-500 block">
            SCHEDULING
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight text-foreground font-sans leading-[1.1] max-w-3xl">
            Book a Free 30-Min Discovery Call
          </h1>
          <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-450 font-sans leading-relaxed max-w-2xl">
            Select a convenient time on the calendar below to discuss your project, technical needs, or potential collaboration. Let's build something great together.
          </p>
        </div>
      </Section>

      {/* Calendar Embed Section */}
      <Section containerClassName="py-12 md:py-16" showTopLine={false} showBottomLine={true}>
        <div className="group relative p-4 border border-dashed border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 transition-colors duration-300 z-10 w-full min-h-[700px] flex flex-col bg-background">
          <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors">
            +
          </div>
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors">
            +
          </div>

          <div className="flex-1 w-full h-full overflow-hidden bg-background">
            <Cal
              namespace="discovery-call"
              calLink="arielbatoon/discovery-call"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
