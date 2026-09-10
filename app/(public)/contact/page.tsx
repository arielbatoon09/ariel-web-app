import { Section } from "@/components/common/section";
import { ContactFormSection } from "@/components/features/public/contact/contact-form-section";
import { JsonLd } from "@/components/common/json-ld";
import { contactJsonLd, absoluteCanonical, absoluteTitle } from "@/constants/seo";

export const metadata = {
  title: absoluteTitle("Contact Ariel Batoon — Hire a Software Engineer in Cebu"),
  description: "Message Ariel Batoon or book a call to scope your web, mobile, or AI project with a Cebu-based full-stack engineer.",
  alternates: {
    canonical: absoluteCanonical("/contact"),
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactJsonLd()} />
      <div className="min-h-screen bg-background">
        {/* Contact Hero Header */}
        <Section containerClassName="pt-6 md:pt-10 pb-6 md:pb-10" showBottomLine={true} showTopLine={false}>
          <div className="max-w-4xl animate-in space-y-6 duration-1000 ease-out fade-in slide-in-from-top-4">
            <span className="text-neutral-450 block font-mono text-[10px] tracking-[0.2em] uppercase dark:text-neutral-500">GET IN TOUCH</span>
            <h1 className="max-w-3xl font-sans text-4xl leading-[1.1] font-bold tracking-tight text-foreground md:text-5xl lg:text-[56px]">
              Send a message.
            </h1>
            <p className="dark:text-neutral-455 max-w-2xl font-sans text-base leading-relaxed text-neutral-500 md:text-lg">
              Have a question, inquiry, or project proposal? Fill out the form below with your details, and I will get back to you via email within 24
              hours.
            </p>
          </div>
        </Section>

        {/* Main Content: Focused Direct Message Form */}
        <ContactFormSection />
      </div>
    </>
  );
}
