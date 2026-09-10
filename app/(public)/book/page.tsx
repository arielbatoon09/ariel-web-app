import { Section } from "@/components/common/section";
import { BookCallSection } from "@/components/features/public/book/book-call-section";
import { JsonLd } from "@/components/common/json-ld";
import { bookJsonLd, absoluteCanonical, absoluteTitle } from "@/constants/seo";

export const metadata = {
  title: absoluteTitle("Book a Discovery Call with Ariel Batoon — Free Consult"),
  description: "Book a free discovery call with Ariel Batoon to discuss project scope, technical needs, and next steps for your build.",
  alternates: {
    canonical: absoluteCanonical("/book"),
  },
};

export default function BookCallPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={bookJsonLd()} />
      {/* Book Call Hero Header */}
      <Section containerClassName="pt-6 md:pt-10 pb-6 md:pb-10" showBottomLine={true} showTopLine={false}>
        <div className="max-w-4xl animate-in space-y-6 duration-1000 ease-out fade-in slide-in-from-top-4">
          <span className="text-neutral-450 block font-mono text-[10px] tracking-[0.2em] uppercase dark:text-neutral-500">SCHEDULING</span>
          <h1 className="max-w-3xl font-sans text-4xl leading-[1.1] font-bold tracking-tight text-foreground md:text-5xl lg:text-[56px]">
            Book a Free Discovery Call
          </h1>
          <p className="dark:text-neutral-450 max-w-2xl font-sans text-base leading-relaxed text-neutral-500 md:text-lg">
            Select a convenient time on the calendar below to discuss your project, technical needs, or potential collaboration. Let&apos;s build
            something great together.
          </p>
        </div>
      </Section>

      <BookCallSection />
    </div>
  );
}
