import { HeroSection } from "@/components/features/home/hero-section";
import { FeaturedWorksSection } from "@/components/features/home/featured-works-section";
import { ProcessSection } from "@/components/features/home/process-section";
import { TestimonialSection } from "@/components/features/home/testimonial-section";
import { RecentBlogsSection } from "@/components/features/home/recent-blogs-section";
import { FaqSection } from "@/components/features/home/faq-section";
import { BookCallSection } from "@/components/features/home/book-call-section";

export default function HomePage() {
  return (
    <>
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