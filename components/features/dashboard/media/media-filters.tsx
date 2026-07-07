"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { useMediaQuery } from "@/hooks/use-media";

export function MediaFilters() {
  const { data: assets = [] } = useMediaQuery();

  const search = useDashboardStore((s) => s.mediaSearch);
  const activeYear = useDashboardStore((s) => s.mediaActiveYear);
  const setSearch = useDashboardStore((s) => s.setMediaSearch);
  const setActiveYear = useDashboardStore((s) => s.setMediaActiveYear);

  const years = React.useMemo(() => {
    const yearSet = new Set<string>();
    assets.forEach((a) => {
      const parts = a.folder.split("/");
      const year = parts[parts.length - 1];
      if (/^\d{4}$/.test(year)) yearSet.add(year);
    });
    return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
  }, [assets]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-1">
        <button
          onClick={() => setActiveYear(null)}
          className={cn(
            "rounded-none border px-3 py-1 font-mono text-[10px] uppercase transition-colors",
            activeYear === null
              ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
              : "border-dashed border-neutral-300 text-neutral-500 hover:border-neutral-400 hover:text-foreground dark:border-neutral-700 dark:hover:border-neutral-500"
          )}
        >
          All
        </button>
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className={cn(
              "rounded-none border px-3 py-1 font-mono text-[10px] uppercase transition-colors",
              activeYear === year
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                : "border-dashed border-neutral-300 text-neutral-500 hover:border-neutral-400 hover:text-foreground dark:border-neutral-700 dark:hover:border-neutral-500"
            )}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="relative w-full sm:w-60">
        <Search className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-neutral-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by filename..."
          className="h-8 rounded-none border-dashed pl-7 font-mono text-[10px]"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <X className="size-3" />
          </button>
        )}
      </div>
    </div>
  );
}
