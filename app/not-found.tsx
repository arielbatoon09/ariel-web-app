import Link from "next/link";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";
import { PublicHeader } from "@/components/common/public-header";
import { PublicFooter } from "@/components/common/public-footer";

export function NotFoundContent() {
  return (
    <main className="flex min-h-[70vh] flex-1 flex-col justify-center bg-background">
      <Section id="not-found" containerClassName="py-20 text-center" showTopLine={false} showBottomLine={false}>
        <div className="mx-auto max-w-md space-y-6">
          <div className="space-y-2">
            <span className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase dark:text-neutral-500">Error // 404</span>
            <h1 className="font-sans text-4xl font-bold tracking-tight text-foreground md:text-5xl">Page Not Found</h1>
          </div>

          <div className="my-6 h-0 w-full border-t border-dashed border-neutral-300 dark:border-neutral-700" />

          <p className="font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            The page you are looking for does not exist, has been removed, or is temporarily unavailable.
          </p>

          <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full cursor-pointer rounded-none border border-dashed border-neutral-300 font-mono text-xs tracking-wider uppercase hover:border-neutral-900 sm:w-auto dark:border-neutral-700 dark:hover:border-neutral-100"
              >
                <Home className="mr-2 size-3.5" />
                Return Home
              </Button>
            </Link>
            <Link href="/works">
              <Button className="w-full cursor-pointer rounded-none font-mono text-xs tracking-wider uppercase sm:w-auto">
                Explore Works
                <ArrowRight className="ml-2 size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}

export default function NotFound() {
  return (
    <>
      <PublicHeader />
      <NotFoundContent />
      <PublicFooter />
    </>
  );
}
