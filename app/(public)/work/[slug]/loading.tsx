import { Section } from "@/components/common/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function CaseStudyLoading() {
  return (
    <div className="min-h-screen bg-background pt-12 md:pt-16 pb-12 md:pb-16 font-mono text-xs">
      <Section id="loading-hero" containerClassName="pt-4 md:pt-6 pb-12 md:pb-20" showTopLine={false} showBottomLine={true}>
        <div className="space-y-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left Column (Content) */}
            <div className="space-y-6 lg:col-span-7">
              {/* Back Button Link */}
              <Skeleton className="h-4 w-24" />
              
              {/* Tag */}
              <Skeleton className="h-3 w-20" />
              
              {/* Title */}
              <Skeleton className="h-10 w-5/6" />
              
              {/* Description */}
              <div className="space-y-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
              
              {/* Live Link CTAs */}
              <div className="flex gap-3">
                <Skeleton className="h-8 w-24 rounded-none" />
                <Skeleton className="h-8 w-28 rounded-none" />
              </div>
            </div>

            {/* Right Column (Meta list) */}
            <div className="space-y-4 border border-dashed border-neutral-300 p-6 lg:col-span-5 dark:border-neutral-700">
              <Skeleton className="h-4 w-1/3" />
              <div className="space-y-3 pt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-dashed border-neutral-200 dark:border-neutral-800 last:border-0 pb-1.5 last:pb-0">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Banner image placeholder */}
          <Skeleton className="mt-8 aspect-[16/6] w-full rounded-none" />
        </div>
      </Section>
    </div>
  );
}
