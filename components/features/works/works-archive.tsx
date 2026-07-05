"use client";

import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GridCard } from "@/components/common/grid-card";
import { ArchiveFilterBar } from "@/components/common/archive-filter-bar";
import { ArchivePagination } from "@/components/common/archive-pagination";
import { useArchiveFilter } from "@/hooks/use-archive-filter";

import { ALL_PROJECTS } from "@/constants/projects";

const CATEGORIES = [
  { id: "all", label: "All Works" },
  { id: "web", label: "Web / SaaS" },
  { id: "mobile", label: "Mobile Apps" },
  { id: "ai-data", label: "AI & Systems" },
  { id: "open-source", label: "Open Source" }
] as const;

export function WorksArchive() {
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredItems,
    paginatedItems
  } = useArchiveFilter({
    items: ALL_PROJECTS,
    searchKeys: ["title", "description", "tags", "tag"],
    itemsPerPage: 6
  });

  return (
    <Section id="archive" containerClassName="pt-4 md:pt-6 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-10">
        {/* Section Heading */}
        <SectionHeading
          label="Portfolio"
          title="Digital products engineered to scale and convert."
          description="Explore a curated collection of custom SaaS platforms, mobile apps, and enterprise AI integrations built to deliver high performance, solve complex problems, and drive business growth."
        />

        {/* Filter Control Center */}
        <ArchiveFilterBar
          categories={CATEGORIES}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-dashed border-neutral-300 dark:border-neutral-700 animate-in fade-in duration-300">
              {paginatedItems.map((project: any) => (
                <GridCard
                  key={project.id}
                  number={project.id}
                  tag={project.tag}
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
            <ArchivePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredItems.length}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-450 font-mono text-xs">
            No projects matched your criteria.
          </div>
        )}
      </div>
    </Section>
  );
}
