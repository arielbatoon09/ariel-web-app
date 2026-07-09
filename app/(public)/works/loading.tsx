import { Section } from "@/components/common/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorksLoading() {
  return (
    <div className="min-h-screen bg-background pt-12 pb-12 font-mono text-xs md:pt-16 md:pb-16">
      <Section id="loading-archive" containerClassName="pt-6 md:pt-10 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
        <div className="space-y-10">
          {/* Section Heading Skeleton */}
          <div className="max-w-3xl space-y-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </div>

          {/* Filter Bar Skeleton */}
          <div className="flex flex-col gap-4 border-t border-b border-dashed border-neutral-300 py-6 md:flex-row md:items-center md:justify-between dark:border-neutral-700">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-7 w-20" />
              ))}
            </div>
            <Skeleton className="h-8 w-full md:w-64" />
          </div>

          {/* Grid Cards Skeleton */}
          <div className="grid grid-cols-1 border-t border-l border-dashed border-neutral-300 md:grid-cols-2 lg:grid-cols-3 dark:border-neutral-700">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group relative border-r border-b border-dashed border-neutral-300 p-6 dark:border-neutral-700">
                <div className="space-y-4">
                  {/* Image Aspect ratio skeleton */}
                  <Skeleton className="aspect-[16/10] w-full rounded-none" />

                  {/* Tag */}
                  <Skeleton className="h-2 w-1/4" />

                  {/* Title */}
                  <Skeleton className="h-5 w-2/3" />

                  {/* Description */}
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
