import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Code2, Rocket, ArrowUpRight } from "lucide-react";
import Link from "next/link";

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
    tag: "Intake",
    title: "Scope Definition",
    description:
      "Submit your project details, budget parameters, and objectives. I will review them within 24 hours to return with clear, technical questions rather than generic assumptions.",
    icon: <FileText className="size-4.5" />,
  },
  {
    id: "02",
    tag: "Alignment",
    title: "Technical Alignment",
    description:
      "Book a slot directly on my calendar. We'll hold a single, focused alignment call to lock down the system requirements, project milestones, and success criteria with zero back-and-forth.",
    icon: <Calendar className="size-4.5" />,
  },
  {
    id: "03",
    tag: "Engineering",
    title: "Collaborative Build",
    description:
      "Access weekly progress updates and incremental live builds. Stay fully connected to the development cycles with transparent communication and zero information gaps.",
    icon: <Code2 className="size-4.5" />,
  },
  {
    id: "04",
    tag: "Deployment",
    title: "Launch & Support",
    description:
      "Deploy your product with confidence and track post-launch KPIs. Includes 15 days of complimentary post-deployment support covering tweaks, fixes, or minor feature refinements.",
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
            <div
              key={step.id}
              className="group relative space-y-6 overflow-hidden border-r border-b border-dashed border-neutral-300 bg-neutral-50 p-8 transition-colors duration-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/60 dark:hover:bg-neutral-900/90"
            >
              {/* Interactive Corner Plus (+) Markers */}
              <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] font-light text-neutral-300 transition-all duration-300 select-none group-hover:scale-150 group-hover:text-neutral-600 dark:text-neutral-700 dark:group-hover:text-neutral-400">
                +
              </div>
              <div className="pointer-events-none absolute right-0 bottom-0 z-20 translate-x-1/2 translate-y-1/2 text-[10px] font-light text-neutral-300 transition-all duration-300 select-none group-hover:scale-150 group-hover:text-neutral-600 dark:text-neutral-700 dark:group-hover:text-neutral-400">
                +
              </div>

              {/* Animated Progress Line at the top border of the cell on hover */}
              <div className="absolute top-0 left-0 z-10 h-[2px] w-0 bg-emerald-500/80 transition-all duration-500 ease-out group-hover:w-full dark:bg-emerald-400/80" />

              {/* Giant background step number watermark */}
              <div className="pointer-events-none absolute top-4 right-6 z-0 font-mono text-7xl font-black tracking-tighter text-neutral-100 transition-colors duration-300 select-none group-hover:text-neutral-200 md:text-8xl dark:text-neutral-900/30 dark:group-hover:text-neutral-800/40">
                {step.id}
              </div>

              {/* Foreground Card Content */}
              <div className="relative z-10 space-y-6">
                {/* Icon Wrapper with subtle rotation hover */}
                <div className="flex size-9 items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-background text-neutral-500 transition-all duration-300 group-hover:rotate-6 group-hover:border-neutral-400 group-hover:text-foreground dark:border-neutral-700 dark:text-neutral-400 dark:group-hover:border-neutral-600">
                  {step.icon}
                </div>

                <div className="space-y-2">
                  <span className="block font-mono text-[10px] tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                    Step {step.id} / {step.tag}
                  </span>
                  <h3 className="font-sans text-lg font-bold tracking-tight text-foreground">{step.title}</h3>
                  <p className="max-w-md text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{step.description}</p>
                </div>
              </div>
            </div>
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
