import { HeroSection } from "@/components/features/home/hero-section";
import { FeaturedWorksSection } from "@/components/features/home/featured-works-section";
import { ProcessSection } from "@/components/features/home/process-section";
import { AboutSection } from "@/components/features/home/about-section";
import { RecentBlogsSection } from "@/components/features/home/recent-blogs-section";
import { FaqSection } from "@/components/features/home/faq-section";
import { BookCallSection } from "@/components/features/home/book-call-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedWorksSection />
      <ProcessSection />
      <AboutSection />
      <RecentBlogsSection />
      <BookCallSection />
      <FaqSection />
    </>
  );
}