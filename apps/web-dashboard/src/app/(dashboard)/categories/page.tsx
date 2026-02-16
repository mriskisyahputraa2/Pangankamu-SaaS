"use client";

import { useState, useEffect } from "react";
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

// --- Import Service ---
import { getCategories } from "@/services/category-service";

// --- Import Komponen Modal yang Sudah Dipisah ---
import { AddCategoryModal } from "@/components/categories/add-category-modal";
import { EditCategoryModal } from "@/components/categories/edit-category-modal";
import { toast } from "sonner";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-modal";

export default function CategoriesPage() {
  // --- State Data & Loading ---
  const [categories, setCategories] = useState<any[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- State Kontrol (Pagination & Search) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");

  // --- State Modal Edit ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  // --- Fungsi Fetch Utama ---
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories(
        currentPage,
        parseInt(rowsPerPage),
        searchTerm,
      );
      if (res.status === "success") {
        setCategories(res.data);
        setTotalData(res.total);
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      toast.error("Gagal menyambungkan ke server.");
    } finally {
      setLoading(false);
    }
  };

  // Effect untuk menjalankan fetch data
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCategories();
    }, 300); // Debounce agar tidak terlalu berat saat mengetik search

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, rowsPerPage, searchTerm]);

  // Persiapan untuk membuka modal edit
  const openEditModal = (item: any) => {
    setSelectedCategory(item);
    setIsEditOpen(true);
  };

  const totalPages = Math.ceil(totalData / parseInt(rowsPerPage));

  return (
    <div className="w-full space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Daftar Kategori
          </h1>
          <p className="text-sm text-slate-500">
            Manajemen pengelompokan produk Toko Rizki jaya.
          </p>
        </div>

        {/* Memanggil Komponen Modal Tambah yang Terpisah */}
        <AddCategoryModal onSuccess={fetchCategories} />
      </div>

      {/* FILTER & SEARCH SECTION */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Cari kategori..."
            className="pl-10 border-slate-200 rounded-xl h-11 bg-white focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset ke hal 1 setiap mencari
            }}
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-b border-slate-100">
                <TableHead className="w-[70px] text-center font-bold text-slate-700 uppercase text-[11px]">
                  No
                </TableHead>
                <TableHead className="font-bold text-slate-700 uppercase text-[11px]">
                  Nama Kategori
                </TableHead>
                <TableHead className="text-right font-bold text-slate-700 uppercase text-[11px] pr-6">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-72 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2
                        className="animate-spin text-emerald-500"
                        size={32}
                      />
                      <p className="text-sm font-medium text-slate-400">
                        Sinkronisasi data...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-40 text-center text-slate-400 italic"
                  >
                    Belum ada kategori terdaftar.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors"
                  >
                    {/* DYNAMIC NUMBERING */}
                    <TableCell className="text-center text-slate-400 text-sm">
                      {(currentPage - 1) * parseInt(rowsPerPage) + index + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex justify-end gap-1">
                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(item)}
                          className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg h-9 w-9"
                        >
                          <Pencil size={16} />
                        </Button>

                        {/* Delete Alert Dialog (Mewah) */}
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
        </div>

        {/* PAGINATION FOOTER */}
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            {/* ROWS PER PAGE SELECTOR */}
            <span>Tampilkan</span>
            <Select
              value={rowsPerPage}
              onValueChange={(val) => {
                setRowsPerPage(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-[75px] border-slate-200 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
            {/* DATA COUNTER */}
            <span className="hidden sm:inline">dari {totalData} kategori</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-slate-700">
              Hal {currentPage} / {totalPages || 1}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-slate-200 h-9 w-9 p-0"
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-slate-200 h-9 w-9 p-0"
                disabled={
                  currentPage === totalPages || totalPages === 0 || loading
                }
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Terpisah */}
      <EditCategoryModal
        category={selectedCategory}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={fetchCategories}
      />
    </div>
  );
}
