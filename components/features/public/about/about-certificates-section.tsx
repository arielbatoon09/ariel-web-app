import Link from "next/link";
import { Award } from "lucide-react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { CERTIFICATES } from "@/constants/about";
import { GridCard } from "@/components/common/grid-card";

export function AboutCertificatesSection() {
  return (
    <Section id="about-certificates" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        <SectionHeading icon={<Award className="size-5" />} title="Certificates" variant="sub" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATES.map((cert, idx) => (
            <Link
              key={idx}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block cursor-pointer transition-all duration-300 hover:-translate-y-1"
            >
              <GridCard className="space-y-3 border border-dashed border-neutral-300 p-5 md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="font-sans text-sm font-bold text-foreground transition-colors duration-200 group-hover:text-neutral-900 dark:group-hover:text-white">
                      {cert.title}
                    </h4>
                    <p className="font-mono text-xs text-neutral-400">{cert.issuer}</p>
                  </div>
                  <span className="dark:group-hover:border-neutral-105 border border-dashed border-neutral-300 px-2 py-0.5 font-mono text-[9px] text-neutral-400 uppercase transition-colors duration-300 select-none group-hover:border-neutral-900 group-hover:text-foreground dark:border-neutral-700">
                    CERT
                  </span>
                </div>
                <div className="group-hover:border-neutral-350 dark:group-hover:border-neutral-750 flex items-center justify-between border-t border-dashed border-neutral-200 pt-3 font-mono text-[10px] text-neutral-500 transition-colors duration-300 dark:border-neutral-800">
                  <span>{cert.date}</span>
                  <span className="text-neutral-500 transition-colors duration-300 group-hover:text-neutral-400">ID: {cert.id}</span>
                </div>
              </GridCard>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
