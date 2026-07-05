"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { ConnectDialog } from "@/components/common/connect-dialog";
import { NAV_LINKS } from "@/constants/navigation";

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dashed border-neutral-300 bg-background/80 backdrop-blur-md dark:border-neutral-700">
      <div className="relative mx-auto h-16 max-w-7xl px-6 md:px-8">
        {/* Left/Right Vertical Lines (Dashed) */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-6 w-0 border-l border-dashed border-neutral-300 md:left-8 dark:border-neutral-700" />
        <div className="pointer-events-none absolute top-0 right-6 bottom-0 w-0 border-l border-dashed border-neutral-300 md:right-8 dark:border-neutral-700" />

        {/* Intersecting Plus (+) symbols at the bottom border */}
        <div className="pointer-events-none absolute bottom-0 left-6 z-10 -translate-x-1/2 translate-y-1/2 bg-background px-1 text-xs font-light text-neutral-400/80 select-none md:left-8 dark:text-neutral-600/80">
          +
        </div>
        <div className="pointer-events-none absolute right-6 bottom-0 z-10 translate-x-1/2 translate-y-1/2 bg-background px-1 text-xs font-light text-neutral-400/80 select-none md:right-8 dark:text-neutral-600/80">
          +
        </div>

        {/* Content Wrapper aligned with Section Content */}
        <div className="flex h-full w-full items-center justify-between px-4 md:px-8">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative flex h-5 items-center">
              <Image
                src="/icons/ab-logo-text-dark.png"
                className="block h-10 w-auto object-contain dark:hidden"
                alt="ab logo"
                width={80}
                height={80}
                priority
              />
              <Image
                src="/icons/ab-logo-text-white.png"
                className="hidden h-10 w-auto object-contain dark:block"
                alt="ab logo"
                width={80}
                height={80}
                priority
              />
            </div>
            <div className="h-3 w-[1px] bg-neutral-300 dark:bg-neutral-800" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase dark:text-neutral-400">Ariel Batoon</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "group relative cursor-pointer py-1 font-mono text-[11px] tracking-wider uppercase transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute right-0 -bottom-0.5 left-0 h-0 origin-left scale-x-0 border-b border-dashed border-current transition-transform duration-300",
                      isActive ? "scale-x-100" : "group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA Actions */}
          <div className="hidden items-center space-x-3 md:flex">
            <ThemeToggle />
            <ConnectDialog>
              <Button className="h-8 cursor-pointer rounded-none border border-dashed border-neutral-300 px-4 font-mono text-[10px] tracking-wider uppercase hover:border-neutral-900 dark:border-neutral-700 dark:hover:border-neutral-100">
                Let&apos;s Talk
                <ArrowUpRight className="ml-1 size-3.5" />
              </Button>
            </ConnectDialog>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-none border border-dashed border-neutral-300 text-muted-foreground transition-colors hover:text-foreground dark:border-neutral-700"
              aria-label="Toggle menu"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="animate-in space-y-4 border-t border-dashed border-neutral-300 bg-background/95 px-10 py-6 backdrop-blur-md duration-200 slide-in-from-top md:hidden dark:border-neutral-700">
          <nav className="flex flex-col space-y-3 font-mono text-xs tracking-wider uppercase">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="border-b border-dashed border-neutral-200/50 py-2 text-muted-foreground transition-colors hover:text-foreground dark:border-neutral-800/50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2">
            <ConnectDialog>
              <Button size="lg" className="h-11 w-full cursor-pointer rounded-none font-mono text-xs tracking-wider uppercase">
                Let&apos;s Talk
                <ArrowUpRight className="ml-1 size-4" />
              </Button>
            </ConnectDialog>
          </div>
        </div>
      )}
    </header>
  );
}
