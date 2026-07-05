"use client";

import * as React from "react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { ConnectDialog } from "@/components/common/connect-dialog";
import { Calendar, Clock, DollarSign, CheckCircle2, ArrowRight } from "lucide-react";
import { ALL_SERVICES, type ServicePackage } from "@/constants/services";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ALL_SERVICES.map((pkg) => (
            <div 
              key={pkg.id} 
              className="border border-dashed border-neutral-300 dark:border-neutral-700 p-8 bg-neutral-50/30 dark:bg-neutral-900/10 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-xl font-bold font-sans text-foreground">
                      {pkg.title}
                    </h2>
                    <span className="text-[10px] font-mono border border-dashed border-neutral-300 dark:border-neutral-700 px-2 py-0.5 text-neutral-500 uppercase">
                      ID: {pkg.id}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed font-sans">
                    {pkg.description}
                  </p>
                </div>

                {/* Core Specs Bar */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-dashed border-neutral-300 dark:border-neutral-700 py-3 font-mono text-[11px] uppercase tracking-wider">
                  <div className="space-y-1">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <Clock className="size-3.5" /> Timeline
                    </span>
                    <span className="text-foreground font-semibold">{pkg.timeline}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      ₱ Price Range
                    </span>
                    <span className="text-foreground font-semibold">{pkg.priceRange}</span>
                  </div>
                </div>

                {/* target audience */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                    Ideal For
                  </span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-normal font-sans">
                    {pkg.targetAudience}
                  </p>
                </div>

                {/* What's Included */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                    What's Included
                  </span>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
                        <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 border-t border-dashed border-neutral-300 dark:border-neutral-700">
                <ConnectDialog triggerText="Select Package">
                  <Button className="w-full rounded-none font-mono text-xs uppercase tracking-wider cursor-pointer h-10">
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
