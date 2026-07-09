"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Layers, ArrowUpRight } from "lucide-react";
import { useServicesQuery } from "@/hooks/use-services";
import type { Service } from "@/schemas/dashboard";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty";
import { ConnectDialog } from "@/components/common/connect-dialog";

import { GridCard } from "@/components/common/grid-card";

interface ServicesListProps {
  initialServices: Service[];
}

export function ServicesList({ initialServices }: ServicesListProps) {
  const router = useRouter();
  const { data: dbServices = initialServices } = useServicesQuery(initialServices);

  const activeServices = React.useMemo(() => {
    return dbServices.filter((s) => !s.disabled);
  }, [dbServices]);

  return (
    <Section id="services-list" containerClassName="pt-6 md:pt-10 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-12">
        {/* Section Heading */}
        <SectionHeading
          label="Services & Pricing"
          title="Professional software engineering. Tailored to your goals."
          description="Select the scope and pricing model that matches your current product needs. All packages are built using high-performance engineering standards, clean source code, and responsive design."
        />

        {activeServices.length > 0 ? (
          <div className="grid animate-in grid-cols-1 border-t border-l border-dashed border-neutral-300 duration-300 fade-in md:grid-cols-2 dark:border-neutral-700">
            {activeServices.map((pkg) => (
              <GridCard
                key={pkg.id}
                title={pkg.name}
                description={pkg.description}
                imageSrc={pkg.imageSrc ?? undefined}
                price={`₱${pkg.price.toLocaleString()}`}
                deliveryTime={pkg.deliveryTime}
                link={{
                  href: `/service/${pkg.slug}`,
                  label: "View Scope & Pricing",
                }}
              />
            ))}
          </div>
        ) : (
          <Empty className="border border-dashed border-neutral-300 dark:border-neutral-700 py-16 rounded-none bg-neutral-50/20 dark:bg-neutral-900/10">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="border border-dashed border-neutral-300 dark:border-neutral-700 bg-background text-neutral-400 size-10 rounded-none mb-1">
                <Layers className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="font-mono text-xs text-neutral-400 uppercase tracking-widest">No active packages listed</EmptyTitle>
              <EmptyDescription className="font-sans text-xs text-neutral-500 max-w-xs leading-relaxed">
                We don&apos;t have any pre-configured packages published at the moment. Please get in touch directly to discuss custom scope or consulting.
              </EmptyDescription>
            </EmptyHeader>
            <ConnectDialog triggerText="Let's Talk">
              <Button className="mt-2 h-9 rounded-none font-mono text-[10px] uppercase gap-1.5">
                Connect Directly
                <ArrowUpRight className="size-3.5" />
              </Button>
            </ConnectDialog>
          </Empty>
        )}
      </div>
    </Section>
  );
}
