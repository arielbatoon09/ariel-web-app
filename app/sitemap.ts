import type { MetadataRoute } from "next";
import { getArticlesQuery } from "@/data/articles";
import { getWorksQuery } from "@/data/works";
import { getServicesQuery } from "@/data/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://arielbatoon.com";

  // Static routes
  const staticPaths = [
    "",
    "/about",
    "/articles",
    "/book",
    "/contact",
    "/cookies",
    "/privacy",
    "/services",
    "/terms",
    "/works",
  ];

  const staticUrls: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1.0 : 0.8,
  }));

  // Dynamic routes
  const [articles, works, servicesList] = await Promise.all([
    getArticlesQuery().catch(() => []),
    getWorksQuery().catch(() => []),
    getServicesQuery().catch(() => []),
  ]);

  // Filter articles and works by status === "published"
  const articleUrls: MetadataRoute.Sitemap = articles
    .filter((article) => article.status === "published")
    .map((article) => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const workUrls: MetadataRoute.Sitemap = works
    .filter((project) => project.status === "published")
    .map((project) => ({
      url: `${baseUrl}/work/${project.slug}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const serviceUrls: MetadataRoute.Sitemap = servicesList
    .filter((service) => !service.disabled)
    .map((service) => ({
      url: `${baseUrl}/service/${service.slug}`,
      lastModified: service.updatedAt ? new Date(service.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticUrls, ...articleUrls, ...workUrls, ...serviceUrls];
}
