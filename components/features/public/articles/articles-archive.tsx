"use client";

import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GridCard } from "@/components/common/grid-card";
import { ArchiveFilterBar } from "@/components/common/archive-filter-bar";
import { ArchivePagination } from "@/components/common/archive-pagination";
import { useArchiveFilter } from "@/hooks/use-archive-filter";

import { ALL_ARTICLES, type Article } from "@/constants/articles";

const CATEGORIES = [
  { id: "all", label: "All Articles" },
  { id: "engineering", label: "Engineering" },
  { id: "design", label: "Design" },
  { id: "ai", label: "Artificial Intelligence" },
  { id: "business", label: "Business & Strategy" },
] as const;

export function ArticlesArchive() {
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery, currentPage, setCurrentPage, totalPages, filteredItems, paginatedItems } =
    useArchiveFilter({
      items: ALL_ARTICLES,
      searchKeys: ["title", "description", "tags", "tag"],
      itemsPerPage: 6,
    });

  return (
    <Section id="articles-archive" containerClassName="pt-6 md:pt-10 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-10">
        {/* Section Heading */}
        <SectionHeading
          label="Writing & Insights"
          title="Architectural thinking, code design, and tech strategy."
          description="Explore high-level concepts, detailed engineering posts, and strategy guides aimed at optimizing software development, integrating artificial intelligence, and constructing modular designs."
        />

        {/* Filter Control Center */}
        <ArchiveFilterBar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search articles..."
        />

        {/* Grid Results Section */}
        {paginatedItems.length > 0 ? (
          <div className="space-y-12">
            {/* Articles Cards Grid */}
            <div className="grid animate-in grid-cols-1 border-t border-l border-dashed border-neutral-300 duration-300 fade-in md:grid-cols-2 lg:grid-cols-3 dark:border-neutral-700">
              {paginatedItems.map((article: Article) => (
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
            <ArchivePagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredItems.length} onPageChange={setCurrentPage} />
          </div>
        ) : (
          <div className="dark:text-neutral-450 border border-dashed border-neutral-300 py-20 text-center font-mono text-xs text-neutral-500 dark:border-neutral-700">
            No articles matched your criteria.
          </div>
        )}
      </div>
    </Section>
  );
}
