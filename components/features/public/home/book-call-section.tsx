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
        <div className="max-w-3xl space-y-3">
          <span className="text-neutral-450 block font-mono text-[10px] tracking-[0.2em] uppercase dark:text-neutral-500">START A PROJECT</span>
          <h2 className="font-sans text-4xl leading-[1.05] font-extrabold tracking-tight text-foreground md:text-5xl lg:text-[56px]">
            Ready to build?
          </h2>
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-neutral-500 md:text-base dark:text-neutral-400">
            Pick a time and let&apos;s scope your project. One call — no fluff, just a real conversation about what you need.
          </p>
        </div>

        {/* Calendar Embed wrapped in Grid Card Styling */}
        <div className="group relative z-10 flex min-h-[650px] w-full flex-col border border-dashed border-neutral-300 bg-background p-4 transition-colors duration-300 hover:bg-neutral-50/50 md:min-h-[700px] dark:border-neutral-700 dark:hover:bg-neutral-900/10">
          {/* Interactive Corner Plus (+) Markers */}
          <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] font-light text-neutral-300 transition-all duration-300 select-none group-hover:scale-150 group-hover:text-neutral-600 dark:text-neutral-700 dark:group-hover:text-neutral-400">
            +
          </div>
          <div className="pointer-events-none absolute right-0 bottom-0 z-20 translate-x-1/2 translate-y-1/2 text-[10px] font-light text-neutral-300 transition-all duration-300 select-none group-hover:scale-150 group-hover:text-neutral-600 dark:text-neutral-700 dark:group-hover:text-neutral-400">
            +
          </div>

          <div className="mt-10 h-full w-full flex-1 overflow-hidden bg-background">
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
