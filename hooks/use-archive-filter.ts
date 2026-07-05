import { useState, useMemo } from "react";

interface UseArchiveFilterOptions<T> {
  items: T[];
  categoryKey?: keyof T; // Key to filter category if items are objects
  searchKeys: (keyof T | string)[]; // Keys to match against query
  itemsPerPage?: number;
}

export function useArchiveFilter<T>({
  items,
  searchKeys,
  itemsPerPage = 6
}: UseArchiveFilterOptions<T>) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    return items.filter((item: any) => {
      // Category Match
      const matchesCategory =
        activeCategory === "all" ||
        (item.categories && item.categories.includes(activeCategory)) ||
        (item.category && item.category === activeCategory);

      // Search Query Match
      const matchesSearch =
        searchQuery === "" ||
        searchKeys.some((key) => {
          const val = item[key];
          if (Array.isArray(val)) {
            return val.some((tag: string) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          if (typeof val === "string") {
            return val.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return false;
        });

      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery, searchKeys]);

  // Reset pagination when category or search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = useMemo(() => {
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, startIndex, itemsPerPage]);

  return {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredItems,
    paginatedItems
  };
}
