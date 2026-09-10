"use client";

import { useMemo, useCallback } from "react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GridCard } from "@/components/common/grid-card";
import { ArchiveFilterBar } from "@/components/common/archive-filter-bar";
import { ArchivePagination } from "@/components/common/archive-pagination";
import { useArchiveFilter } from "@/hooks/use-archive-filter";
import { useListingLayout } from "@/hooks/use-listing-layout";
import { useArticlesQuery } from "@/hooks/use-articles";
import type { Article } from "@/schemas/dashboard";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectDialog } from "@/components/common/connect-dialog";
import { cn } from "@/lib/utils";

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
  const { data: allArticles = initialArticles } = useArticlesQuery(initialArticles);
  const { layout, setLayout } = useListingLayout();

  const articles = useMemo(
    () =>
      allArticles
        .filter((a) => a.status === "published")
        .map((a) => ({
          ...a,
          id: a.id.toString(),
          categories: a.categories as string[],
          seo: a.seo ?? undefined,
        }))
        .sort((a, b) => {
          const dateA = new Date(a.date).getTime() || 0;
          const dateB = new Date(b.date).getTime() || 0;
          if (dateB !== dateA) {
            return dateB - dateA;
          }
          return a.title.localeCompare(b.title);
        }),
    [allArticles]
  );

  const getCategoriesLabel = useCallback((slugs: string[]) => resolveCategories(slugs, categories), [categories]);

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
      items: articles,
      searchKeys: ["title", "description", "tags"],
      itemsPerPage: 6,
    });

  return (
    <Section id="articles-archive" containerClassName="pt-6 md:pt-10 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-10">
        <SectionHeading
          label="Writing & Insights"
          title="Notes on building software."
          description="Short posts on engineering, architecture, and shipping products."
        />

        <ArchiveFilterBar
          categories={dynamicCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search articles..."
          layout={layout}
          onLayoutChange={setLayout}
        />

        {paginatedItems.length > 0 ? (
          <div className="space-y-12">
            <div
              className={cn(
                "animate-in border-t border-l border-dashed border-neutral-300 duration-300 fade-in dark:border-neutral-700",
                "grid grid-cols-1",
                layout === "grid" && "md:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {paginatedItems.map((article: Article) => (
                <GridCard
                  key={article.id}
                  variant={layout}
                  tag={getCategoriesLabel(article.categories)}
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

            <ArchivePagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredItems.length} onPageChange={setCurrentPage} />
          </div>
        ) : (
          <Empty className="rounded-none border border-dashed border-neutral-300 bg-neutral-50/20 py-20 dark:border-neutral-700 dark:bg-neutral-900/10">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="mb-1 size-10 rounded-none border border-dashed border-neutral-300 bg-background text-neutral-400 dark:border-neutral-700"
              >
                <BookOpen className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="font-mono text-xs tracking-widest text-neutral-400 uppercase">No articles matched your criteria</EmptyTitle>
              <EmptyDescription className="max-w-xs font-sans text-xs leading-relaxed text-neutral-500">
                Try selecting a different category or adjusting your search query to discover relevant engineering publications.
              </EmptyDescription>
            </EmptyHeader>
            <ConnectDialog triggerText="Let's Talk">
              <Button className="mt-2 h-9 gap-1.5 rounded-none font-mono text-[10px] uppercase">
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
