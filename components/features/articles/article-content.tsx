import { Section } from "@/components/common/section";
import { ShareButtons } from "@/components/features/articles/share-buttons";
import type { Article } from "@/constants/articles";

interface ArticleContentProps {
  article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <Section id="article-body" showTopLine={false} showBottomLine={true}>
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Main Article Content */}
        <div className="space-y-10">
          {article.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-foreground font-sans tracking-tight">
                {section.title}
              </h2>
              <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-455 leading-relaxed font-sans whitespace-pre-line">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Social Share Buttons */}
        <ShareButtons title={article.title} />
      </div>
    </Section>
  );
}
