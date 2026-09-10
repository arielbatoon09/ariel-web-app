import { HeroSection } from "@/components/features/public/home/hero-section";
import { FeaturedWorksSection } from "@/components/features/public/home/featured-works-section";
import { ProcessSection } from "@/components/features/public/home/process-section";
// import { TestimonialSection } from "@/components/features/public/home/testimonial-section";
import { RecentBlogsSection } from "@/components/features/public/home/recent-blogs-section";
import { FaqSection } from "@/components/features/public/home/faq-section";
import { BookCallSection } from "@/components/features/public/home/book-call-section";
import { JsonLd } from "@/components/common/json-ld";
import { homeJsonLd } from "@/constants/seo";

export const metadata = {
  title: {
    absolute: "Ariel Batoon — Full-Stack Software Engineer & Indie Builder",
  },
  description:
    "I'm Ariel Batoon — a full-stack software engineer and indie builder in Cebu City, Philippines. I build scalable AI-powered MVPs, web, and mobile apps worldwide.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ariel Batoon — Full-Stack Software Engineer & Indie Builder",
    description:
      "I'm Ariel Batoon — a full-stack software engineer and indie builder in Cebu City, Philippines. I build scalable AI-powered MVPs, web, and mobile apps worldwide.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <HeroSection />
      <FeaturedWorksSection />
      <ProcessSection />
      <RecentBlogsSection />
      {/* <TestimonialSection /> */}
      <BookCallSection showIntro sectionId="contact" />
      <FaqSection />
    </>
  );
}
