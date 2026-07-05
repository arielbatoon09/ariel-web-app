import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GridCard } from "@/components/common/grid-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
  tags: string[];
  link: string;
}

const FEATURED_PROJECTS: Project[] = [
  {
    id: "01",
    tag: "Custom SaaS / Web Platform",
    title: "Apex Logistics Platform",
    description: "An automated administrative panel and client portal engineered to streamline cargo tracking, automated billing, and live routing pipelines.",
    imageSrc: "/projects/project-logistics.png",
    tags: ["Next.js", "Node.js", "PostgreSQL"],
    link: "#",
  },
  {
    id: "02",
    tag: "Mobile E-Commerce App",
    title: "Nova Retail Mobile App",
    description: "An offline-first, high-conversion mobile shopping experience featuring secure checkouts, real-time push alerts, and fluid catalog browsing.",
    imageSrc: "/projects/project-retail.png",
    tags: ["React Native", "TypeScript", "FastAPI"],
    link: "#",
  },
  {
    id: "03",
    tag: "AI / Enterprise Software",
    title: "Insight Document Search",
    description: "A semantic search engine and AI-powered document analyzer utilizing vector databases to deliver instant, contextual answers for enterprise files.",
    imageSrc: "/projects/project-search.png",
    tags: ["Python", "OpenAI", "Pinecone"],
    link: "#",
  },
];

export function FeaturedWorksSection() {
  return (
    <Section id="work" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        {/* Reusable Section Header with action link to view all projects */}
        <SectionHeading
          label="Featured Works"
          title="Software engineered for real-world application."
        />

        {/* 3-Column Architectural Project Grid using the common GridCard component */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-dashed border-neutral-300 dark:border-neutral-700">
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
          <Link
            href="#archive"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-foreground dark:text-neutral-500 dark:hover:text-foreground transition-colors duration-200 group"
          >
            All Projects
            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
