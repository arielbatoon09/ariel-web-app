"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Menu, X, LogOut, User } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardSidebarProps {
  role: "admin" | "customer";
  navItems: NavItem[];
  userProfile?: {
    name: string;
    email: string;
  };
}

export function DashboardSidebar({ role, navItems, userProfile = { name: "Ariel Batoon", email: "ariel@batoon.com" } }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Top Header */}
      <header className="flex h-14 items-center justify-between border-b border-neutral-300 bg-background px-4 lg:hidden dark:border-neutral-700">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative flex h-5 items-center">
            <Image
              src="/icons/ab-logo-text-dark.png"
              className="block h-7 w-auto object-contain dark:hidden"
              alt="ab logo"
              width={60}
              height={60}
              priority
            />
            <Image
              src="/icons/ab-logo-text-white.png"
              className="hidden h-7 w-auto object-contain dark:block"
              alt="ab logo"
              width={60}
              height={60}
              priority
            />
          </div>
          <div className="h-3 w-[1px] bg-neutral-300 dark:bg-neutral-800" />
          <span className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">
            {role === "admin" ? "ADMIN PANEL" : "CLIENT PORTAL"}
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex size-9 items-center justify-center border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900/60"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {/* Sidebar overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)} />}

      {/* Main Sidebar Wrapper */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-neutral-300 bg-neutral-50/50 backdrop-blur-md transition-transform duration-300 ease-out lg:translate-x-0 dark:border-neutral-700 dark:bg-neutral-950/30",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:sticky lg:h-screen"
        )}
      >
        {/* Dynamic Intersection Plus Markers */}
        <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] font-light text-neutral-300 select-none dark:text-neutral-700">
          +
        </div>
        <div className="pointer-events-none absolute right-0 bottom-0 z-20 translate-x-1/2 translate-y-1/2 text-[10px] font-light text-neutral-300 select-none dark:text-neutral-700">
          +
        </div>

        <div className="space-y-6 py-6">
          {/* Header Branding */}
          <div className="px-6">
            <Link href="/" className="group block">
              <div className="flex items-center space-x-3">
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
                <span className="font-mono text-sm font-bold tracking-widest text-foreground uppercase">
                  {role === "admin" ? "ADMIN PANEL" : "CLIENT PORTAL"}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 border border-transparent px-3 py-2.5 font-sans text-sm font-medium transition-all duration-300",
                    isActive
                      ? "dark:border-neutral-750 border border-neutral-300 bg-neutral-100 text-foreground dark:bg-neutral-900/60"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-foreground dark:text-neutral-400 dark:hover:bg-neutral-900/40"
                  )}
                >
                  <span
                    className={cn(
                      "size-4 transition-transform duration-300",
                      isActive ? "text-foreground" : "text-neutral-400 dark:text-neutral-500"
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="font-mono text-xs tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer User Profiles & Settings */}
        <div className="space-y-4 border-t border-neutral-300 p-4 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center border border-neutral-300 bg-neutral-100 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
                <User className="size-4" />
              </div>
              <div className="max-w-[120px] overflow-hidden">
                <p className="truncate font-sans text-xs font-bold text-foreground">{userProfile.name}</p>
                <p className="truncate font-mono text-[10px] text-neutral-500 dark:text-neutral-400">{userProfile.email}</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 border border-neutral-300 py-2.5 font-mono text-xs tracking-wider text-neutral-500 uppercase transition-all duration-300 hover:bg-neutral-100 hover:text-foreground dark:border-neutral-700 dark:hover:bg-neutral-900/60"
          >
            <LogOut className="size-3.5" />
            Exit Portal
          </Link>
        </div>
      </aside>
    </>
  );
}
