import { User, Calendar, Clock } from "lucide-react";
import { Section } from "@/components/common/section";
import { BackButton } from "@/components/common/back-button";
import { BannerShowcase } from "@/components/common/banner-showcase";
import { ParameterRow } from "@/components/common/parameter-row";
import type { Article } from "@/constants/articles";

interface ArticleHeroProps {
  article: Article;
}

export function ArticleHero({ article }: ArticleHeroProps) {
  return (
    <Section id="article-hero" containerClassName="pt-6 md:pt-10 pb-12 md:pb-20" showTopLine={false} showBottomLine={true}>
      <div className="max-w-3xl mx-auto space-y-6">
        <BackButton href="/articles" label="Back to Articles" />
        
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-neutral-450 dark:text-neutral-500">
            <span>{article.tag}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
            <span>•</span>
            <span>By {article.author}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground font-sans leading-tight">
            {article.title}
          </h1>
        </div>

        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
          {article.description}
        </p>

        {/* Article Banner Image */}
        {article.imageSrc && (
          <div className="mt-6">
            <BannerShowcase src={article.imageSrc} alt={`${article.title} Banner`} className="aspect-[16/5]" />
          </div>
        )}
      </div>
    </Section>
  );
}
