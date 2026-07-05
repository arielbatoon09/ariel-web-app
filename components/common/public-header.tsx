"use client";

import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ArrowUpRight, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);

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

        {/* Content Wrapper aligned with Section Content (indented inside vertical lines) */}
        <div className="w-full h-full px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/#work"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Work
            </Link>
            <Link
              href="/#services"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </Link>
            <Link
              href="/#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Let's Talk
              <ArrowUpRight className="ml-1 size-4" />
            </Link>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-200/50 dark:border-neutral-800/50 bg-background px-6 py-4 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/#work"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Work
            </Link>
            <Link
              href="/#services"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </Link>
            <Link
              href="/#about"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>
          <div className="pt-2">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className={cn(buttonVariants({ size: "sm" }), "w-full")}
            >
              Let's Talk
              <ArrowUpRight className="ml-1 size-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

