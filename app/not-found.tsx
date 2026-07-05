import Link from "next/link";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";
import { PublicHeader } from "@/components/common/public-header";
import { PublicFooter } from "@/components/common/public-footer";

export default function NotFound() {
  return (
    <>
      <PublicHeader />
      <main className="flex-1 flex flex-col justify-center bg-background min-h-[70vh]">
        <Section id="not-found" containerClassName="py-20 text-center" showTopLine={false} showBottomLine={false}>
          <div className="max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 dark:text-neutral-500 block">
                Error // 404
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-sans text-foreground">
                Page Not Found
              </h1>
            </div>
            
            <div className="w-full h-0 border-t border-dashed border-neutral-300 dark:border-neutral-700 my-6" />

            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              The page you are looking for does not exist, has been removed, or is temporarily unavailable.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link href="/">
                <Button variant="ghost" className="w-full sm:w-auto rounded-none border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 font-mono text-xs uppercase tracking-wider cursor-pointer">
                  <Home className="mr-2 size-3.5" />
                  Return Home
                </Button>
              </Link>
              <Link href="/works">
                <Button className="w-full sm:w-auto rounded-none font-mono text-xs uppercase tracking-wider cursor-pointer">
                  Explore Works
                  <ArrowRight className="ml-2 size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Section>
      </main>
      <PublicFooter />
    </>
  );
}
