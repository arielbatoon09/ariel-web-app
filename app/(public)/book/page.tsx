import { Section } from "@/components/common/section";
import { BookCallSection } from "@/components/features/book/book-call-section";

export const metadata = {
  title: "Book a Call | Ariel Batoon",
  description: "Select a convenient time on the calendar to discuss your project, technical requirements, or potential collaborations with Ariel Batoon.",
};

export default function BookCallPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Book Call Hero Header */}
      <Section containerClassName="pt-6 md:pt-10 pb-6 md:pb-10" showBottomLine={true} showTopLine={false}>
        <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000 ease-out">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-450 dark:text-neutral-500 block">
            SCHEDULING
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight text-foreground font-sans leading-[1.1] max-w-3xl">
            Book a Free 30-Min Discovery Call
          </h1>
          <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-450 font-sans leading-relaxed max-w-2xl">
            Select a convenient time on the calendar below to discuss your project, technical needs, or potential collaboration. Let's build something great together.
          </p>
        </div>
      </Section>

      {/* Calendar Embed Section */}
      <BookCallSection />
    </div>
  );
}