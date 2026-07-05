import { ChevronLeft, ChevronRight, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ArchivePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function ArchivePagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange
}: ArchivePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-dashed border-neutral-300 dark:border-neutral-700">
      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-505 flex items-center gap-1.5">
        <CornerDownRight className="size-3" />
        Page {currentPage} of {totalPages} ({totalItems} total)
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className="rounded-none h-9 text-xs font-mono uppercase tracking-wider border-dashed disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronLeft className="mr-1 size-3.5" />
          Prev
        </Button>
        
        {/* Page number buttons */}
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNum = index + 1;
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "rounded-none h-9 w-9 p-0 text-xs font-mono cursor-pointer",
                  currentPage !== pageNum && "border-dashed"
                )}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className="rounded-none h-9 text-xs font-mono uppercase tracking-wider border-dashed disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          Next
          <ChevronRight className="ml-1 size-3.5" />
        </Button>
      </div>
    </div>
  );
}
