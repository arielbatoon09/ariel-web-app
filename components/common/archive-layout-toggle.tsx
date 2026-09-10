"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListingLayout } from "@/hooks/use-listing-layout";

interface ArchiveLayoutToggleProps {
  layout: ListingLayout;
  onLayoutChange: (layout: ListingLayout) => void;
  className?: string;
}

export function ArchiveLayoutToggle({ layout, onLayoutChange, className }: ArchiveLayoutToggleProps) {
  return (
    <div
      className={cn("inline-flex items-center border border-dashed border-neutral-300 dark:border-neutral-700", className)}
      role="group"
      aria-label="Listing layout"
    >
      <button
        type="button"
        onClick={() => onLayoutChange("grid")}
        aria-pressed={layout === "grid"}
        title="Grid layout"
        className={cn(
          "flex h-9 w-9 cursor-pointer items-center justify-center transition-colors",
          layout === "grid"
            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black"
            : "text-neutral-500 hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-900"
        )}
      >
        <LayoutGrid className="size-3.5" />
        <span className="sr-only">Grid</span>
      </button>
      <button
        type="button"
        onClick={() => onLayoutChange("list")}
        aria-pressed={layout === "list"}
        title="List layout"
        className={cn(
          "flex h-9 w-9 cursor-pointer items-center justify-center border-l border-dashed border-neutral-300 transition-colors dark:border-neutral-700",
          layout === "list"
            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black"
            : "text-neutral-500 hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-900"
        )}
      >
        <List className="size-3.5" />
        <span className="sr-only">List</span>
      </button>
    </div>
  );
}
