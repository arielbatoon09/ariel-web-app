import { ArticlesArchive } from "@/components/features/public/articles/articles-archive";
import { JsonLd } from "@/components/common/json-ld";
import { articlesJsonLd } from "@/constants/seo";
import { getArticlesQuery } from "@/data/articles";
import { getCategoriesQuery } from "@/data/categories";
import type { Article } from "@/schemas/dashboard";

export const revalidate = 60;

export const metadata = {
  title: "Articles & Insights | Web Engineering Blog Cebu",
  description:
    "Read technical articles on React Performance, Next.js optimization, and API architecture written by Ariel Batoon, software engineer in Cebu City.",
  alternates: {
    canonical: "/articles",
  },
};

export default async function ArticlesPage() {
  const rawArticles = await getArticlesQuery();
  const publishedArticles: Article[] = rawArticles
    .filter((a) => a.status === "published")
    .map((a) => ({
      ...a,
      id: a.id.toString(),
      categories: a.categories as string[],
      seo: a.seo ?? undefined,
    }));

  const categoriesData = await getCategoriesQuery();
  const activeArticleCategories = categoriesData
    .filter((c) => (c.target === "articles" || c.target === "both") && !c.disabled)
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));

  return (
    <>
      <JsonLd data={articlesJsonLd()} />
      <div className="min-h-screen bg-background">
        <ArticlesArchive initialArticles={publishedArticles} categories={activeArticleCategories} />
      </div>
    </>
  );
}
