"use client";

import { useState, useMemo } from "react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GridCard } from "@/components/common/grid-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { ALL_PROJECTS, type Project } from "@/constants/projects";

const CATEGORIES = [
  { id: "all", label: "All Works" },
  { id: "web", label: "Web / SaaS" },
  { id: "mobile", label: "Mobile Apps" },
  { id: "ai-data", label: "AI & Systems" },
  { id: "open-source", label: "Open Source" }
] as const;

const ITEMS_PER_PAGE = 6;

export function WorksArchive() {
  const [activeCategory, setActiveCategory] = useState<"all" | "web" | "mobile" | "ai-data" | "open-source">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Search Logic
  const filteredProjects = useMemo(() => {
    return ALL_PROJECTS.filter((project) => {
      const matchesCategory = activeCategory === "all" || project.categories.includes(activeCategory);
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Reset pagination when filter or search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = useMemo(() => {
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, startIndex]);

  return (
    <Section id="archive" containerClassName="pt-4 md:pt-6 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-10">
        {/* Section Heading */}
        <SectionHeading
          label="Portfolio"
          title="Digital products engineered to scale and convert."
          description="Explore a curated collection of custom SaaS platforms, mobile apps, and enterprise AI integrations built to deliver high performance, solve complex problems, and drive business growth."
        />

        {/* Search & Category Filter Control Center */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-dashed border-neutral-300 dark:border-neutral-700 pb-6">
          {/* Category Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2.5 order-2 lg:order-1">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
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
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-none border-dashed border-neutral-300 dark:border-neutral-700 focus-visible:border-neutral-900 dark:focus-visible:border-neutral-100 bg-transparent h-10 font-mono text-xs placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Grid Results Section */}
        {paginatedProjects.length > 0 ? (
          <div className="space-y-12">
            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-dashed border-neutral-300 dark:border-neutral-700 animate-in fade-in duration-300">
              {paginatedProjects.map((project) => (
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
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-dashed border-neutral-300 dark:border-neutral-700">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
                  <CornerDownRight className="size-3" />
                  Page {currentPage} of {totalPages} ({filteredProjects.length} total)
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
            No projects matched your criteria.
          </div>
        )}
      </div>
    </Section>
  );
}
