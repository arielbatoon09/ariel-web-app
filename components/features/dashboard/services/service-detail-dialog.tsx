"use client";

import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { useServiceDetailQuery } from "@/hooks/use-services";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Clock, Layers, ArrowUpRight } from "lucide-react";

export function ServiceDetailDialog() {
  const { selectedServiceId, isServiceDetailsOpen, setIsServiceDetailsOpen, setSelectedServiceId } = useDashboardStore();

  const handleOpenChange = (open: boolean) => {
    setIsServiceDetailsOpen(open);
    if (!open) setSelectedServiceId(null);
  };

  return <ServiceDetailDialogContent id={selectedServiceId || ""} open={isServiceDetailsOpen} onOpenChange={handleOpenChange} />;
}

function ServiceDetailDialogContent({ id, open, onOpenChange }: { id: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { data: service, isLoading } = useServiceDetailQuery(id);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] [scrollbar-width:none] overflow-x-hidden overflow-y-auto rounded-none border border-neutral-300 bg-background/95 p-6 font-mono text-xs backdrop-blur-md [-ms-overflow-style:none] sm:max-w-[460px] dark:border-neutral-700 [&::-webkit-scrollbar]:hidden">
        {/* Decorative corners */}
        <div className="pointer-events-none absolute -top-px -left-px z-50 size-2.5 border-t-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -top-px -right-px z-50 size-2.5 border-t-2 border-r-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -bottom-px -left-px z-50 size-2.5 border-b-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -right-px -bottom-px z-50 size-2.5 border-r-2 border-b-2 border-neutral-400 dark:border-neutral-500" />

        <DialogHeader className="space-y-2">
          <DialogTitle className="font-sans text-sm font-bold tracking-widest text-foreground uppercase">Package Specifications</DialogTitle>
          <DialogDescription className="font-mono text-[10px] text-neutral-400 uppercase">
            Read-only configuration summary of deliverables and pricing.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-neutral-450 flex h-32 animate-pulse items-center justify-center font-mono text-[10px] tracking-wider uppercase">
            Loading specifications...
          </div>
        ) : !service ? (
          <div className="py-6 text-center text-neutral-400">Service package not found.</div>
        ) : (
          <div className="mt-6 space-y-5">
            {/* Name & Description */}
            <div className="space-y-1.5">
              <span className="block text-[9px] tracking-wider text-neutral-400 uppercase">Title & Summary</span>
              <div className="font-sans text-sm font-bold text-foreground">{service.name}</div>
              <p className="line-clamp-3 font-sans text-xs leading-relaxed text-neutral-500">{service.description}</p>
            </div>

            {/* Price & Delivery timeline */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-dashed border-neutral-300 py-3 dark:border-neutral-700">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[9px] text-neutral-400 uppercase">
                  <Clock className="size-3.5" /> Timeline
                </span>
                <span className="font-sans text-xs font-bold text-foreground">{service.deliveryTime}</span>
              </div>
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[9px] text-neutral-400 uppercase">₱ Base Price</span>
                <span className="font-sans text-xs font-bold text-foreground">₱{service.price.toLocaleString()}</span>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-2">
              <span className="block flex items-center gap-1 text-[9px] tracking-wider text-neutral-400 uppercase">
                <Layers className="size-3.5" /> Core Deliverables ({service.features?.length || 0})
              </span>
              {!service.features || service.features.length === 0 ? (
                <p className="text-neutral-500 italic">No features specified.</p>
              ) : (
                <ul className="space-y-1.5 pl-1.5 font-sans text-xs text-neutral-600 dark:text-neutral-400">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 bg-neutral-400 dark:bg-neutral-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Addons list */}
            <div className="space-y-2 border-t border-dashed border-neutral-200 pt-2 dark:border-neutral-800">
              <span className="block flex items-center gap-1 text-[9px] tracking-wider text-neutral-400 uppercase">
                <Settings className="size-3.5" /> Optional Upgrades ({service.addOns?.length || 0})
              </span>
              {!service.addOns || service.addOns.length === 0 ? (
                <p className="text-[10px] text-neutral-500 italic">No addons configured.</p>
              ) : (
                <div className="max-h-[160px] space-y-2.5 overflow-y-auto pr-1">
                  {service.addOns.map((addon) => (
                    <div key={addon.id} className="border border-dashed border-neutral-300 bg-neutral-50/30 p-2 dark:border-neutral-700">
                      <div className="flex items-center justify-between gap-2 font-sans font-semibold text-foreground">
                        <span>{addon.name}</span>
                        <span className="font-mono text-xs font-bold">+₱{addon.price.toLocaleString()}</span>
                      </div>
                      {addon.description && (
                        <p className="mt-1 line-clamp-2 font-sans text-[10px] leading-normal text-neutral-500">{addon.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Button */}
            <div className="flex justify-end gap-3 border-t border-dashed border-neutral-300 pt-4 dark:border-neutral-700">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-9 rounded-none border-dashed font-mono text-[10px] uppercase"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  router.push(`/admin/services/${id}/edit`);
                }}
                className="h-9 gap-1.5 rounded-none bg-foreground font-mono text-[10px] text-background uppercase hover:bg-foreground/90"
              >
                Edit Package
                <ArrowUpRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
