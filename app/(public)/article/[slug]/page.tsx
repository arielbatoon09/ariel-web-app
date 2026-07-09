import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlugQuery, getArticlesQuery } from "@/data/articles";
import { getCategoriesQuery } from "@/data/categories";
import { ArticleHero } from "@/components/features/public/articles/article-hero";
import { ArticleContent } from "@/components/features/public/articles/article-content";
import type { Article } from "@/schemas/dashboard";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = await getArticlesQuery();
  return articles
    .filter((a) => a.status === "published")
    .map((article) => ({
      slug: article.slug,
    }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticleBySlugQuery(resolvedParams.slug);
  if (!article || article.status !== "published") return {};

  const metadata: Metadata = {
    title: article.seo?.title || `${article.title} | Ariel Batoon`,
    description: article.seo?.description || article.description,
  };

  if (article.seo?.keywords) {
    metadata.keywords = article.seo.keywords.split(",").map((k) => k.trim());
  }

  if (article.seo?.canonicalUrl) {
    metadata.alternates = { canonical: article.seo.canonicalUrl };
  }

  const ogTitle = article.seo?.ogTitle || article.seo?.title || `${article.title} | Ariel Batoon`;
  const ogDesc = article.seo?.ogDescription || article.seo?.description || article.description;
  const ogImg = article.seo?.ogImage || article.imageSrc;

  metadata.openGraph = {
    title: ogTitle,
    description: ogDesc,
    type: "article",
    images: ogImg ? [{ url: ogImg }] : [],
  };

  if (article.seo?.canonicalUrl) {
    metadata.openGraph.url = article.seo.canonicalUrl;
  }

  return metadata;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawArticle = await getArticleBySlugQuery(resolvedParams.slug);

  if (!rawArticle || rawArticle.status !== "published") {
    notFound();
  }

  const article: Article = {
    ...rawArticle,
    id: rawArticle.id.toString(),
    categories: rawArticle.categories as string[],
    seo: rawArticle.seo || undefined,
  };

  const allCategories = await getCategoriesQuery();
  const categoryNames = (article.categories as string[])
    .map((slug) => allCategories.find((c) => c.slug === slug))
    .filter((match) => !!match && !match.disabled)
    .map((match) => match!.name.toUpperCase())
    .join(" • ");

  return (
    <>
      <ArticleHero article={article} categoryNames={categoryNames} />
      <ArticleContent article={article} />
    </>
  );
}
