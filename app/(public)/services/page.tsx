import { ServicesList } from "@/components/features/public/services/services-list";
import { getServicesQuery } from "@/data/services";

export const revalidate = 60;

export const metadata = {
  title: "Services & Pricing | Web Design & Software Dev Cebu",
  description:
    "Explore professional software development pricing in Cebu. Packages for high-performance MVPs, custom SaaS dashboard systems, mobile apps, and technical scoping.",
};

export default async function ServicesPage() {
  // Fetch services directly on the server
  const dbServices = await getServicesQuery();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Software Development Services Cebu",
    provider: {
      "@type": "Person",
      name: "Ariel Batoon",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cebu City",
        addressRegion: "Cebu",
        addressCountry: "PH",
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software Engineering Packages",
      itemListElement: dbServices.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.description,
        },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background">
        <ServicesList initialServices={dbServices} />
      </div>
    </>
  );
}
