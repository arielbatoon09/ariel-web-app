"use client";

import { useMemo } from "react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { Layers, ArrowUpRight } from "lucide-react";
import { useServicesQuery } from "@/hooks/use-services";
import { useListingLayout } from "@/hooks/use-listing-layout";
import type { Service } from "@/schemas/dashboard";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty";
import { ConnectDialog } from "@/components/common/connect-dialog";
import { ArchiveLayoutToggle } from "@/components/common/archive-layout-toggle";
import { GridCard } from "@/components/common/grid-card";
import { cn } from "@/lib/utils";
import { formatPhp, getServicePricing } from "@/lib/pricing";

interface ServicesListProps {
  initialServices: Service[];
}

export function ServicesList({ initialServices }: ServicesListProps) {
  const { data: dbServices = initialServices } = useServicesQuery(initialServices);
  const { layout, setLayout } = useListingLayout();

  const activeServices = useMemo(() => {
    return dbServices.filter((s) => !s.disabled);
  }, [dbServices]);

  return (
    <Section id="services-list" containerClassName="pt-6 md:pt-10 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-12">
        <SectionHeading
          label="Services & Pricing"
          title="Clear packages. Clear scope."
          description="Pick a package that fits your build — or reach out for custom work."
          action={<ArchiveLayoutToggle layout={layout} onLayoutChange={setLayout} />}
        />

        {activeServices.length > 0 ? (
          <div
            className={cn(
              "animate-in border-t border-l border-dashed border-neutral-300 duration-300 fade-in dark:border-neutral-700",
              "grid grid-cols-1",
              layout === "grid" && "md:grid-cols-2"
            )}
          >
            {activeServices.map((pkg) => {
              const pricing = getServicePricing(pkg);
              return (
                <GridCard
                  key={pkg.id}
                  variant={layout}
                  title={pkg.name}
                  description={pkg.description}
                  descriptionAsHtml
                  imageSrc={pkg.cardImageSrc || pkg.imageSrc || undefined}
                  imageAspectRatio="1 / 1"
                  imageFit="contain"
                  price={
                    pricing.discounted ? (
                      <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-neutral-400 line-through">{formatPhp(pricing.listPrice)}</span>
                        <span>{formatPhp(pricing.basePrice)}</span>
                        {pricing.discountLabel ? (
                          <span className="font-mono text-[9px] font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                            {pricing.discountLabel}
                          </span>
                        ) : null}
                      </span>
                    ) : (
                      formatPhp(pricing.basePrice)
                    )
                  }
                  deliveryTime={pkg.deliveryTime}
                  truncate
                  link={{
                    href: `/service/${pkg.slug}`,
                    label: "View Scope & Pricing",
                  }}
                />
              );
            })}
          </div>
        ) : (
          <Empty className="rounded-none border border-dashed border-neutral-300 bg-neutral-50/20 py-16 dark:border-neutral-700 dark:bg-neutral-900/10">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="mb-1 size-10 rounded-none border border-dashed border-neutral-300 bg-background text-neutral-400 dark:border-neutral-700"
              >
                <Layers className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="font-mono text-xs tracking-widest text-neutral-400 uppercase">No active packages listed</EmptyTitle>
              <EmptyDescription className="max-w-xs font-sans text-xs leading-relaxed text-neutral-500">
                We don&apos;t have any pre-configured packages published at the moment. Please get in touch directly to discuss custom scope or
                consulting.
              </EmptyDescription>
            </EmptyHeader>
            <ConnectDialog triggerText="Let's Talk">
              <Button className="mt-2 h-9 gap-1.5 rounded-none font-mono text-[10px] uppercase">
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
