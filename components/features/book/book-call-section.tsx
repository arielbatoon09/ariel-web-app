"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Section } from "@/components/common/section";

export function BookCallSection() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "discovery-call" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return (
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
  );
}
