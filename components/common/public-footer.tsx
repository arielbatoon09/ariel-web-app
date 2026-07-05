import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/common/section";
import { NAV_LINKS, SOCIALS, FOOTER_SERVICES, CONTACT_INFO } from "@/constants/navigation";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Section showTopLine={true} showBottomLine={false} containerClassName="py-0 md:py-0 relative overflow-hidden">
      {/* Huge low-contrast background watermark */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-10 z-[-1] flex items-end justify-center overflow-hidden select-none">
        <div className="translate-y-[25%] text-[11.3vw] leading-none font-black tracking-tighter text-neutral-100/80 uppercase select-none md:translate-y-[20%] dark:text-neutral-800/35">
          Ariel Batoon
        </div>
      </div>

      <div className="relative z-10 pt-8 pb-6 md:pt-12 md:pb-8">
        {/* Grid container for 5 footer columns */}
        <div className="grid grid-cols-2 gap-12 pb-12 md:grid-cols-3 lg:grid-cols-5 lg:gap-8">
          {/* Column 1: Brand & Logo */}
          <div className="col-span-2 space-y-4 pr-0 md:col-span-3 lg:col-span-1 lg:pr-4">
            <Link href="/" className="flex w-fit items-center space-x-3">
              <div className="relative flex h-6 items-center">
                <Image
                  src="/icons/ab-logo-text-dark.png"
                  className="block h-12 w-auto object-contain dark:hidden"
                  alt="ab logo"
                  width={100}
                  height={100}
                />
                <Image
                  src="/icons/ab-logo-text-white.png"
                  className="hidden h-12 w-auto object-contain dark:block"
                  alt="ab logo"
                  width={100}
                  height={100}
                />
              </div>
              <div className="h-3.5 w-[1px] bg-neutral-300 dark:bg-neutral-800" />
              <span className="text-[12px] font-medium tracking-[0.2em] uppercase">Ariel Batoon</span>
            </Link>
            <p className="max-w-sm pt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Engineering premium digital products and experiences for ambitious businesses that refuse to settle. Built once, built right.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-4">
            <span className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase dark:text-neutral-500">Navigation</span>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-neutral-600 transition-colors duration-200 hover:text-foreground dark:text-neutral-400">
                  Home
                </Link>
              </li>
              {NAV_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-600 transition-colors duration-200 hover:text-foreground dark:text-neutral-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-4">
            <span className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase dark:text-neutral-500">Services</span>
            <ul className="space-y-2.5">
              {FOOTER_SERVICES.map((item) => (
                <li key={item.label} className="text-sm text-neutral-600 dark:text-neutral-400">
                  <Link href={item.href} className="transition-colors duration-200 hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div className="space-y-4">
            <span className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase dark:text-neutral-500">Socials</span>
            <ul className="space-y-2.5">
              {SOCIALS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-600 transition-colors duration-200 hover:text-foreground dark:text-neutral-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div className="space-y-4">
            <span className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase dark:text-neutral-500">Contact</span>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href={CONTACT_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-600 transition-colors duration-200 hover:text-foreground dark:text-neutral-400"
                >
                  WhatsApp &rarr; {CONTACT_INFO.whatsappLabel}
                </Link>
              </li>
              <li>
                <Link
                  href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`}
                  className="text-sm text-neutral-600 transition-colors duration-200 hover:text-foreground dark:text-neutral-400"
                >
                  {CONTACT_INFO.phone}
                </Link>
              </li>
              <li className="dark:text-neutral-505 font-mono text-sm text-neutral-400">{CONTACT_INFO.location}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Row Divider */}
        <div className="pointer-events-none mb-8 h-0 w-full border-t border-dashed border-neutral-300 dark:border-neutral-700" />

        {/* Bottom copyright/founder row */}
        <div className="flex flex-col items-center justify-between gap-4 font-mono text-[11px] text-neutral-400 sm:flex-row dark:text-neutral-500">
          <div>&copy; {currentYear} Ariel Batoon. All rights reserved.</div>
          <div>Founded by Ariel Batoon</div>
        </div>
      </div>
    </Section>
  );
}
