import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalData: number;
  displayedCount: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({
  currentPage,
  totalPages,
  totalData,
  displayedCount,
  onPageChange,
}: ProductPaginationProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-b-2xl md:border-t-0 md:rounded-t-none">
      {/* Desktop Pagination */}
      <div className="hidden md:flex items-center justify-between p-4 border-t border-slate-50">
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

      {/* Mobile Pagination */}
      <div className="md:hidden p-4 space-y-3">
        <div className="text-center">
          <p className="text-xs text-slate-500">
            <span className="font-bold">{displayedCount}</span> dari{" "}
            <span className="font-bold">{totalData}</span> data
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Halaman {currentPage} dari {totalPages}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg h-9 px-4 flex-1 max-w-24"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft size={16} className="mr-1" />
            Prev
          </Button>

          <span className="text-xs font-bold px-3 py-2 bg-slate-100 rounded-lg min-w-20 text-center">
            {currentPage} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            className="rounded-lg h-9 px-4 flex-1 max-w-24"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
