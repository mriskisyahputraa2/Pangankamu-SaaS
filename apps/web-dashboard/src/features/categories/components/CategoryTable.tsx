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

// Mobile Card Component for better mobile experience
function CategoryCard({
  category,
  index,
  currentPage,
  limit,
  onEdit,
  onRefresh,
}: {
  category: Category;
  index: number;
  currentPage: number;
  limit: number;
  onEdit: (category: Category) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">
              #{(currentPage - 1) * limit + index + 1}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-base mt-2">
            {category.name}
          </h3>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
        <Button
          variant="ghost"
          size="sm"
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-200 h-8 px-3"
          onClick={() => onEdit(category)}
        >
          <Pencil size={14} className="mr-1" />
          Edit
        </Button>
        <DeleteCategoryDialog
          categoryId={category.id}
          categoryName={category.name}
          onSuccess={onRefresh}
        />
      </div>
    </div>
  );
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
        {/* Desktop Table Loading */}
        <div className="hidden md:block border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="text-[11px] uppercase font-bold text-slate-500">
                <TableHead className="text-center w-16">No</TableHead>
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

        {/* Mobile Loading */}
        <div className="md:hidden flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-emerald-500" size={32} />
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="space-y-4">
        {/* Desktop Empty State */}
        <div className="hidden md:block border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="text-[11px] uppercase font-bold text-slate-500">
                <TableHead className="text-center w-16">No</TableHead>
                <TableHead>Nama Kategori</TableHead>
                <TableHead className="text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-40 text-center text-slate-400 italic"
                >
                  Belum ada kategori.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Mobile Empty State */}
        <div className="md:hidden bg-white border border-slate-100 rounded-xl p-8 text-center">
          <p className="text-slate-400 italic">Belum ada kategori.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="text-[11px] uppercase font-bold text-slate-500">
              <TableHead className="text-center w-16">No</TableHead>
              <TableHead>Nama Kategori</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((item, index) => (
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {categories.map((item, index) => (
          <CategoryCard
            key={item.id}
            category={item}
            index={index}
            currentPage={currentPage}
            limit={limit}
            onEdit={onEdit}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    </div>
  );
}
