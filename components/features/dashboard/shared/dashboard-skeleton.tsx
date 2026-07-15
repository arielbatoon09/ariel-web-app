import { Skeleton } from "@/components/ui/skeleton";

interface DashboardSkeletonProps {
  /** Show a big table skeleton (default) or a detail card layout */
  variant?: "table" | "detail" | "overview";
}

export function DashboardSkeleton({ variant = "table" }: DashboardSkeletonProps) {
  if (variant === "overview") {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-none" />
          <Skeleton className="h-7 w-48 rounded-none" />
        </div>

        {/* Metrics cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-dashed border-neutral-300 p-5 dark:border-neutral-700">
              <Skeleton className="mb-3 h-3 w-20 rounded-none" />
              <Skeleton className="h-8 w-16 rounded-none" />
            </div>
          ))}
        </div>

        {/* Two column content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-3 border border-dashed border-neutral-300 p-5 dark:border-neutral-700">
              <Skeleton className="h-3 w-28 rounded-none" />
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32 rounded-none" />
                  <Skeleton className="h-4 w-16 rounded-none" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-none" />
          <Skeleton className="h-7 w-64 rounded-none" />
        </div>

        {/* Detail card */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 space-y-4 border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-20 rounded-none" />
                <Skeleton className="h-9 w-full rounded-none" />
              </div>
            ))}
          </div>
          <div className="space-y-4 border border-dashed border-neutral-300 p-5 dark:border-neutral-700">
            <Skeleton className="h-3 w-20 rounded-none" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded-none" />
                <Skeleton className="h-4 w-12 rounded-none" />
              </div>
            ))}
            <Skeleton className="mt-4 h-10 w-full rounded-none" />
          </div>
        </div>
      </div>
    );
  }

  // Default: table variant
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 rounded-none" />
          <Skeleton className="h-7 w-48 rounded-none" />
        </div>
        <Skeleton className="h-9 w-28 rounded-none" />
      </div>

      {/* Search + filter toolbar */}
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 rounded-none" />
        <Skeleton className="h-9 w-24 rounded-none" />
      </div>

      {/* Table header */}
      <div className="border border-neutral-300 dark:border-neutral-700">
        <div className="grid grid-cols-5 gap-4 border-b border-neutral-300 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900/40">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full rounded-none" />
          ))}
        </div>

        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 border-b border-neutral-200 px-4 py-3.5 last:border-0 dark:border-neutral-800">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full rounded-none" style={{ opacity: 1 - i * 0.07 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
