"use client";

import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GridCard } from "@/components/common/grid-card";
import { ArchiveFilterBar } from "@/components/common/archive-filter-bar";
import { ArchivePagination } from "@/components/common/archive-pagination";
import { useArchiveFilter } from "@/hooks/use-archive-filter";

import * as React from "react";
import type { Project } from "@/constants/projects";

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
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery, currentPage, setCurrentPage, totalPages, filteredItems, paginatedItems } =
    useArchiveFilter({
      items: initialProjects,
      searchKeys: ["title", "description", "tags", "tag"],
      itemsPerPage: 6,
    });

  const dynamicCategories = React.useMemo(() => {
    return [
      { id: "all", label: "All Works" },
      ...categories.map((c) => ({ id: c.slug, label: c.name })),
    ];
  }, [categories]);

  return (
    <Section id="archive" containerClassName="pt-6 md:pt-10 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-10">
        {/* Section Heading */}
        <SectionHeading
          label="Portfolio"
          title="Digital products engineered to scale and convert."
          description="Explore a curated collection of custom SaaS platforms, mobile apps, and enterprise AI integrations built to deliver high performance, solve complex problems, and drive business growth."
        />

        {/* Filter Control Center */}
        <ArchiveFilterBar
          categories={dynamicCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search projects..."
        />

        {/* Grid Results Section */}
        {paginatedItems.length > 0 ? (
          <div className="space-y-12">
            {/* Project Cards Grid */}
            <div className="grid animate-in grid-cols-1 border-t border-l border-dashed border-neutral-300 duration-300 fade-in md:grid-cols-2 lg:grid-cols-3 dark:border-neutral-700">
              {paginatedItems.map((project: Project) => (
                <GridCard
                  key={project.id}
                  tag={resolveCategories(project.categories, categories)}
                  title={project.title}
                  description={project.description}
                  imageSrc={project.imageSrc}
                  tags={project.tags}
                  link={{
                    href: project.link,
                    label: "View Project Details",
                  }}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <ArchivePagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredItems.length} onPageChange={setCurrentPage} />
          </div>
        ) : (
          <div className="dark:text-neutral-450 border border-dashed border-neutral-300 py-20 text-center font-mono text-xs text-neutral-500 dark:border-neutral-700">
            No projects matched your criteria.
          </div>
        )}
      </div>
    </Section>
  );
}
