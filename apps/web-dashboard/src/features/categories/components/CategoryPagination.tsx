import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  totalData: number;
  displayedCount: number;
  onPageChange: (page: number) => void;
}

export function CategoryPagination({
  currentPage,
  totalPages,
  totalData,
  displayedCount,
  onPageChange,
}: CategoryPaginationProps) {
  return (
    <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-white">
      <p className="text-xs text-slate-500">
        Menampilkan <span className="font-bold">{displayedCount}</span> dari{" "}
        <span className="font-bold">{totalData}</span> data
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg h-9 px-3"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </Button>

        <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-md">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          className="rounded-lg h-9 px-3"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
