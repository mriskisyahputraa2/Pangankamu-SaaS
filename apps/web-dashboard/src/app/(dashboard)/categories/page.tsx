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

// --- Types, Services & Components ---
import { Category } from "@/types";
import { getCategories } from "@/services/category-service";
import { AddCategoryModal } from "@/components/categories/add-category-modal";
import { EditCategoryModal } from "@/components/categories/edit-category-modal";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-modal";
import { toast } from "sonner";

export default function CategoriesPage() {
  // --- Dynamic Store ID (Multi-Tenancy) ---
  // mengambil id dari session login
  const [activeStoreId, setActiveStoreId] = useState<string>("");

  // --- State Data ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- State Kontrol ---
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");

  // --- State Modal Edit ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // 1. Ambil Store ID saat halaman dimuat (Poin 3A: Isolasi Data)
  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);

        // Cek apakah data tersimpan di root, atau di dalam .user, atau di .data.user
        const storeId =
          parsed.store_id ||
          parsed.user?.store_id ||
          parsed.data?.user?.store_id;

        if (storeId) {
          setActiveStoreId(storeId);
        } else {
          console.error("Store ID tidak ditemukan di localStorage");
          toast.error("Sesi toko tidak valid. Silakan login ulang.");
        }
      } catch (e) {
        console.error("Gagal parse data user:", e);
      }
    } else {
      toast.error("Anda belum login.");
    }
  }, []);

  // 2. Fetch Data (Hanya jalan jika activeStoreId sudah terisi)
  const fetchCategories = useCallback(async () => {
    if (!activeStoreId) return;

    setLoading(true);
    try {
      const res = await getCategories(
        activeStoreId,
        currentPage,
        parseInt(rowsPerPage),
        searchTerm,
      );

      if (res.status === "success") {
        setCategories(res.data); // Sesuai standarisasi backend data
        setTotalData(res.meta?.total_data || 0); // Sesuai standarisasi backend meta
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      toast.error("Gagal sinkronisasi data SaaS.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm, activeStoreId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCategories();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchCategories]);

  const openEditModal = (item: Category) => {
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
            Kategori Produk
          </h1>
          <p className="text-sm text-slate-500">
            Pengelompokan barang untuk isolasi tenant Pangankamu.
          </p>
        </div>

        {/* Modal Tambah otomatis menggunakan ID toko yang login */}
        {activeStoreId && (
          <AddCategoryModal
            storeId={activeStoreId}
            onSuccess={fetchCategories}
          />
        )}
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Cari kategori di toko ini..."
            className="pl-10 border-slate-200 rounded-xl h-11 bg-white focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-b border-slate-100 font-bold uppercase text-[11px] text-slate-500">
                <TableHead className="w-[70px] text-center">No</TableHead>
                <TableHead>Nama Kategori</TableHead>
                <TableHead className="text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!activeStoreId || loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-72 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2
                        className="animate-spin text-emerald-500"
                        size={32}
                      />
                      <p className="text-sm font-medium text-slate-400 italic">
                        Menyiapkan dashboard tenant...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-40 text-center text-slate-400 italic font-medium"
                  >
                    Belum ada kategori untuk toko ini.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors"
                  >
                    <TableCell className="text-center text-slate-400 text-sm">
                      {(currentPage - 1) * parseInt(rowsPerPage) + index + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(item)}
                          className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg h-9 w-9"
                        >
                          <Pencil size={16} />
                        </Button>

                        <DeleteCategoryDialog
                          categoryId={item.id}
                          categoryName={item.name}
                          storeId={activeStoreId}
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
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-4 border-t border-slate-100 bg-white text-sm text-slate-500">
          <div className="flex items-center gap-3">
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
            <span>dari {totalData} kategori</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-slate-700">
              Hal {currentPage} / {totalPages || 1}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg h-9 w-9 p-0"
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg h-9 w-9 p-0"
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

      <EditCategoryModal
        category={selectedCategory}
        storeId={activeStoreId}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={fetchCategories}
      />
    </div>
  );
}
