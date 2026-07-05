import { ArticlesArchive } from "@/components/features/articles/articles-archive";

export const metadata = {
  title: "Articles & Insights | Web Engineering Blog Cebu",
  description:
    "Read technical articles on React Performance, Next.js optimization, and API architecture written by Ariel Batoon, software engineer in Cebu City.",
};

export default function ArticlesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Ariel Batoon Engineering Insights",
    description: "Technical insights on Next.js, database designs, and frontend rendering performance.",
    publisher: {
      "@type": "Person",
      name: "Ariel Batoon",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cebu City",
        addressRegion: "Cebu",
        addressCountry: "PH",
      },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background">
        <ArticlesArchive />
      </div>
    </>
  );
}
