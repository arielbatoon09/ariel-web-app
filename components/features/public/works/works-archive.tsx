"use client";

import { useMemo, useCallback } from "react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GridCard } from "@/components/common/grid-card";
import { ArchiveFilterBar } from "@/components/common/archive-filter-bar";
import { ArchivePagination } from "@/components/common/archive-pagination";
import { useArchiveFilter } from "@/hooks/use-archive-filter";
import { useListingLayout } from "@/hooks/use-listing-layout";
import { useWorksQuery } from "@/hooks/use-works";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty";
import { FolderX, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectDialog } from "@/components/common/connect-dialog";
import { cn } from "@/lib/utils";
import type { Project } from "@/schemas/dashboard";

interface WorksCategory {
  id: string;
  name: string;
  slug: string;
}

interface WorksArchiveProps {
  initialProjects: Project[];
  categories: WorksCategory[];
}

function resolveCategories(slugs: string[], categories: WorksCategory[]): string {
  if (!slugs || slugs.length === 0) return "";
  return slugs
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((match): match is WorksCategory => !!match)
    .map((match) => match.name.toUpperCase())
    .join(" • ");
}

export function WorksArchive({ initialProjects, categories }: WorksArchiveProps) {
  const { data: allProjects = initialProjects } = useWorksQuery(initialProjects);
  const { layout, setLayout } = useListingLayout();

  const projects = useMemo(
    () =>
      allProjects
        .filter((p) => p.status === "published")
        .map((p) => ({
          ...p,
          id: p.id.toString(),
          categories: p.categories as ("web" | "mobile" | "ai-data" | "open-source")[],
          seo: p.seo ?? undefined,
        })),
    [allProjects]
  );

  const getCategoriesLabel = useCallback((slugs: string[]) => resolveCategories(slugs, categories), [categories]);

  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery, currentPage, setCurrentPage, totalPages, filteredItems, paginatedItems } =
    useArchiveFilter({
      items: projects,
      searchKeys: ["title", "description", "tags", "tag"],
      itemsPerPage: 6,
    });

  const dynamicCategories = useMemo(() => {
    return [{ id: "all", label: "All Works" }, ...categories.map((c) => ({ id: c.slug, label: c.name }))];
  }, [categories]);

  return (
    <Section id="archive" containerClassName="pt-6 md:pt-10 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-10">
        <SectionHeading
          label="Portfolio"
          title="Selected work I've shipped."
          description="A curated set of public projects across web, mobile, and AI. Client work under NDA is not listed here."
        />

        <ArchiveFilterBar
          categories={dynamicCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search projects..."
          layout={layout}
          onLayoutChange={setLayout}
        />

        {paginatedItems.length > 0 ? (
          <div className="space-y-12">
            <div
              className={cn(
                "animate-in border-t border-l border-dashed border-neutral-300 duration-300 fade-in dark:border-neutral-700",
                // Mobile always single-column list; desktop grid when selected
                "grid grid-cols-1",
                layout === "grid" && "md:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {paginatedItems.map((project: Project, index: number) => (
                <GridCard
                  key={project.id}
                  variant={layout}
                  tag={getCategoriesLabel(project.categories)}
                  title={project.title}
                  description={project.description}
                  imageSrc={project.imageSrc}
                  tags={project.tags}
                  link={{
                    href: project.link,
                    label: "View Project Details",
                  }}
                  showEmptyImageState={true}
                  priority={currentPage === 1 && index === 0}
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
                <FolderX className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="font-mono text-xs tracking-widest text-neutral-400 uppercase">No projects matched your criteria</EmptyTitle>
              <EmptyDescription className="max-w-xs font-sans text-xs leading-relaxed text-neutral-500">
                Try selecting a different category or adjusting your search term to discover relevant engineering works.
              </EmptyDescription>
            </EmptyHeader>
            <ConnectDialog triggerText="Let's Talk">
              <Button className="mt-2 h-9 gap-1.5 rounded-none font-mono text-[10px] uppercase">
                Discuss Custom Scope
                <ArrowUpRight className="size-3.5" />
              </Button>
            </ConnectDialog>
          </Empty>
        )}
      </div>
    </Section>
  );
}
