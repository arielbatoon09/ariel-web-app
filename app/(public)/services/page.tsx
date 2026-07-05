import { ServicesList } from "@/components/features/services/services-list";

export const metadata = {
  title: "Services & Pricing | Web Design & Software Dev Cebu",
  description: "Explore professional software development pricing in Cebu. Packages for high-performance MVPs, custom SaaS dashboard systems, mobile apps, and technical scoping.",
};

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Software Development Services Cebu",
    "provider": {
      "@type": "Person",
      "name": "Ariel Batoon",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cebu City",
        "addressRegion": "Cebu",
        "addressCountry": "PH"
      }
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Software Engineering Packages",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Startup MVP Package",
            "description": "Rapid development of a performance-optimized web dashboard or mobile app MVP, completed within 20 days."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "SaaS Platform Package",
            "description": "Premium full-scale web platform engineering, custom API setups, and integrations."
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <ServicesList />
      </div>
    </>
  );
}
