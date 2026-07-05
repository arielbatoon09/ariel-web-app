import { HeroSection } from "@/components/features/home/hero-section";
import { FeaturedWorksSection } from "@/components/features/home/featured-works-section";
import { ProcessSection } from "@/components/features/home/process-section";
import { TestimonialSection } from "@/components/features/home/testimonial-section";
import { RecentBlogsSection } from "@/components/features/home/recent-blogs-section";
import { FaqSection } from "@/components/features/home/faq-section";
import { BookCallSection } from "@/components/features/home/book-call-section";

export const metadata = {
  title: "Freelance Software Engineer & Web Developer in Cebu City",
  description: "Ariel Batoon is a Full-Stack Software Engineer based in Cebu City, Philippines. Specialized in building premium SaaS, high-performance web systems, and custom React Native mobile applications.",
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Ariel Batoon | Freelance Software Engineer Cebu",
    "image": "https://arielbatoon.com/icons/ab-logo-text-dark.png",
    "url": "https://arielbatoon.com",
    "telephone": "+639688540898",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Lahug",
      "addressLocality": "Cebu City",
      "addressRegion": "Cebu",
      "postalCode": "6000",
      "addressCountry": "PH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.3312,
      "longitude": 123.8986
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://www.linkedin.com/in/arielbatoon",
      "https://github.com/arielbatoon09"
    ],
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Cebu City"
      },
      {
        "@type": "Country",
        "name": "Philippines"
      },
      {
        "@type": "Country",
        "name": "United States"
      },
      {
        "@type": "Country",
        "name": "Singapore"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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