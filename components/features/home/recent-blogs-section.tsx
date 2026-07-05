import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GridCard } from "@/components/common/grid-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: string;
  date: string;
  readTime: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

const RECENT_BLOGS: BlogPost[] = [
  {
    id: "01",
    date: "June 28, 2026",
    readTime: "5 min read",
    title: "Scaling Next.js Serverless Databases",
    description: "An in-depth look at connection pooling strategies, cold start optimizations, and stateful caching solutions in serverless runtime environments.",
    tags: ["Next.js", "Serverless", "SQL"],
    link: "#",
  },
  {
    id: "02",
    date: "May 12, 2026",
    readTime: "4 min read",
    title: "Building Secure API Integrations",
    description: "A developer guide to token rotation, request signing validation, and strict rate-limiting rules protecting enterprise system boundaries.",
    tags: ["Security", "APIs", "Node.js"],
    link: "#",
  },
  {
    id: "03",
    date: "April 05, 2026",
    readTime: "6 min read",
    title: "The Economics of Clean Code",
    description: "Analyzing why investing in solid architectural design patterns and robust testing suites saves startup runways and accelerates development velocity.",
    tags: ["Architecture", "Testing", "SaaS"],
    link: "#",
  },
];

export function RecentBlogsSection() {
  return (
    <Section id="blog" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        {/* Section Heading */}
        <SectionHeading
          label="Writing"
          title="Recent articles & engineering insights."
        />

        {/* 3-Column Blog Grid utilizing the common GridCard */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-dashed border-neutral-300 dark:border-neutral-700">
          {RECENT_BLOGS.map((post) => (
            <GridCard
              key={post.id}
              number={post.id}
              tag={`${post.date} • ${post.readTime}`}
              title={post.title}
              titleClassName="text-base font-bold tracking-tight text-foreground"
              description={post.description}
              tags={post.tags}
              link={{
                href: post.link,
                label: "Read Article",
              }}
            />
          ))}
        </div>

        {/* View All CTA Link at the bottom */}
        <div className="flex justify-center pt-4">
          <Link
            href="#blog-archive"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-foreground dark:text-neutral-500 dark:hover:text-foreground transition-colors duration-200 group"
          >
            All Articles
            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
