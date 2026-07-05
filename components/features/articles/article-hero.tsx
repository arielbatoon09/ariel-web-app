import { Section } from "@/components/common/section";
import { BackButton } from "@/components/common/back-button";
import { BannerShowcase } from "@/components/common/banner-showcase";
import type { Article } from "@/constants/articles";

interface ArticleHeroProps {
  article: Article;
}

export function ArticleHero({ article }: ArticleHeroProps) {
  return (
    <Section id="article-hero" containerClassName="pt-6 md:pt-10 pb-12 md:pb-20" showTopLine={false} showBottomLine={true}>
      <div className="mx-auto max-w-3xl space-y-6">
        <BackButton href="/articles" label="Back to Articles" />

        <div className="space-y-3">
          <div className="text-neutral-450 flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-wider uppercase dark:text-neutral-500">
            <span>{article.tag}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
            <span>•</span>
            <span>By {article.author}</span>
          </div>
          <h1 className="font-sans text-3xl leading-tight font-bold tracking-tight text-foreground md:text-5xl">{article.title}</h1>
        </div>

        <p className="font-sans text-base leading-relaxed text-neutral-600 md:text-lg dark:text-neutral-400">{article.description}</p>

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
