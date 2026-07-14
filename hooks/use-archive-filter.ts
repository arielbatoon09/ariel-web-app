import { useState, useMemo, useCallback } from "react";

interface UseArchiveFilterOptions<T> {
  items: T[];
  categoryKey?: keyof T; // Key to filter category if items are objects
  searchKeys: (keyof T | string)[]; // Keys to match against query
  itemsPerPage?: number;
}

export function useArchiveFilter<T>({ items, searchKeys, itemsPerPage = 6 }: UseArchiveFilterOptions<T>) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    return items.filter((item: T) => {
      const itemRecord = item as Record<string, unknown>;
      // Category Match
      const matchesCategory =
        activeCategory === "all" ||
        (Array.isArray(itemRecord.categories) && itemRecord.categories.includes(activeCategory)) ||
        (typeof itemRecord.category === "string" && itemRecord.category === activeCategory);

      // Search Query Match
      const matchesSearch =
        searchQuery === "" ||
        searchKeys.some((key) => {
          const val = itemRecord[key as string];
          if (Array.isArray(val)) {
            return val.some((tag: unknown) => typeof tag === "string" && tag.toLowerCase().includes(searchQuery.toLowerCase()));
          }
          if (typeof val === "string") {
            return val.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return false;
        });

      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery, searchKeys]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = useMemo(() => {
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, startIndex, itemsPerPage]);

  return {
    activeCategory,
    setActiveCategory: handleCategoryChange,
    searchQuery,
    setSearchQuery: handleSearchChange,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredItems,
    paginatedItems,
  };
}
