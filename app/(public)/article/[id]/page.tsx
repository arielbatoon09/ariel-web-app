import { notFound } from "next/navigation";
import { ALL_ARTICLES } from "@/constants/articles";
import { ArticleHero } from "@/components/features/articles/article-hero";
import { ArticleContent } from "@/components/features/articles/article-content";

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
    <>
      <ArticleHero article={article} />
      <ArticleContent article={article} />
    </>
  );
}
