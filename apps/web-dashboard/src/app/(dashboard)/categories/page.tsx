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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  LayoutGrid,
} from "lucide-react";
import { Category } from "@/types";
import { getCategories } from "@/services/category-service";
import { AddCategoryModal } from "@/components/categories/add-category-modal";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [activeStoreId, setActiveStoreId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      const storeId =
        parsed.data?.user?.store_id || parsed.user?.store_id || parsed.store_id;
      if (storeId) setActiveStoreId(storeId);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    if (!activeStoreId) return;
    setLoading(true);
    try {
      const res = await getCategories(
        activeStoreId,
        currentPage,
        10,
        searchTerm,
      );
      if (res.status === "success") {
        setCategories(res.data);
        setTotalData(res.meta?.total_data || 0);
      }
    } catch (err) {
      toast.error("Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  }, [activeStoreId, currentPage, searchTerm]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="w-full space-y-6 font-jakarta">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kategori Produk</h1>
          <p className="text-sm text-slate-500">
            Grup barang untuk isolasi tenant SaaS.
          </p>
        </div>
        {activeStoreId && (
          <AddCategoryModal
            storeId={activeStoreId}
            onSuccess={fetchCategories}
          />
        )}
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <Input
          placeholder="Cari kategori..."
          className="pl-10 h-11 rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
                    {(currentPage - 1) * 10 + index + 1}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button variant="ghost" size="icon">
                      <Pencil size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
