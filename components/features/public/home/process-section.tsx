import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Code2, Rocket, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { GridCard } from "@/components/common/grid-card";

interface Step {
  id: string;
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PROCESS_STEPS: Step[] = [
  {
    id: "01",
    tag: "Get Started",
    title: "Choose Your Path",
    description:
      "Book a free consultation for custom projects, send an inquiry through the contact form, or purchase a fixed-scope service directly. Choose the option that best fits your needs.",
    icon: <FileText className="size-4.5" />,
  },
  {
    id: "02",
    tag: "Discovery",
    title: "Plan & Align",
    description:
      "For custom projects, we'll discuss your goals, requirements, timeline, and budget during a focused consultation. For fixed-scope services, I'll confirm the project details and next steps before development begins.",
    icon: <Calendar className="size-4.5" />,
  },
  {
    id: "03",
    tag: "Engineering",
    title: "Build & Collaborate",
    description:
      "Track your project through a dedicated Customer Panel where you can monitor milestones, review progress, exchange files, and chat with me directly throughout the entire development process.",
    icon: <Code2 className="size-4.5" />,
  },
  {
    id: "04",
    tag: "Delivery",
    title: "Launch & Support",
    description:
      "Receive a production-ready solution with deployment assistance and 15 days of complimentary post-launch support covering bug fixes, minor refinements, and a smooth handoff.",
    icon: <Rocket className="size-4.5" />,
  },
];

export function ProcessSection() {
  return (
    <Section id="process" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        {/* Reusable Section Heading */}
        <SectionHeading label="Process" title="A transparent, execution-focused workflow." />

        {/* 2-Column Custom Timeline Grid */}
        <div className="grid grid-cols-1 border-t border-l border-dashed border-neutral-300 md:grid-cols-2 dark:border-neutral-700">
          {PROCESS_STEPS.map((step) => (
            <GridCard
              key={step.id}
              watermark={step.id}
              showHoverLine={true}
              icon={step.icon}
              iconClassName="size-9 rounded-lg group-hover:rotate-6"
              tag={`Step ${step.id} / ${step.tag}`}
              title={step.title}
              description={step.description}
              className="p-5 md:p-8"
            />
          ))}
        </div>

        {/* Centered Action CTA Button (Square border) */}
        <div className="flex justify-center pt-4">
          <Link href="/contact" className="group">
            <Button
              variant="outline"
              size="lg"
              className="flex h-11 cursor-pointer items-center justify-center rounded-none px-8 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
            >
              Start Your Project
              <ArrowUpRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
