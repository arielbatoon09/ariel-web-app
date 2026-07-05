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
      <div className="group relative z-10 flex min-h-[700px] w-full flex-col border border-dashed border-neutral-300 bg-background p-4 transition-colors duration-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900/90">
        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 transition-colors group-hover:text-neutral-500 dark:text-neutral-700 dark:group-hover:text-neutral-400">
          +
        </div>
        <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 transition-colors group-hover:text-neutral-500 dark:text-neutral-700 dark:group-hover:text-neutral-400">
          +
        </div>

        <div className="h-full w-full flex-1 overflow-hidden bg-background">
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
