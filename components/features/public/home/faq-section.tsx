import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GridCard } from "@/components/common/grid-card";

interface FAQ {
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    question: "What is your primary tech stack?",
    answer:
      "I select technologies based on your specific scaling and performance requirements. My standard stack centers around modern architectures including Next.js, Node.js, React Native, PostgreSQL, and robust cloud database models.",
  },
  {
    question: "How does the 15-day post-launch support work?",
    answer:
      "After your product goes live, I provide 15 days of complimentary support. This covers bug fixes, performance tuning, layout refinements, or minor adjustments you discover once real users begin interacting with the software.",
  },
  {
    question: "How do you handle project pricing and timelines?",
    answer:
      "I structure projects around clear milestones rather than open-ended hourly rates. After our initial alignment call, I deliver a transparent estimate defining scope, budget, and timelines. Any future additions are agreed upon beforehand with zero surprises.",
  },
  {
    question: "Can you collaborate directly with my in-house developers?",
    answer:
      "Yes. I frequently partner with corporate tech teams and startup developers. I integrate directly into your Git workflow, join project sprint reviews, and provide thorough system documentation to ensure a seamless handoff.",
  },
];

export function FaqSection() {
  return (
    <Section id="faq" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        {/* Reusable Section Heading */}
        <SectionHeading label="FAQ" title="Frequently asked questions" />

        {/* Clean, Dashed Box Grid Accordion Layout */}
        <div className="grid w-full grid-cols-1 border-t border-l border-dashed border-neutral-300 md:grid-cols-2 dark:border-neutral-700">
          {FAQS.map((faq, index) => (
            <GridCard
              key={index}
              title={faq.question}
              titleClassName="text-sm font-bold tracking-tight text-foreground md:text-base"
              description={faq.answer}
              descriptionClassName="font-sans text-xs leading-relaxed text-neutral-500 md:text-sm dark:text-neutral-400"
              className="p-5 md:p-6"
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
