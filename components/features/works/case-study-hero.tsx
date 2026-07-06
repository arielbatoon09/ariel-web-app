import Link from "next/link";
import { ExternalLink, Globe, Calendar, User, Building2, Cpu } from "lucide-react";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/common/back-button";
import { ParameterRow } from "@/components/common/parameter-row";
import { CaseStudyGallery } from "@/components/features/works/case-study-gallery";
import type { Project } from "@/constants/projects";

interface CaseStudyHeroProps {
  project: Project;
}

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  const { caseStudy } = project;

  return (
    <Section id="cs-hero" containerClassName="pt-4 md:pt-6 pb-12 md:pb-20" showTopLine={false} showBottomLine={true}>
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-6 lg:col-span-7">
          <BackButton href="/works" label="Back to Archive" />

          <span className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase dark:text-neutral-500">{project.tag}</span>
          <h1 className="font-sans text-3xl leading-tight font-bold tracking-tight text-foreground md:text-5xl">{project.title}</h1>
          <p className="max-w-2xl font-sans text-base leading-relaxed text-neutral-600 md:text-lg dark:text-neutral-400">{project.description}</p>

          {/* Quick CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            {caseStudy.liveUrl && (
              <Link href={caseStudy.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="cursor-pointer rounded-none font-mono text-xs tracking-wider uppercase">
                  Live Demo
                  <ExternalLink className="ml-1.5 size-3.5" />
                </Button>
              </Link>
            )}
            {caseStudy.githubUrl && (
              <Link href={caseStudy.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="cursor-pointer rounded-none border-dashed font-mono text-xs tracking-wider uppercase">
                  GitHub Code
                  <Globe className="ml-1.5 size-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Project Specs Metadata Block */}
        <div className="w-full space-y-4 self-start border border-dashed border-neutral-300 bg-neutral-50 p-6 lg:sticky lg:top-24 lg:col-span-5 dark:border-neutral-700 dark:bg-neutral-900/60">
          <h3 className="border-b border-dashed border-neutral-300 pb-2.5 font-mono text-xs tracking-wider text-foreground uppercase dark:border-neutral-700">
            Project Parameters
          </h3>

          <div className="space-y-3.5 font-mono text-xs">
            <ParameterRow icon={<User className="size-3.5" />} label="Role:" value={caseStudy.role} />
            <ParameterRow icon={<Calendar className="size-3.5" />} label="Timeline:" value={caseStudy.timeline} />
            {caseStudy.client && <ParameterRow icon={<Building2 className="size-3.5" />} label="Client:" value={caseStudy.client} />}
            <div className="border-neutral-250 border-t border-dashed pt-2 dark:border-neutral-800">
              <ParameterRow
                icon={<Cpu className="size-3.5" />}
                label="Stack:"
                value={
                  <div className="flex max-w-full flex-wrap justify-end gap-1">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-neutral-200 bg-background px-1.5 py-0.5 text-[9px] text-neutral-600 dark:border-neutral-800 dark:text-neutral-400"
                      >
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

      {/* Project Gallery Showcase */}
      <div className="mt-12">
        <CaseStudyGallery images={project.gallery || [project.imageSrc]} title={project.title} />
      </div>
    </Section>
  );
}
