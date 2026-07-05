"use client";

import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";

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
            <div
              key={index}
              className="group relative overflow-hidden border-r border-b border-dashed border-neutral-300 bg-neutral-50 p-6 transition-colors duration-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/60 dark:hover:bg-neutral-900/90"
            >
              {/* Interactive Corner Plus (+) Markers */}
              <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] font-light text-neutral-300 transition-all duration-300 select-none group-hover:scale-150 group-hover:text-neutral-600 dark:text-neutral-700 dark:group-hover:text-neutral-400">
                +
              </div>
              <div className="pointer-events-none absolute right-0 bottom-0 z-20 translate-x-1/2 translate-y-1/2 text-[10px] font-light text-neutral-300 transition-all duration-300 select-none group-hover:scale-150 group-hover:text-neutral-600 dark:text-neutral-700 dark:group-hover:text-neutral-400">
                +
              </div>

              <div className="space-y-3">
                <h3 className="font-sans text-sm font-bold tracking-tight text-foreground md:text-base">{faq.question}</h3>
                <p className="font-sans text-xs leading-relaxed text-neutral-500 md:text-sm dark:text-neutral-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
