import { ChevronLeft, ChevronRight, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ArchivePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function ArchivePagination({ currentPage, totalPages, totalItems, onPageChange }: ArchivePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-dashed border-neutral-300 pt-6 dark:border-neutral-700">
      <span className="dark:text-neutral-505 flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-neutral-400 uppercase">
        <CornerDownRight className="size-3" />
        Page {currentPage} of {totalPages} ({totalItems} total)
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className="h-9 cursor-pointer rounded-none border-dashed font-mono text-xs tracking-wider uppercase disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="mr-1 size-3.5" />
          Prev
        </Button>

        {/* Page number buttons */}
        <div className="hidden items-center gap-1 sm:flex">
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNum = index + 1;
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={cn("h-9 w-9 cursor-pointer rounded-none p-0 font-mono text-xs", currentPage !== pageNum && "border-dashed")}
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
          className="h-9 cursor-pointer rounded-none border-dashed font-mono text-xs tracking-wider uppercase disabled:pointer-events-none disabled:opacity-30"
        >
          Next
          <ChevronRight className="ml-1 size-3.5" />
        </Button>
      </div>
    </div>
  );
}
