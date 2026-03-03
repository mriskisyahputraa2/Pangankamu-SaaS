"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { categoryService } from "@/features/categories/services/categoryService";
import { Category } from "@/features/categories/types/category.types";
import { getErrorMessage } from "@/utils/error-handler";
import { AddCategoryModal } from "@/features/categories/components/modals/add-category-modal";
import { EditCategoryModal } from "@/features/categories/components/modals/edit-category-modal";
import { DeleteCategoryDialog } from "@/features/categories/components/modals/delete-category-modal";
import { toast } from "sonner";

export default function CategoriesPage() {
  // --- Data States ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Pagination & Filter States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Modal States ---
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Fungsi Fetch Data (Sesuai Struktur Clean Backend)
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      // Karena backend sekarang membaca store_id dari Token JWT di Header
      const res = await categoryService.getCategories(
        currentPage,
        parseInt(limit),
        searchTerm,
      );

      if (res.status === "success") {
        setCategories(res.data || []);
        setTotalData(res.meta?.total_data || 0);
        setTotalPages(res.meta?.total_pages || 1);
      }
    } catch (err) {
      // Menggunakan Error Handler yang sudah kita buat sebelumnya
      toast.error("Gagal memuat daftar kategori");
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, searchTerm]);

  // Function untuk refresh data dan kembali ke halaman 1
  const refreshCategoriesAndResetPage = useCallback(async () => {
    // Immediate reset to page 1
    setCurrentPage(1);

    // Force refresh dengan data page 1
    setLoading(true);
    try {
      const res = await categoryService.getCategories(
        1,
        parseInt(limit),
        searchTerm,
      );
      if (res.status === "success") {
        setCategories(res.data || []);
        setTotalData(res.meta?.total_data || 0);
        setTotalPages(res.meta?.total_pages || 1);
      }
    } catch (err) {
      toast.error("Gagal memuat daftar kategori");
    } finally {
      setLoading(false);
    }
  }, [limit, searchTerm]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="w-full space-y-6 font-jakarta">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kategori Produk</h1>
          <p className="text-sm text-slate-500">
            Daftar kategori untuk mengelompokkan produk Anda. Tambah, edit, atau
            hapus
          </p>
        </div>
        <AddCategoryModal onSuccess={refreshCategoriesAndResetPage} />
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Cari kategori..."
            className="pl-10 h-11 rounded-xl"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Select
          value={limit}
          onValueChange={(val) => {
            setLimit(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[130px] h-11 rounded-xl">
            <SelectValue placeholder="Baris" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 Baris</SelectItem>
            <SelectItem value="10">10 Baris</SelectItem>
            <SelectItem value="20">20 Baris</SelectItem>
            <SelectItem value="50">50 Baris</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-60 text-center">
                  <Loader2 className="animate-spin inline text-emerald-500" />
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
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
                    {(currentPage - 1) * parseInt(limit) + index + 1}
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
                        onClick={() => {
                          setSelectedCategory(item);
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <DeleteCategoryDialog
                        categoryId={item.id}
                        categoryName={item.name}
                        onSuccess={fetchCategories}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* PAGINATION: Navigasi simple di bawah table */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-white">
          <p className="text-xs text-slate-500">
            Menampilkan <span className="font-bold">{categories.length}</span>{" "}
            dari <span className="font-bold">{totalData}</span> data
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg h-9 px-3"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
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
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedCategory && (
        <EditCategoryModal
          category={selectedCategory}
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedCategory(null);
          }}
          onSuccess={fetchCategories}
        />
      )}
    </div>
  );
}
