import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GridCard } from "@/components/common/grid-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ALL_ARTICLES } from "@/constants/articles";

const RECENT_BLOGS = ALL_ARTICLES.slice(0, 3);

export function RecentBlogsSection() {
  return (
    <Section id="blog" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        {/* Section Heading */}
        <SectionHeading label="Writing" title="Recent articles & engineering insights." />

        {/* 3-Column Blog Grid utilizing the common GridCard */}
        <div className="grid grid-cols-1 border-t border-l border-dashed border-neutral-300 md:grid-cols-3 dark:border-neutral-700">
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
            href="/articles"
            className="group inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-neutral-400 uppercase transition-colors duration-200 hover:text-foreground dark:text-neutral-500 dark:hover:text-foreground"
          >
            All Articles
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
