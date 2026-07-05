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
  onCategoryChange: (id: any) => void;
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
  searchPlaceholder = "Search..."
}: ArchiveFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-dashed border-neutral-300 dark:border-neutral-700 pb-6">
      {/* Category Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 order-2 lg:order-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-all duration-300 cursor-pointer select-none rounded-none",
              activeCategory === category.id
                ? "bg-neutral-900 border-neutral-900 text-white dark:bg-neutral-100 dark:border-neutral-100 dark:text-black"
                : "border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-foreground hover:border-neutral-900 dark:hover:border-neutral-100"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full lg:max-w-xs order-1 lg:order-2">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
          <Search className="size-4" />
        </span>
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 rounded-none border-dashed border-neutral-300 dark:border-neutral-700 focus-visible:border-neutral-900 dark:focus-visible:border-neutral-100 bg-transparent h-10 font-mono text-xs placeholder:text-neutral-400"
        />
      </div>
    </div>
  );
}
