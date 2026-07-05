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
    <header className="sticky top-0 z-50 w-full border-b border-dashed border-neutral-300 dark:border-neutral-700 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 relative">
        {/* Left/Right Vertical Lines (Dashed) */}
        <div className="absolute top-0 bottom-0 left-6 md:left-8 w-0 border-l border-dashed border-neutral-300 dark:border-neutral-700 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-6 md:right-8 w-0 border-l border-dashed border-neutral-300 dark:border-neutral-700 pointer-events-none" />

        {/* Intersecting Plus (+) symbols at the bottom border */}
        <div className="absolute bottom-0 left-6 md:left-8 -translate-x-1/2 translate-y-1/2 select-none pointer-events-none text-xs font-light text-neutral-400/80 dark:text-neutral-600/80 bg-background px-1 z-10">
          +
        </div>
        <div className="absolute bottom-0 right-6 md:right-8 translate-x-1/2 translate-y-1/2 select-none pointer-events-none text-xs font-light text-neutral-400/80 dark:text-neutral-600/80 bg-background px-1 z-10">
          +
        </div>

        {/* Content Wrapper aligned with Section Content */}
        <div className="w-full h-full px-4 md:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative h-5 flex items-center">
              <Image
                src="/icons/ab-logo-text-dark.png"
                className="h-10 w-auto block dark:hidden object-contain"
                alt="ab logo"
                width={80}
                height={80}
              />
              <Image
                src="/icons/ab-logo-text-white.png"
                className="h-10 w-auto hidden dark:block object-contain"
                alt="ab logo"
                width={80}
                height={80}
              />
            </div>
            <div className="h-3 w-[1px] bg-neutral-300 dark:bg-neutral-800" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-500 dark:text-neutral-400">
              Ariel Batoon
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative font-mono text-[11px] uppercase tracking-wider py-1 transition-colors group cursor-pointer",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 right-0 h-0 border-b border-dashed border-current transition-transform duration-300 origin-left scale-x-0",
                      isActive ? "scale-x-100" : "group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <ConnectDialog>
              <Button
                className="rounded-none border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 font-mono text-[10px] uppercase tracking-wider cursor-pointer h-8 px-4"
              >
                Let's Talk
                <ArrowUpRight className="ml-1 size-3.5" />
              </Button>
            </ConnectDialog>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="h-8 w-8 flex items-center justify-center rounded-none border border-dashed border-neutral-300 dark:border-neutral-700 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-dashed border-neutral-300 dark:border-neutral-700 bg-background/95 backdrop-blur-md px-10 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 font-mono text-xs uppercase tracking-wider">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-2 border-b border-dashed border-neutral-200/50 dark:border-neutral-800/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2">
            <ConnectDialog>
              <Button size="lg" className="w-full rounded-none font-mono text-xs uppercase tracking-wider cursor-pointer h-11">
                Let's Talk
                <ArrowUpRight className="ml-1 size-4" />
              </Button>
            </ConnectDialog>
          </div>
        </div>
      )}
    </header>
  );
}
