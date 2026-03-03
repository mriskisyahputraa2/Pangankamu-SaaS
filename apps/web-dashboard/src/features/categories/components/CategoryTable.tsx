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
      <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="text-[11px] uppercase font-bold text-slate-500">
              <TableHead className="text-center w-[70px]">No</TableHead>
              <TableHead>Nama Kategori</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} className="h-60 text-center">
                <Loader2 className="animate-spin inline text-emerald-500" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="text-[11px] uppercase font-bold text-slate-500">
            <TableHead className="text-center w-[70px]">No</TableHead>
            <TableHead>Nama Kategori</TableHead>
            <TableHead className="text-right pr-6">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-40 text-center text-slate-400 italic"
              >
                Belum ada kategori.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-center text-slate-400">
                  {(currentPage - 1) * limit + index + 1}
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  {item.name}
                </TableCell>
                <TableCell className="text-right pr-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-200"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <DeleteCategoryDialog
                      categoryId={item.id}
                      categoryName={item.name}
                      onSuccess={onRefresh}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
