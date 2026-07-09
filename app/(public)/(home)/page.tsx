import { HeroSection } from "@/components/features/public/home/hero-section";
import { FeaturedWorksSection } from "@/components/features/public/home/featured-works-section";
import { ProcessSection } from "@/components/features/public/home/process-section";
import { TestimonialSection } from "@/components/features/public/home/testimonial-section";
import { RecentBlogsSection } from "@/components/features/public/home/recent-blogs-section";
import { FaqSection } from "@/components/features/public/home/faq-section";
import { BookCallSection } from "@/components/features/public/home/book-call-section";

export const metadata = {
  title: "Software Engineer & Indie Builder in Cebu City",
  description:
    "Full-Stack Software Engineer and Indie Builder based in Cebu, Philippines. Building scalable AI-powered MVPs, web, and mobile apps worldwide.",
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Ariel Batoon — Software Engineer",
    image: "https://arielbatoon.com/icons/ab-logo-text-dark.png",
    url: "https://arielbatoon.com",
    telephone: "+639674214639",
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lahug",
      addressLocality: "Cebu City",
      addressRegion: "Cebu",
      postalCode: "6000",
      addressCountry: "PH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 10.3312,
      longitude: 123.8986,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: ["https://www.linkedin.com/in/arielbatoon", "https://github.com/arielbatoon09"],
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Cebu City",
      },
      {
        "@type": "Country",
        name: "Philippines",
      },
      {
        "@type": "Country",
        name: "United States",
      },
      {
        "@type": "Country",
        name: "Singapore",
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection />
      <FeaturedWorksSection />
      <ProcessSection />
      <RecentBlogsSection />
      <TestimonialSection />
      <BookCallSection />
      <FaqSection />
    </>
  );
}
