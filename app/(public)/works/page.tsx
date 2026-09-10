import { WorksArchive } from "@/components/features/public/works/works-archive";
import { JsonLd } from "@/components/common/json-ld";
import { worksJsonLd } from "@/constants/seo";
import { getWorksQuery } from "@/data/works";
import { getCategoriesQuery } from "@/data/categories";
import type { Project } from "@/schemas/dashboard";

export const revalidate = 60;

export const metadata = {
  title: "Works & Projects",
  description:
    "Works and projects by Ariel Batoon — SaaS products, performance-driven web apps, and mobile applications shipped for clients worldwide.",
  alternates: {
    canonical: "/works",
  },
};

export default async function WorksPage() {
  const projects = await getWorksQuery();
  const publishedProjects: Project[] = projects
    .filter((p) => p.status === "published")
    .map((p) => ({
      ...p,
      id: p.id.toString(),
      categories: p.categories as ("web" | "mobile" | "ai-data" | "open-source")[],
      seo: p.seo ?? undefined,
    }));

  const categoriesData = await getCategoriesQuery();
  const usedCategorySlugs = new Set<string>(publishedProjects.flatMap((p) => p.categories || []));

  const activeWorksCategories = categoriesData
    .filter((c) => (c.target === "works" || c.target === "both") && !c.disabled && usedCategorySlugs.has(c.slug))
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));

  return (
    <>
      <JsonLd data={worksJsonLd()} />
      <div className="min-h-screen bg-background">
        <WorksArchive initialProjects={publishedProjects} categories={activeWorksCategories} />
      </div>
    </>
  );
}
