import { AboutProfileIntroSection } from "@/components/features/public/about/about-profile-intro-section";
import { AboutExperienceTimelineSection } from "@/components/features/public/about/about-experience-timeline-section";
import { AboutTechStackSection } from "@/components/features/public/about/about-tech-stack-section";
import { AboutPhilosophySection } from "@/components/features/public/about/about-philosophy-section";
import { AboutCertificatesSection } from "@/components/features/public/about/about-certificates-section";
import { AboutEducationSection } from "@/components/features/public/about/about-education-section";
import { CtaSection } from "@/components/common/cta-section";

export const metadata = {
  title: "About Me & Professional Bio",
  description:
    "Learn more about Ariel Batoon, a Cebu-based Software Engineer specializing in Full-stack architecture.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Me & Professional Bio",
    description:
      "Learn more about Ariel Batoon, a Cebu-based Software Engineer specializing in Full-stack architecture.",
    url: "https://arielbatoon.com/about",
    images: [
      {
        url: "/ariel-batoon-profile-night.png",
        width: 1200,
        height: 630,
        alt: "Ariel Batoon",
      },
    ],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: {
      "@type": "Person",
      name: "Ariel Batoon",
      jobTitle: "Full-Stack Software Engineer",
      url: "https://arielbatoon.com/about",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cebu City",
        addressRegion: "Cebu",
        addressCountry: "PH",
      },
      knowsAbout: [
        "Software Engineering",
        "Full-Stack Web Development",
        "React Native Mobile App Development",
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "Database Scoping",
      ],
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Bachelor of Science in Information Technology (Software Engineering)",
      },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AboutProfileIntroSection />
      <AboutExperienceTimelineSection />
      <AboutTechStackSection />
      <AboutPhilosophySection />
      <AboutCertificatesSection />
      <AboutEducationSection />
      <CtaSection />
    </>
  );
}
