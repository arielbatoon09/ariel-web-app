import Link from "next/link";
import { ExternalLink, Globe, Calendar, User, Building2, Cpu } from "lucide-react";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/common/back-button";
import { ParameterRow } from "@/components/common/parameter-row";
import { BannerShowcase } from "@/components/common/banner-showcase";
import type { Project } from "@/constants/projects";

interface CaseStudyHeroProps {
  project: Project;
}

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  const { caseStudy } = project;

  return (
    <Section id="cs-hero" containerClassName="pt-4 md:pt-6 pb-12 md:pb-20" showTopLine={false} showBottomLine={true}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-7 space-y-6">
          <BackButton href="/works" label="Back to Archive" />
          
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
              <Link href={caseStudy.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="rounded-none font-mono text-xs uppercase tracking-wider cursor-pointer">
                  Live Demo
                  <ExternalLink className="ml-1.5 size-3.5" />
                </Button>
              </Link>
            )}
            {caseStudy.githubUrl && (
              <Link href={caseStudy.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="rounded-none border-dashed font-mono text-xs uppercase tracking-wider cursor-pointer">
                  GitHub Code
                  <Globe className="ml-1.5 size-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Project Specs Metadata Block */}
        <div className="lg:col-span-5 w-full border border-dashed border-neutral-300 dark:border-neutral-700 p-6 bg-neutral-50/50 dark:bg-neutral-900/10 space-y-4 lg:sticky lg:top-24 self-start">
          <h3 className="text-xs font-mono uppercase tracking-wider text-foreground border-b border-dashed border-neutral-300 dark:border-neutral-700 pb-2.5">
            Project Parameters
          </h3>
          
          <div className="space-y-3.5 font-mono text-xs">
            <ParameterRow
              icon={<User className="size-3.5" />}
              label="Role:"
              value={caseStudy.role}
            />
            <ParameterRow
              icon={<Calendar className="size-3.5" />}
              label="Timeline:"
              value={caseStudy.timeline}
            />
            {caseStudy.client && (
              <ParameterRow
                icon={<Building2 className="size-3.5" />}
                label="Client:"
                value={caseStudy.client}
              />
            )}
            <div className="pt-2 border-t border-dashed border-neutral-250 dark:border-neutral-800">
              <ParameterRow
                icon={<Cpu className="size-3.5" />}
                label="Stack:"
                value={
                  <div className="flex flex-wrap gap-1 justify-end max-w-full">
                    {project.tags.map((t) => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-background text-neutral-600 dark:text-neutral-400">
                        {t}
                      </span>
                    ))}
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project Banner Showcase */}
      <div className="mt-12">
        <BannerShowcase src={project.imageSrc} alt={`${project.title} Banner`} />
      </div>
    </Section>
  );
}
