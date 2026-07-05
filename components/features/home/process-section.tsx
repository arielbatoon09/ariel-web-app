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
    description: "Submit your project details, budget parameters, and objectives. I will review them within 24 hours to return with clear, technical questions rather than generic assumptions.",
    icon: <FileText className="size-4.5" />,
  },
  {
    id: "02",
    tag: "Alignment",
    title: "Technical Alignment",
    description: "Book a slot directly on my calendar. We'll hold a single, focused alignment call to lock down the system requirements, project milestones, and success criteria with zero back-and-forth.",
    icon: <Calendar className="size-4.5" />,
  },
  {
    id: "03",
    tag: "Engineering",
    title: "Collaborative Build",
    description: "Access weekly progress updates and incremental live builds. Stay fully connected to the development cycles with transparent communication and zero information gaps.",
    icon: <Code2 className="size-4.5" />,
  },
  {
    id: "04",
    tag: "Deployment",
    title: "Launch & Support",
    description: "Deploy your product with confidence and track post-launch KPIs. Includes 15 days of complimentary post-deployment support covering tweaks, fixes, or minor feature refinements.",
    icon: <Rocket className="size-4.5" />,
  },
];

export function ProcessSection() {
  return (
    <Section id="process" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        {/* Reusable Section Heading */}
        <SectionHeading
          label="Process"
          title="A transparent, execution-focused workflow."
        />

        {/* 2-Column Custom Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-dashed border-neutral-300 dark:border-neutral-700">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.id}
              className="group relative p-8 border-r border-b border-dashed border-neutral-300 dark:border-neutral-700 space-y-6 bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-900/90 transition-colors duration-300 overflow-hidden"
            >
              {/* Interactive Corner Plus (+) Markers */}
              <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 select-none pointer-events-none text-[10px] font-light text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-hover:scale-150 transition-all duration-300 z-20">
                +
              </div>
              <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 select-none pointer-events-none text-[10px] font-light text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-hover:scale-150 transition-all duration-300 z-20">
                +
              </div>

              {/* Animated Progress Line at the top border of the cell on hover */}
              <div className="absolute top-0 left-0 h-[2px] bg-emerald-500/80 dark:bg-emerald-400/80 w-0 group-hover:w-full transition-all duration-500 ease-out z-10" />

              {/* Giant background step number watermark */}
              <div className="absolute top-4 right-6 text-7xl md:text-8xl font-black font-mono tracking-tighter text-neutral-100 dark:text-neutral-900/30 select-none pointer-events-none z-0 group-hover:text-neutral-200 dark:group-hover:text-neutral-800/40 transition-colors duration-300">
                {step.id}
              </div>

              {/* Foreground Card Content */}
              <div className="space-y-6 relative z-10">
                {/* Icon Wrapper with subtle rotation hover */}
                <div className="size-9 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400 group-hover:border-neutral-400 dark:group-hover:border-neutral-600 group-hover:text-foreground group-hover:rotate-6 transition-all duration-300 bg-background">
                  {step.icon}
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                    Step {step.id} / {step.tag}
                  </span>
                  <h3 className="text-lg font-bold text-foreground font-sans tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Centered Action CTA Button (Square border) */}
        <div className="flex justify-center pt-4">
          <Link href="/contact" className="group">
            <Button variant="outline" size="lg" className="rounded-none px-8 h-11 text-sm font-medium flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
              Start Your Project
              <ArrowUpRight className="ml-2 size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
