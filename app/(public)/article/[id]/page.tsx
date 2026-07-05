import { notFound } from "next/navigation";
import Link from "next/link";
import { ALL_ARTICLES } from "@/constants/articles";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  FileText, 
  Tag, 
  Clock,
  ArrowRight
} from "lucide-react";
import { ConnectDialog } from "@/components/common/connect-dialog";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_ARTICLES.map((article) => ({
    id: article.id,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const article = ALL_ARTICLES.find((a) => a.id === resolvedParams.id);
  if (!article) return {};

  return {
    title: `${article.title} | Ariel Batoon`,
    description: article.description,
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const article = ALL_ARTICLES.find((a) => a.id === resolvedParams.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header Section */}
      <Section id="article-hero" containerClassName="pt-4 md:pt-6 pb-12 md:pb-20" showTopLine={false} showBottomLine={true}>
        <div className="max-w-3xl mx-auto space-y-6">
          <Link href="/articles" className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-neutral-450 dark:text-neutral-500 hover:text-foreground transition-colors duration-350">
            <span className="flex items-center justify-center size-7 border border-dashed border-neutral-300 dark:border-neutral-700 group-hover:border-foreground group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 group-hover:text-background dark:group-hover:text-foreground transition-all duration-300">
              <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </span>
            Back to Articles
          </Link>
          
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              <span>{article.tag}</span>
              <span>•</span>
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground font-sans leading-tight">
              {article.title}
            </h1>
          </div>

          <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
            {article.description}
          </p>
          
          {/* Article Content Render */}
          <div className="pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-700 space-y-8">
            {article.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-lg md:text-xl font-bold text-foreground font-sans">
                  {section.title}
                </h2>
                <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* Connect CTA at the bottom */}
          <div className="pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-700 space-y-4">
            <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-450 font-sans leading-normal">
              Have questions about these concepts or need high-performance systems engineering for your project? Let's connect.
            </p>
            <ConnectDialog>
              <Button className="rounded-none font-mono text-xs uppercase tracking-wider cursor-pointer h-10 px-6">
                Let's Discuss
                <ArrowRight className="ml-1.5 size-3.5" />
              </Button>
            </ConnectDialog>
          </div>
        </div>
      </Section>
    </div>
  );
}
