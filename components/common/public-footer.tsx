import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/common/section";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Section showTopLine={true} showBottomLine={false} containerClassName="py-0 md:py-0 relative overflow-hidden">
      {/* Huge low-contrast background watermark text overlaying both navigation and copyright sections */}
      <div className="absolute inset-x-0 bottom-10 top-0 overflow-hidden pointer-events-none select-none z-[-1] flex items-end justify-center">
        <div className="text-[11.3vw] font-black tracking-tighter text-neutral-100/80 dark:text-neutral-800/35 uppercase leading-none select-none translate-y-[25%] md:translate-y-[20%]">
          Ariel Batoon
        </div>
      </div>

      <div className="relative z-10 pt-8 md:pt-12 pb-6 md:pb-8">
        {/* Grid container for 5 footer columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8 pb-12">
          
          {/* Column 1: Brand & Logo (Matching PublicHeader structure) */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4 pr-0 lg:pr-4">
            <Link href="/" className="flex items-center space-x-3 w-fit">
              <div className="relative h-6 flex items-center">
                <Image
                  src="/icons/ab-logo-text-dark.png"
                  className="h-12 w-auto block dark:hidden object-contain"
                  alt="ab logo"
                  width={100}
                  height={100}
                />
                <Image
                  src="/icons/ab-logo-text-white.png"
                  className="h-12 w-auto hidden dark:block object-contain"
                  alt="ab logo"
                  width={100}
                  height={100}
                />
              </div>
              <div className="h-3.5 w-[1px] bg-neutral-300 dark:bg-neutral-800" />
              <span className="text-[12px] font-medium tracking-[0.2em] uppercase">
                Ariel Batoon
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-sm pt-1">
              Engineering premium digital products and experiences for ambitious businesses that refuse to settle. Built once, built right.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 block">
              Navigation
            </span>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Work", href: "/works" },
                { label: "Services", href: "/services" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-foreground transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 block">
              Services
            </span>
            <ul className="space-y-2.5">
              {[
                { label: "Product Design", href: "/services" },
                { label: "Frontend Engineering", href: "/services" },
                { label: "Full-Stack Development", href: "/services" },
                { label: "Design Systems", href: "/services" },
                { label: "Technical Consulting", href: "/services" },
              ].map((item) => (
                <li key={item.label} className="text-sm text-neutral-600 dark:text-neutral-400">
                  <Link href={item.href} className="hover:text-foreground transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 block">
              Socials
            </span>
            <ul className="space-y-2.5">
              {[
                { label: "GitHub", href: "https://github.com" },
                { label: "LinkedIn", href: "https://linkedin.com" },
                { label: "Twitter / X", href: "https://twitter.com" },
                { label: "Dribbble", href: "https://dribbble.com" },
                { label: "Read.cv", href: "https://read.cv" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-foreground transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 block">
              Contact
            </span>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://wa.me/639455684578"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-foreground transition-colors duration-200"
                >
                  WhatsApp &rarr; +63 945 568 4578
                </a>
              </li>
              <li>
                <a
                  href="tel:+639455684578"
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-foreground transition-colors duration-200"
                >
                  +63 945 568 4578
                </a>
              </li>
              <li className="text-sm text-neutral-400 dark:text-neutral-500 font-mono">
                Zamboanga City, Philippines
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Row Divider */}
        <div className="w-full h-0 border-t border-dashed border-neutral-300 dark:border-neutral-700 pointer-events-none mb-8" />

        {/* Bottom copyright/founder row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
          <div>
            &copy; {currentYear} Ariel Batoon. All rights reserved.
          </div>
          <div>
            Founded by Ariel Batoon
          </div>
        </div>
      </div>
    </Section>
  );
}