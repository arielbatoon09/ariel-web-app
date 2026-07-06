import { notFound } from "next/navigation";
import { ALL_ARTICLES } from "@/constants/articles";
import { ArticleHero } from "@/components/features/articles/article-hero";
import { ArticleContent } from "@/components/features/articles/article-content";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const article = ALL_ARTICLES.find((a) => a.slug === resolvedParams.slug);
  if (!article) return {};

  return {
    title: `${article.title} | Ariel Batoon`,
    description: article.description,
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const article = ALL_ARTICLES.find((a) => a.slug === resolvedParams.slug);

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
