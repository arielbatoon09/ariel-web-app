import { Section } from "@/components/common/section";
import { ShareButtons } from "@/components/features/public/articles/share-buttons";
import type { Article } from "@/schemas/dashboard";

interface ArticleContentProps {
  article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <Section id="article-body" showTopLine={false} showBottomLine={true}>
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Main Article Content */}
        <div className="space-y-10">
          {article.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">{section.title}</h2>
              <div 
                className="dark:text-neutral-455 font-sans text-sm leading-relaxed text-neutral-600 md:text-base prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: section.body }}
              />
            </div>
          ))}
        </div>

        {/* Social Share Buttons */}
        <ShareButtons title={article.title} />
      </div>
    </Section>
  );
}
