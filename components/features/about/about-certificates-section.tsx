import Link from "next/link";
import { Award } from "lucide-react";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { CERTIFICATES } from "@/constants/about";

export function AboutCertificatesSection() {
  return (
    <Section id="about-certificates" containerClassName="pt-8 md:pt-12 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-8">
        <SectionHeading icon={<Award className="size-5" />} title="Certificates" variant="sub" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTIFICATES.map((cert, idx) => (
            <Link 
              key={idx} 
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 p-6 bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-900/90 space-y-3 relative group cursor-pointer transition-all duration-300 hover:-translate-y-1 block"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold font-sans text-foreground group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-200">{cert.title}</h4>
                  <p className="text-xs text-neutral-400 font-mono">{cert.issuer}</p>
                </div>
                <span className="text-[9px] font-mono border border-dashed border-neutral-300 dark:border-neutral-700 group-hover:border-neutral-900 dark:group-hover:border-neutral-105 px-2 py-0.5 text-neutral-400 group-hover:text-foreground select-none uppercase transition-colors duration-300">
                  CERT
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 border-t border-dashed border-neutral-200 dark:border-neutral-800 pt-3 group-hover:border-neutral-350 dark:group-hover:border-neutral-750 transition-colors duration-300">
                <span>{cert.date}</span>
                <span className="text-neutral-500 group-hover:text-neutral-400 transition-colors duration-300">ID: {cert.id}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
