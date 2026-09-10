import type { MetadataRoute } from "next";
import { getArticlesQuery } from "@/data/articles";
import { getWorksQuery } from "@/data/works";
import { getServicesQuery } from "@/data/services";
import { SITE_URL } from "@/constants/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const staticPaths = ["", "/about", "/works", "/articles", "/services", "/book", "/contact", "/cookies", "/privacy", "/terms"];

  const staticUrls: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/articles" || path === "/works" ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : path === "/about" || path === "/works" || path === "/articles" || path === "/services" ? 0.9 : 0.7,
  }));

  const [articles, works, servicesList] = await Promise.all([
    getArticlesQuery().catch(() => []),
    getWorksQuery().catch(() => []),
    getServicesQuery().catch(() => []),
  ]);

  const articleUrls: MetadataRoute.Sitemap = articles
    .filter((article) => article.status === "published")
    .map((article) => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const workUrls: MetadataRoute.Sitemap = works
    .filter((project) => project.status === "published")
    .map((project) => ({
      url: `${baseUrl}/work/${project.slug}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const serviceUrls: MetadataRoute.Sitemap = servicesList
    .filter((service) => !service.disabled)
    .map((service) => ({
      url: `${baseUrl}/service/${service.slug}`,
      lastModified: service.updatedAt ? new Date(service.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticUrls, ...articleUrls, ...workUrls, ...serviceUrls];
}
