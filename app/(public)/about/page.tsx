import { AboutProfileIntroSection } from "@/components/features/about/about-profile-intro-section";
import { AboutExperienceTimelineSection } from "@/components/features/about/about-experience-timeline-section";
import { AboutTechStackSection } from "@/components/features/about/about-tech-stack-section";
import { AboutPhilosophySection } from "@/components/features/about/about-philosophy-section";
import { AboutCertificatesSection } from "@/components/features/about/about-certificates-section";
import { AboutEducationSection } from "@/components/features/about/about-education-section";
import { CtaSection } from "@/components/common/cta-section";

export const metadata = {
  title: "About Me | Ariel Batoon",
  description: "Learn more about Ariel Batoon, a Full-Stack Engineer specializing in high-performance web systems, custom mobile applications, and reliable technical scoping.",
};

export default function AboutPage() {
  return (
    <>
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
