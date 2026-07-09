"use client";

import { useMemo } from "react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GridCard } from "@/components/common/grid-card";
import { ArchiveFilterBar } from "@/components/common/archive-filter-bar";
import { ArchivePagination } from "@/components/common/archive-pagination";
import { useArchiveFilter } from "@/hooks/use-archive-filter";
import type { Article } from "@/schemas/dashboard";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectDialog } from "@/components/common/connect-dialog";

interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
}

interface ArticlesArchiveProps {
  initialArticles: Article[];
  categories: ArticleCategory[];
}

function resolveCategories(slugs: string[], categories: ArticleCategory[]): string {
  if (!slugs || slugs.length === 0) return "";
  return slugs
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((match): match is ArticleCategory => !!match)
    .map((match) => match.name.toUpperCase())
    .join(" • ");
}

export function ArticlesArchive({ initialArticles, categories }: ArticlesArchiveProps) {
  const dynamicCategories = useMemo(() => {
    return [
      { id: "all", label: "All Articles" },
      ...categories.map((c) => ({
        id: c.slug,
        label: c.name,
      })),
    ];
  }, [categories]);

  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery, currentPage, setCurrentPage, totalPages, filteredItems, paginatedItems } =
    useArchiveFilter({
      items: initialArticles,
      searchKeys: ["title", "description", "tags"],
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
          categories={dynamicCategories}
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
                  tag={resolveCategories(article.categories, categories)}
                  number={`${article.date} • ${article.readTime}`}
                  title={article.title}
                  description={article.description}
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
          <Empty className="border border-dashed border-neutral-300 dark:border-neutral-700 py-20 rounded-none bg-neutral-50/20 dark:bg-neutral-900/10">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="border border-dashed border-neutral-300 dark:border-neutral-700 bg-background text-neutral-400 size-10 rounded-none mb-1">
                <BookOpen className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="font-mono text-xs text-neutral-400 uppercase tracking-widest">No articles matched your criteria</EmptyTitle>
              <EmptyDescription className="font-sans text-xs text-neutral-500 max-w-xs leading-relaxed">
                Try selecting a different category or adjusting your search query to discover relevant engineering publications.
              </EmptyDescription>
            </EmptyHeader>
            <ConnectDialog triggerText="Let's Talk">
              <Button className="mt-2 h-9 rounded-none font-mono text-[10px] uppercase gap-1.5">
                Suggest a Topic / Ask
                <ArrowUpRight className="size-3.5" />
              </Button>
            </ConnectDialog>
          </Empty>
        )}
      </div>
    </Section>
  );
}
