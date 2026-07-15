import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/customer/", "/login"],
    },
    sitemap: "https://arielbatoon.com/sitemap.xml",
  };
}
