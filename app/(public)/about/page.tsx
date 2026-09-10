import { AboutProfileIntroSection } from "@/components/features/public/about/about-profile-intro-section";
import { AboutExperienceTimelineSection } from "@/components/features/public/about/about-experience-timeline-section";
import { AboutTechStackSection } from "@/components/features/public/about/about-tech-stack-section";
import { AboutPhilosophySection } from "@/components/features/public/about/about-philosophy-section";
import { AboutCertificatesSection } from "@/components/features/public/about/about-certificates-section";
import { AboutEducationSection } from "@/components/features/public/about/about-education-section";
import { CtaSection } from "@/components/common/cta-section";
import { JsonLd } from "@/components/common/json-ld";
import { aboutJsonLd, absoluteCanonical, absoluteTitle } from "@/constants/seo";

const ABOUT_TITLE = "About Ariel Batoon — Full-Stack Engineer in Cebu";
const ABOUT_DESCRIPTION =
  "Meet Ariel Batoon, a Cebu full-stack engineer. Explore experience, tech stack, education, and professional certifications.";

export const metadata = {
  title: absoluteTitle(ABOUT_TITLE),
  description: ABOUT_DESCRIPTION,
  alternates: {
    canonical: absoluteCanonical("/about"),
  },
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    url: absoluteCanonical("/about"),
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
