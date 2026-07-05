"use client";

import * as React from "react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { ConnectDialog } from "@/components/common/connect-dialog";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { ALL_SERVICES } from "@/constants/services";

export function ServicesList() {
  return (
    <Section id="services-list" containerClassName="pt-6 md:pt-10 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-12">
        {/* Section Heading */}
        <SectionHeading
          label="Services & Pricing"
          title="Professional software engineering. Tailored to your goals."
          description="Select the scope and pricing model that matches your current product needs. All packages are built using high-performance engineering standards, clean source code, and responsive design."
        />

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {ALL_SERVICES.map((pkg) => (
            <div
              key={pkg.id}
              className="flex flex-col justify-between space-y-6 border border-dashed border-neutral-300 bg-neutral-50 p-8 dark:border-neutral-700 dark:bg-neutral-900/60"
            >
              <div className="space-y-4">
                {/* Header Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-sans text-xl font-bold text-foreground">{pkg.title}</h2>
                    <span className="border border-dashed border-neutral-300 px-2 py-0.5 font-mono text-[10px] text-neutral-500 uppercase dark:border-neutral-700">
                      ID: {pkg.id}
                    </span>
                  </div>
                  <p className="dark:text-neutral-450 font-sans text-xs leading-relaxed text-neutral-500">{pkg.description}</p>
                </div>

                {/* Core Specs Bar */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-dashed border-neutral-300 py-3 font-mono text-[11px] tracking-wider uppercase dark:border-neutral-700">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-neutral-400">
                      <Clock className="size-3.5" /> Timeline
                    </span>
                    <span className="font-semibold text-foreground">{pkg.timeline}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-neutral-400">₱ Price Range</span>
                    <span className="font-semibold text-foreground">{pkg.priceRange}</span>
                  </div>
                </div>

                {/* target audience */}
                <div className="space-y-2">
                  <span className="block font-mono text-[10px] tracking-wider text-neutral-400 uppercase dark:text-neutral-500">Ideal For</span>
                  <p className="font-sans text-xs leading-normal text-neutral-600 dark:text-neutral-400">{pkg.targetAudience}</p>
                </div>

                {/* What's Included */}
                <div className="space-y-2">
                  <span className="block font-mono text-[10px] tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                    What&apos;s Included
                  </span>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 font-sans text-xs text-neutral-600 dark:text-neutral-400">
                        <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-emerald-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="border-t border-dashed border-neutral-300 pt-6 dark:border-neutral-700">
                <ConnectDialog triggerText="Select Package">
                  <Button className="h-10 w-full cursor-pointer rounded-none font-mono text-xs tracking-wider uppercase">
                    Select Package
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Button>
                </ConnectDialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
