import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GridCard } from "@/components/common/grid-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { ALL_PROJECTS } from "@/constants/projects";

const FEATURED_PROJECTS = ALL_PROJECTS.slice(0, 3);

export function FeaturedWorksSection() {
  return (
    <Section id="work" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        {/* Reusable Section Header with action link to view all projects */}
        <SectionHeading label="Featured Works" title="Software engineered for real-world application." />

        {/* 3-Column Architectural Project Grid using the common GridCard component */}
        <div className="grid grid-cols-1 border-t border-l border-dashed border-neutral-300 md:grid-cols-3 dark:border-neutral-700">
          {FEATURED_PROJECTS.map((project) => (
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
                label: "View Project",
              }}
            />
          ))}
        </div>

        {/* Unified "All Projects" link at the bottom, creating a natural reading flow */}
        <div className="flex justify-center pt-4">
          <Link href="/works" className="group">
            <Button
              variant="outline"
              size="lg"
              className="flex h-11 cursor-pointer items-center justify-center rounded-none px-6 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
            >
              All Projects
              <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
