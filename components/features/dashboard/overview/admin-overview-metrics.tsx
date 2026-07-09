import { DollarSign, ShoppingBag, Briefcase, FileText } from "lucide-react";

interface AdminOverviewMetricsProps {
  totalSales: number;
  activeOrdersCount: number;
  worksCount: number;
  articlesCount: number;
}

export function AdminOverviewMetrics({
  totalSales,
  activeOrdersCount,
  worksCount,
  articlesCount,
}: AdminOverviewMetricsProps) {
  const stats = [
    {
      label: "Total Sales",
      value: `₱${totalSales.toLocaleString()}`,
      icon: <DollarSign className="size-4 text-neutral-400" />,
      description: "Sum of successful transactions",
    },
    {
      label: "Active Orders",
      value: activeOrdersCount,
      icon: <ShoppingBag className="size-4 text-neutral-400" />,
      description: "Orders in queue or production",
    },
    {
      label: "Works Published",
      value: worksCount,
      icon: <Briefcase className="size-4 text-neutral-400" />,
      description: "Case studies in portfolio",
    },
    {
      label: "Articles Published",
      value: articlesCount,
      icon: <FileText className="size-4 text-neutral-400" />,
      description: "Blog posts written",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="relative border border-neutral-300 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-900/60">
          {/* Corners intersection plus markers */}
          <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">
            +
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 z-20 -translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">
            +
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase dark:text-neutral-500">{stat.label}</span>
            {stat.icon}
          </div>
          <div className="mt-2.5">
            <span className="font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">{stat.value}</span>
            <p className="text-neutral-505 mt-1 text-[10px] dark:text-neutral-400">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
