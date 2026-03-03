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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/features/products/services/productService";
import { categoryService } from "@/features/categories";
import { toast } from "sonner";

export default function ProductsPage() {
  const [activeStoreId, setActiveStoreId] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price_base: "",
    price_sell: "",
    stock: "",
    unit: "pcs",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      const storeId =
        parsed.data?.user?.store_id || parsed.user?.store_id || parsed.store_id;
      if (storeId) setActiveStoreId(storeId);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!activeStoreId) return;
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getProducts(
          activeStoreId,
          currentPage,
          parseInt(rowsPerPage),
          searchTerm,
        ),
        categoryService.getCategories(1, 100, ""),
      ]);
      if (prodRes.status === "success") {
        setProducts(prodRes.data);
        setTotalData(prodRes.meta?.total_data || 0);
      }
      if (catRes.status === "success") setCategories(catRes.data);
    } catch (err) {
      toast.error("Gagal sinkronisasi data");
    } finally {
      setLoading(false);
    }
  }, [activeStoreId, currentPage, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        store_id: activeStoreId,
        price_base: Number(formData.price_base),
        price_sell: Number(formData.price_sell),
        stock: Number(formData.stock),
      };
      editingId
        ? await updateProduct(editingId, payload)
        : await createProduct(payload);
      toast.success("Berhasil disimpan");
      setIsModalOpen(false);
      setFormData({
        name: "",
        category_id: "",
        price_base: "",
        price_sell: "",
        stock: "",
        unit: "pcs",
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const totalPages = Math.ceil(totalData / parseInt(rowsPerPage));

  return (
    <div className="w-full space-y-6 font-jakarta">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Inventaris Produk
          </h1>
          <p className="text-sm text-slate-500">
            Kelola stok dan harga jual UMKM kamu. [cite: 7, 58]
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 rounded-xl h-11 px-5">
              <Plus size={18} /> Tambah Produk
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-bold">
                {editingId ? "Edit" : "Tambah"} Produk
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                placeholder="Nama Produk"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <Select
                value={formData.category_id}
                onValueChange={(val) =>
                  setFormData({ ...formData, category_id: val })
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Harga Modal"
                  value={formData.price_base}
                  onChange={(e) =>
                    setFormData({ ...formData, price_base: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Harga Jual"
                  value={formData.price_sell}
                  onChange={(e) =>
                    setFormData({ ...formData, price_sell: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Stok"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Unit (kg/pcs)"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-600 py-6 font-bold"
              >
                Simpan Produk
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Cari produk..."
            className="pl-10 h-11 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="text-[11px] uppercase font-bold text-slate-500">
              <TableHead className="text-center w-[60px]">No</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Harga Jual</TableHead>
              <TableHead className="text-center">Stok</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-60 text-center">
                  <Loader2 className="animate-spin inline text-emerald-500" />
                </TableCell>
              </TableRow>
            ) : (
              products.map((item, index) => (
                <TableRow key={item.id} className="text-sm">
                  <TableCell className="text-center text-slate-400">
                    {(currentPage - 1) * Number(rowsPerPage) + index + 1}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold uppercase">
                      {item.categories?.name || "Umum"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    Rp {Number(item.price_sell).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${item.stock < 10 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      {item.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button variant="ghost" size="icon">
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="p-4 border-t flex justify-between items-center text-sm text-slate-500">
          <span>
            Hal {currentPage} dari {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
