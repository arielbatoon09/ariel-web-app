"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import type { Service } from "@/schemas/dashboard";
import { Clock, CheckCircle2, ArrowRight, ShieldCheck, Check, Sparkles, Layers, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { BannerShowcase } from "@/components/common/banner-showcase";
import { BackButton } from "@/components/common/back-button";

interface ServiceDetailViewProps {
  service: Service;
}

export function ServiceDetailView({ service }: ServiceDetailViewProps) {
  const router = useRouter();
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Recalculate running total
  const totalAmount = useMemo(() => {
    const base = service.price;
    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const addon = service.addOns.find((a) => a.id === id);
      return sum + (addon?.price || 0);
    }, 0);
    return base + addonsTotal;
  }, [service, selectedAddons]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
  };

  return (
    <Section id="service-detail" containerClassName="pt-4 md:pt-6 pb-12 md:pb-20" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        {/* Back navigation */}
        <div>
          <BackButton href="/services" label="Back to Services" />
        </div>

        {/* Banner image if configured */}
        {service.imageSrc && (
          <div className="border border-dashed border-neutral-300 p-2 dark:border-neutral-700">
            <BannerShowcase src={service.imageSrc} alt={`${service.name} Banner`} className="aspect-[16/6] md:aspect-[16/4.5]" />
          </div>
        )}

        {/* Hero Package Spec header */}
        <div className="relative space-y-4 overflow-hidden border border-dashed border-neutral-300 bg-neutral-50/50 p-8 dark:border-neutral-700 dark:bg-neutral-900/10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-dashed border-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
              Available Package
            </span>
            <span className="border-neutral-350 text-neutral-450 dark:border-neutral-650 border border-dashed px-2 py-0.5 font-mono text-[10px] uppercase">
              PKG-{service.id.slice(0, 4)}
            </span>
          </div>
          <h1 className="bg-gradient-to-r from-foreground to-neutral-500 bg-clip-text font-sans text-2xl font-bold tracking-tight text-foreground text-transparent md:text-4xl">
            {service.name}
          </h1>
          <p className="max-w-3xl font-sans text-xs leading-relaxed whitespace-pre-wrap text-neutral-500 md:text-sm">{service.description}</p>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Scope & Deliverables */}
          <div className="space-y-8 lg:col-span-2">
            {/* Core Deliverables list */}
            <div className="space-y-5 border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
              <div className="flex items-center gap-2 border-b border-dashed border-neutral-300 pb-3 dark:border-neutral-700">
                <Layers className="size-4.5 text-neutral-500" />
                <h3 className="font-sans text-sm font-bold tracking-wider text-foreground uppercase">Core Package Scope</h3>
              </div>

              {!service.features || service.features.length === 0 ? (
                <p className="font-sans text-xs text-neutral-400 italic">No specific deliverables list defined.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 border border-neutral-200 bg-neutral-50/20 p-3 dark:border-neutral-800">
                      <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-emerald-500" />
                      <span className="font-sans text-xs leading-normal text-neutral-600 dark:text-neutral-400">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Standard Engagement terms */}
            <div className="space-y-4 border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
              <div className="flex items-center gap-2 border-b border-dashed border-neutral-300 pb-3 dark:border-neutral-700">
                <ShieldCheck className="size-4.5 text-neutral-500" />
                <h3 className="font-sans text-sm font-bold tracking-wider text-foreground uppercase">Engagement & Delivery Terms</h3>
              </div>
              <ul className="grid grid-cols-1 gap-x-6 gap-y-3 font-sans text-xs leading-normal text-neutral-500 md:grid-cols-2">
                <li className="flex items-center gap-2">
                  <span className="bg-neutral-450 size-1.5 shrink-0 dark:bg-neutral-600" />
                  <span>Version control source code access via GitHub</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-neutral-450 size-1.5 shrink-0 dark:bg-neutral-600" />
                  <span>Weekly live review & deployment demo updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-neutral-450 size-1.5 shrink-0 dark:bg-neutral-600" />
                  <span>30-day post-delivery bug fixing support period</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-neutral-450 size-1.5 shrink-0 dark:bg-neutral-600" />
                  <span>Manual GCash / Maya / Wise checkout workflows</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Checkout Pricing Summary Panel */}
          <div className="h-fit space-y-6 lg:sticky lg:top-24">
            <div className="flex flex-col justify-between space-y-6 border border-dashed border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900/60">
              <div className="space-y-5">
                <div className="text-neutral-450 flex items-center gap-1.5 border-b border-dashed border-neutral-300 pb-3 font-mono text-[10px] uppercase dark:border-neutral-700">
                  <Sparkles className="size-3.5 animate-pulse text-emerald-500" /> Configure Order
                </div>

                {/* Price & Delivery Specs */}
                <div className="grid grid-cols-2 gap-4 border-b border-dashed border-neutral-300 pb-4 font-mono text-[11px] tracking-wider uppercase dark:border-neutral-700">
                  <div className="space-y-1">
                    <span className="text-neutral-450">Delivery</span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Clock className="size-3.5" />
                      {service.deliveryTime}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-neutral-450">Base Rate</span>
                    <div className="text-xs font-bold text-foreground">₱{service.price.toLocaleString()}</div>
                  </div>
                </div>

                {/* Upgrades checklist */}
                {service.addOns.length > 0 ? (
                  <div className="space-y-3">
                    <span className="block font-mono text-[9px] tracking-widest text-neutral-400 uppercase">Available Upgrades</span>
                    <div className="space-y-2.5">
                      {service.addOns.map((addon) => {
                        const selected = selectedAddons.includes(addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleAddon(addon.id)}
                            className={cn(
                              "flex cursor-pointer items-start gap-2.5 border border-dashed bg-background/50 p-3.5 transition-all select-none",
                              selected
                                ? "border-neutral-900 bg-neutral-100/10 dark:border-neutral-100"
                                : "border-neutral-300 hover:border-neutral-400 hover:bg-background dark:border-neutral-700"
                            )}
                          >
                            <button
                              type="button"
                              className={cn(
                                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-none border transition-colors",
                                selected
                                  ? "border-neutral-900 bg-neutral-900 text-white dark:bg-white dark:text-black"
                                  : "border-neutral-300 bg-transparent"
                              )}
                            >
                              {selected && <Check className="size-3" />}
                            </button>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="truncate font-sans text-xs font-bold text-foreground">{addon.name}</span>
                                <span className="shrink-0 font-mono text-xs font-bold text-foreground">+₱{addon.price.toLocaleString()}</span>
                              </div>
                              {addon.description && (
                                <p className="mt-1 line-clamp-2 font-sans text-[10px] leading-normal text-neutral-500">{addon.description}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-2 font-mono text-[10px] text-neutral-400 uppercase italic">No optional upgrades configured.</div>
                )}
              </div>

              {/* Checkout Pricing footer */}
              <div className="space-y-4 border-t border-dashed border-neutral-300 pt-4 dark:border-neutral-700">
                <div className="flex justify-between font-mono text-xs font-bold text-foreground">
                  <span>Investment Total:</span>
                  <span>₱{totalAmount.toLocaleString()}</span>
                </div>

                <Button
                  onClick={() => router.push(`/service/${service.slug}/checkout?addons=${selectedAddons.join(",")}`)}
                  className="h-10 w-full cursor-pointer rounded-none bg-foreground font-mono text-xs tracking-wider text-background uppercase transition-colors hover:bg-foreground/90"
                >
                  Order Package
                  <ArrowRight className="ml-1.5 size-3.5" />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="text-neutral-450 space-y-2 border border-dashed border-neutral-300 p-4 font-mono text-[9px] tracking-wider uppercase dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" />
                <span>Verified payments & invoice generation</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" />
                <span>Fully client-owned source code deliveries</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
