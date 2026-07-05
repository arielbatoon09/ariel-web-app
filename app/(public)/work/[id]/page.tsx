import { notFound } from "next/navigation";
import Link from "next/link";
import { ALL_PROJECTS } from "@/constants/projects";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ExternalLink, 
  Globe, 
  Calendar, 
  User, 
  Building2, 
  CheckCircle2, 
  Cpu, 
  FileText, 
  Target 
} from "lucide-react";
import Image from "next/image";
import { ConnectDialog } from "@/components/common/connect-dialog";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_PROJECTS.map((project) => ({
    id: project.id,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const project = ALL_PROJECTS.find((p) => p.id === resolvedParams.id);
  if (!project) return {};

  return {
    title: `${project.title} | Case Study`,
    description: project.description,
  };
}

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const project = ALL_PROJECTS.find((p) => p.id === resolvedParams.id);

  if (!project) {
    notFound();
  }

  const { caseStudy } = project;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Showcase Section */}
      <Section id="cs-hero" containerClassName="pt-4 md:pt-6 pb-12 md:pb-20" showTopLine={false} showBottomLine={true}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <Link href="/works" className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-neutral-450 dark:text-neutral-500 hover:text-foreground transition-colors duration-350">
              <span className="flex items-center justify-center size-7 border border-dashed border-neutral-300 dark:border-neutral-700 group-hover:border-foreground group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 group-hover:text-background dark:group-hover:text-foreground transition-all duration-300">
                <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              </span>
              Back to Archive
            </Link>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 block">
              {project.tag}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground font-sans leading-tight">
              {project.title}
            </h1>
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans max-w-2xl">
              {project.description}
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              {caseStudy.liveUrl && (
                <a href={caseStudy.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="rounded-none font-mono text-xs uppercase tracking-wider cursor-pointer">
                    Live Demo
                    <ExternalLink className="ml-1.5 size-3.5" />
                  </Button>
                </a>
              )}
              {caseStudy.githubUrl && (
                <a href={caseStudy.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="rounded-none border-dashed font-mono text-xs uppercase tracking-wider cursor-pointer">
                    GitHub Code
                    <Globe className="ml-1.5 size-3.5" />
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Project Specs Metadata Block */}
          <div className="lg:col-span-5 w-full border border-dashed border-neutral-300 dark:border-neutral-700 p-6 bg-neutral-50/50 dark:bg-neutral-900/10 space-y-4 lg:sticky lg:top-24 self-start">
            <h3 className="text-xs font-mono uppercase tracking-wider text-foreground border-b border-dashed border-neutral-300 dark:border-neutral-700 pb-2.5">
              Project Parameters
            </h3>
            
            <div className="space-y-3.5 font-mono text-xs">
              <div className="flex items-start justify-between gap-4">
                <span className="text-neutral-450 dark:text-neutral-500 flex items-center gap-1.5 flex-shrink-0">
                  <User className="size-3.5" />
                  Role:
                </span>
                <span className="text-foreground text-right">{caseStudy.role}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-neutral-450 dark:text-neutral-500 flex items-center gap-1.5 flex-shrink-0">
                  <Calendar className="size-3.5" />
                  Timeline:
                </span>
                <span className="text-foreground text-right">{caseStudy.timeline}</span>
              </div>
              {caseStudy.client && (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-neutral-450 dark:text-neutral-500 flex items-center gap-1.5 flex-shrink-0">
                    <Building2 className="size-3.5" />
                    Client:
                  </span>
                  <span className="text-foreground text-right">{caseStudy.client}</span>
                </div>
              )}
              <div className="flex items-start justify-between gap-4 pt-2 border-t border-dashed border-neutral-250 dark:border-neutral-800">
                <span className="text-neutral-450 dark:text-neutral-500 flex items-center gap-1.5 flex-shrink-0">
                  <Cpu className="size-3.5" />
                  Stack:
                </span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
                  {project.tags.map((t) => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-background text-neutral-600 dark:text-neutral-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Banner Showcase integrated directly into the first section */}
        <div className="mt-12 relative w-full aspect-[21/9] overflow-hidden border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
          <Image
            src={project.imageSrc}
            alt={`${project.title} Banner`}
            fill
            className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 ease-out"
            sizes="100vw"
            priority
          />
          {/* Soft scanline/grid overlay for premium look */}
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
        </div>
      </Section>

      {/* Main Analysis Section */}
      <Section id="cs-details" containerClassName="py-12 md:py-16" showTopLine={false} showBottomLine={true}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Challenge & Solution */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <Target className="size-5 text-neutral-400" />
                <h2 className="text-xl font-bold tracking-tight font-sans">
                  The Challenge
                </h2>
              </div>
              <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                {caseStudy.challenge}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="size-5 text-neutral-400" />
                <h2 className="text-xl font-bold tracking-tight font-sans">
                  The Engineering Solution
                </h2>
              </div>
              <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                {caseStudy.solution}
              </p>
            </div>

            {/* Core Implementation Features */}
            <div className="space-y-6 pt-10 border-t border-dashed border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-foreground mb-4">
                <Cpu className="size-5 text-neutral-400" />
                <h2 className="text-xl font-bold tracking-tight font-sans">
                  Key Technical Features
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseStudy.features.map((feature, idx) => (
                  <div key={idx} className="p-5 border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/20 dark:bg-neutral-900/5 hover:border-neutral-450 transition-colors duration-300">
                    <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                      <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">0{idx + 1}.</span>
                      {feature.title}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Business Outcomes / Results Side Panel */}
          <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-dashed lg:border-neutral-300 lg:dark:border-neutral-700 lg:pl-8 lg:sticky lg:top-24 self-start">
            <div className="flex items-center gap-2 text-foreground">
              <FileText className="size-4.5 text-neutral-400" />
              <h3 className="text-sm font-mono uppercase tracking-wider">
                Measurable Impact
              </h3>
            </div>

            <div className="space-y-4">
              {caseStudy.results.map((result, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="size-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100 mt-2 flex-shrink-0" />
                  <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {result}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-700">
              <div className="p-4 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold">
                  Need a similar system?
                </h4>
                <p className="text-[11px] leading-relaxed text-neutral-300 dark:text-neutral-600">
                  I specialize in engineering performance-optimized applications configured to solve specific operational bottlenecks.
                </p>
                <div className="pt-2">
                  <ConnectDialog>
                    <Button variant="ghost" size="sm" className="w-full rounded-none border border-white bg-transparent text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white font-mono text-[11px] uppercase tracking-wider cursor-pointer">
                      Let's Build It
                    </Button>
                  </ConnectDialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Project Showcase Gallery */}
      <Section id="cs-gallery" containerClassName="py-12" showTopLine={false} showBottomLine={true}>
        <div className="mb-6 flex items-center gap-2 text-foreground">
          <FileText className="size-4.5 text-neutral-400" />
          <h3 className="text-sm font-mono uppercase tracking-wider">
            Project Gallery
          </h3>
        </div>
        {/* Sub-gallery images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative aspect-[16/10] overflow-hidden border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={project.imageSrc}
              alt={`${project.title} Interface 1`}
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute bottom-2 left-2 bg-background/90 dark:bg-neutral-950/90 px-2 py-0.5 text-[9px] font-mono border border-dashed border-neutral-300 dark:border-neutral-800">
              FIG. 01 // INTERFACE OVERVIEW
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={project.imageSrc}
              alt={`${project.title} Interface 2`}
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute bottom-2 left-2 bg-background/90 dark:bg-neutral-950/90 px-2 py-0.5 text-[9px] font-mono border border-dashed border-neutral-300 dark:border-neutral-800">
              FIG. 02 // ARCHITECTURE / FLOW
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={project.imageSrc}
              alt={`${project.title} Interface 3`}
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute bottom-2 left-2 bg-background/90 dark:bg-neutral-950/90 px-2 py-0.5 text-[9px] font-mono border border-dashed border-neutral-300 dark:border-neutral-800">
              FIG. 03 // CORE METRICS / LOGS
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
