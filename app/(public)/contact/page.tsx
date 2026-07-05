import { Section } from "@/components/common/section";
import { ContactFormSection } from "@/components/features/contact/contact-form-section";

export const metadata = {
  title: "Contact | Ariel Batoon",
  description: "Send a message or schedule a live project scoping call with Ariel Batoon.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Contact Hero Header */}
      <Section containerClassName="pt-6 md:pt-10 pb-6 md:pb-10" showBottomLine={true} showTopLine={false}>
        <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000 ease-out">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-450 dark:text-neutral-500 block">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight text-foreground font-sans leading-[1.1] max-w-3xl">
            Send a message.
          </h1>
          <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-455 font-sans leading-relaxed max-w-2xl">
            Have a question, inquiry, or project proposal? Fill out the form below with your details, and I will get back to you via email within 24 hours.
          </p>
        </div>
      </Section>

      {/* Main Content: Focused Direct Message Form */}
      <ContactFormSection />
    </div>
  );
}
