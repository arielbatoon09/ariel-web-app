import { HeroSection } from "@/components/features/public/home/hero-section";
import { FeaturedWorksSection } from "@/components/features/public/home/featured-works-section";
import { ProcessSection } from "@/components/features/public/home/process-section";
// import { TestimonialSection } from "@/components/features/public/home/testimonial-section";
import { RecentBlogsSection } from "@/components/features/public/home/recent-blogs-section";
import { FaqSection } from "@/components/features/public/home/faq-section";
import { BookCallSection } from "@/components/features/public/home/book-call-section";
import { JsonLd } from "@/components/common/json-ld";
import { absoluteCanonical, DEFAULT_META_DESCRIPTION, homeJsonLd, SITE_TAGLINE } from "@/constants/seo";

const HOME_TITLE = `Ariel Batoon — ${SITE_TAGLINE}`;

export const metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: DEFAULT_META_DESCRIPTION,
  alternates: {
    canonical: absoluteCanonical("/"),
  },
  openGraph: {
    title: HOME_TITLE,
    description: DEFAULT_META_DESCRIPTION,
    url: absoluteCanonical("/"),
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
