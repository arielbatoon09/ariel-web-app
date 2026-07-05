import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  label: string;
}

interface ArchiveFilterBarProps {
  categories: readonly Category[] | Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
}

export function ArchiveFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
}: ArchiveFilterBarProps) {
  return (
    <div className="flex flex-col justify-between gap-6 border-b border-dashed border-neutral-300 pb-6 lg:flex-row lg:items-center dark:border-neutral-700">
      {/* Category Selector Tabs */}
      <div className="order-2 flex flex-wrap items-center gap-2.5 lg:order-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "cursor-pointer rounded-none border px-4 py-2 font-mono text-xs tracking-wider uppercase transition-all duration-300 select-none",
              activeCategory === category.id
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-black"
                : "border-dashed border-neutral-300 text-neutral-500 hover:border-neutral-900 hover:text-foreground dark:border-neutral-700 dark:hover:border-neutral-100"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="relative order-1 w-full lg:order-2 lg:max-w-xs">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
          <Search className="size-4" />
        </span>
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 rounded-none border-dashed border-neutral-300 bg-transparent pl-9 font-mono text-xs placeholder:text-neutral-400 focus-visible:border-neutral-900 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
        />
      </div>
    </div>
  );
}
