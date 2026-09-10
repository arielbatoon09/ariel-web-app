import { AboutProfileIntroSection } from "@/components/features/public/about/about-profile-intro-section";
import { AboutExperienceTimelineSection } from "@/components/features/public/about/about-experience-timeline-section";
import { AboutTechStackSection } from "@/components/features/public/about/about-tech-stack-section";
import { AboutPhilosophySection } from "@/components/features/public/about/about-philosophy-section";
import { AboutCertificatesSection } from "@/components/features/public/about/about-certificates-section";
import { AboutEducationSection } from "@/components/features/public/about/about-education-section";
import { CtaSection } from "@/components/common/cta-section";
import { JsonLd } from "@/components/common/json-ld";
import { aboutJsonLd } from "@/constants/seo";

export const metadata = {
  title: "About & Experience",
  description:
    "About Ariel Batoon — full-stack software engineer and indie builder in Cebu City. Background, experience, tech stack, and certifications.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Ariel Batoon",
    description:
      "About Ariel Batoon — full-stack software engineer and indie builder in Cebu City. Background, experience, tech stack, and certifications.",
    url: "/about",
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
  return (
    <>
      <JsonLd data={aboutJsonLd()} />
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
