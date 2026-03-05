import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { Category } from "../types/category.types";
import { DeleteCategoryDialog } from "./modals/delete-category-modal";

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
  currentPage: number;
  limit: number;
  onEdit: (category: Category) => void;
  onRefresh: () => void;
}

export function CategoryTable({
  categories,
  loading,
  currentPage,
  limit,
  onEdit,
  onRefresh,
}: CategoryTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Loading Table - Responsive dengan scroll horizontal */}
        <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="text-[11px] uppercase font-bold text-slate-500">
                  <TableHead className="text-center w-12 px-3">No</TableHead>
                  <TableHead className="px-4">Nama Kategori</TableHead>
                  <TableHead className="text-right w-32 px-3">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: parseInt(limit.toString()) }).map(
                  (_, index) => (
                    <TableRow key={index} className="border-slate-100">
                      <TableCell className="text-center px-3">
                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="text-right px-3">
                        <div className="flex justify-end gap-2">
                          <div className="h-6 w-6 bg-slate-200 rounded animate-pulse"></div>
                          <div className="h-6 w-6 bg-slate-200 rounded animate-pulse"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="space-y-4">
        {/* Empty State Table */}
        <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="text-[11px] uppercase font-bold text-slate-500">
                  <TableHead className="text-center w-12 px-3">No</TableHead>
                  <TableHead className="px-4">Nama Kategori</TableHead>
                  <TableHead className="text-right w-32 px-3">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        📁
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">
                          Belum ada kategori
                        </p>
                        <p className="text-slate-400 text-sm">
                          Tambahkan kategori pertama Anda
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table dengan scroll horizontal untuk semua ukuran screen */}
      <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-slate-50/50">
              <TableRow className="text-[11px] uppercase font-bold text-slate-500">
                <TableHead className="text-center w-12 px-3">No</TableHead>
                <TableHead className="px-4">Nama Kategori</TableHead>
                <TableHead className="text-right w-32 px-3">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow
                  key={category.id}
                  className="border-slate-100 hover:bg-slate-50/50"
                >
                  <TableCell className="text-center font-medium text-slate-600 px-3">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>

                  <TableCell className="font-medium px-4">
                    <span className="font-semibold text-slate-900 text-sm">
                      {category.name}
                    </span>
                  </TableCell>

                  <TableCell className="text-right px-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-200 h-8 w-8 shrink-0"
                        onClick={() => onEdit(category)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <DeleteCategoryDialog
                        categoryId={category.id}
                        categoryName={category.name}
                        onSuccess={onRefresh}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
