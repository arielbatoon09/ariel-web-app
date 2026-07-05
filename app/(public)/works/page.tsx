import { WorksArchive } from "@/components/features/works/works-archive";

export const metadata = {
  title: "Portfolio | Creative Works & Projects Cebu",
  description: "Browse software projects engineered by Ariel Batoon in Cebu. Custom SaaS dashboards, performance-driven web apps, and native mobile apps.",
};

export default function WorksPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Ariel Batoon Software Portfolio",
    "author": {
      "@type": "Person",
      "name": "Ariel Batoon",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cebu City",
        "addressRegion": "Cebu",
        "addressCountry": "PH"
      }
    },
    "description": "A collection of SaaS products, high-performance web systems, and mobile applications developed for clients globally."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <WorksArchive />
      </div>
    </>
  );
}
