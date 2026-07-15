import { Clock, ShoppingBag, CheckCircle } from "lucide-react";

interface CustomerOverviewMetricsProps {
  activeProjectsCount: number;
  totalOrdersCount: number;
}

export function CustomerOverviewMetrics({ activeProjectsCount, totalOrdersCount }: CustomerOverviewMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="border border-neutral-300 bg-neutral-50/50 p-5 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/40">
        <div className="flex items-center justify-between">
          <span className="text-neutral-450 font-mono text-[10px] tracking-wider uppercase">Active Projects</span>
          <Clock className="size-4 text-blue-500" />
        </div>
        <p className="mt-3 font-sans text-2xl font-bold text-foreground">{activeProjectsCount}</p>
        <span className="mt-1 block font-mono text-[9px] text-neutral-500">Currently in active development cycle</span>
      </div>

      <div className="border border-neutral-300 bg-neutral-50/50 p-5 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/40">
        <div className="flex items-center justify-between">
          <span className="text-neutral-450 font-mono text-[10px] tracking-wider uppercase">Total Orders</span>
          <ShoppingBag className="size-4 text-green-500" />
        </div>
        <p className="mt-3 font-sans text-2xl font-bold text-foreground">{totalOrdersCount}</p>
        <span className="mt-1 block font-mono text-[9px] text-neutral-500">Sum of all purchased service tiers</span>
      </div>

      <div className="border border-neutral-300 bg-neutral-50/50 p-5 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/40">
        <div className="flex items-center justify-between">
          <span className="text-neutral-450 font-mono text-[10px] tracking-wider uppercase">Security Clearance</span>
          <CheckCircle className="size-4 text-neutral-500" />
        </div>
        <p className="mt-3 font-mono text-sm font-bold text-foreground uppercase">CLIENT_ROLE</p>
        <span className="mt-1 block font-mono text-[9px] text-neutral-500">Access limited to owned properties</span>
      </div>
    </div>
  );
}
