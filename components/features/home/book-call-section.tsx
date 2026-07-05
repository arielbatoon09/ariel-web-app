"use client";

import { Section } from "@/components/common/section";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export function BookCallSection() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "discovery-call" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return (
    <Section id="contact" containerClassName="pt-8 md:pt-12 pb-2 md:pb-4" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        {/* Custom Screenshot-Aligned Header Block */}
        <div className="space-y-3 max-w-3xl">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-450 dark:text-neutral-500 block">
            START A PROJECT
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight text-foreground font-sans leading-[1.05]">
            Ready to build?
          </h2>
          <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed max-w-2xl">
            Pick a time and let's scope your project. One call — no fluff, just a real conversation about what you need.
          </p>
        </div>

        {/* Calendar Embed wrapped in Grid Card Styling */}
        <div className="group relative p-4 border border-dashed border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 transition-colors duration-300 z-10 w-full min-h-[650px] md:min-h-[700px] flex flex-col bg-background">
          {/* Interactive Corner Plus (+) Markers */}
          <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 select-none pointer-events-none text-[10px] font-light text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-hover:scale-150 transition-all duration-300 z-20">
            +
          </div>
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 select-none pointer-events-none text-[10px] font-light text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-hover:scale-150 transition-all duration-300 z-20">
            +
          </div>

          <div className="flex-1 w-full h-full overflow-hidden bg-background mt-10">
            <Cal
              namespace="discovery-call"
              calLink="arielbatoon/discovery-call"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
