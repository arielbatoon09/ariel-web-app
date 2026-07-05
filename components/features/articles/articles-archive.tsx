"use client";

import { useState, useMemo } from "react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GridCard } from "@/components/common/grid-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { ALL_ARTICLES, type Article } from "@/constants/articles";

const CATEGORIES = [
  { id: "all", label: "All Articles" },
  { id: "engineering", label: "Engineering" },
  { id: "design", label: "Design" },
  { id: "ai", label: "Artificial Intelligence" },
  { id: "business", label: "Business & Strategy" }
] as const;

const ITEMS_PER_PAGE = 6;

export function ArticlesArchive() {
  const [activeCategory, setActiveCategory] = useState<"all" | "engineering" | "design" | "ai" | "business">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Search Logic
  const filteredArticles = useMemo(() => {
    return ALL_ARTICLES.filter((article) => {
      const matchesCategory = activeCategory === "all" || article.categories.includes(activeCategory);
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Reset pagination when filter or search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = useMemo(() => {
    return filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredArticles, startIndex]);

  return (
    <Section id="articles-archive" containerClassName="pt-4 md:pt-6 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-10">
        {/* Section Heading */}
        <SectionHeading
          label="Writing & Insights"
          title="Architectural thinking, code design, and tech strategy."
          description="Explore high-level concepts, detailed engineering posts, and strategy guides aimed at optimizing software development, integrating artificial intelligence, and constructing modular designs."
        />

        {/* Search Control Center */}
        <div className="flex justify-start border-b border-dashed border-neutral-300 dark:border-neutral-700 pb-6">
          {/* Search Input Bar */}
          <div className="relative w-full lg:max-w-xs">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
              <Search className="size-4" />
            </span>
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-none border-dashed border-neutral-300 dark:border-neutral-700 focus-visible:border-neutral-900 dark:focus-visible:border-neutral-100 bg-transparent h-10 font-mono text-xs placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Grid Results Section */}
        {paginatedArticles.length > 0 ? (
          <div className="space-y-12">
            {/* Articles Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-dashed border-neutral-300 dark:border-neutral-700 animate-in fade-in duration-300">
              {paginatedArticles.map((article) => (
                <GridCard
                  key={article.id}
                  number={article.id}
                  tag={`${article.date} • ${article.readTime}`}
                  title={article.title}
                  description={article.description}
                  imageSrc={article.imageSrc}
                  tags={article.tags}
                  link={{
                    href: article.link,
                    label: "Read Full Article",
                  }}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-dashed border-neutral-300 dark:border-neutral-700">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
                  <CornerDownRight className="size-3" />
                  Page {currentPage} of {totalPages} ({filteredArticles.length} total)
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="rounded-none h-9 text-xs font-mono uppercase tracking-wider border-dashed disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronLeft className="mr-1 size-3.5" />
                    Prev
                  </Button>
                  
                  {/* Page number buttons */}
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "rounded-none h-9 w-9 p-0 text-xs font-mono cursor-pointer",
                            currentPage !== pageNum && "border-dashed"
                          )}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="rounded-none h-9 text-xs font-mono uppercase tracking-wider border-dashed disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    Next
                    <ChevronRight className="ml-1 size-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-450 font-mono text-xs">
            No articles matched your criteria.
          </div>
        )}
      </div>
    </Section>
  );
}
