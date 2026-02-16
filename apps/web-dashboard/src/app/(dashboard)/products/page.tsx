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
} from "@/services/product-service";

export default function ProductsPage() {
  // --- State Data & Loading ---
  const [products, setProducts] = useState<any[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- State Kontrol (Pagination & Search) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");

  // --- State Form (Tambah/Edit) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  // Fungsi Fetch Utama
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts(currentPage, parseInt(rowsPerPage));
      if (res.status === "success") {
        setProducts(res.data);
        setTotalData(res.total);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, rowsPerPage]);

  // Handler Simpan Data (Tambah & Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  // Handler Hapus Data
  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus produk ini dari Toko Rizki jaya?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  // Persiapan Edit
  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      stock: item.stock.toString(),
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", category: "", price: "", stock: "" });
  };

  const totalPages = Math.ceil(totalData / parseInt(rowsPerPage));

  return (
    <div className="w-full space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Daftar Produk
          </h1>
          <p className="text-sm text-slate-500">
            Manajemen stok pangan Toko Rizki jaya.
          </p>
        </div>

        <Dialog
          open={isModalOpen}
          onOpenChange={(val) => {
            setIsModalOpen(val);
            if (!val) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 shadow-sm h-11 px-5">
              <Plus size={18} /> Tambah Produk
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl border-none sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingId ? "Edit Produk" : "Tambah Produk Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nama Produk
                </label>
                <Input
                  placeholder="Contoh: Ayam Potong"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="rounded-xl border-slate-100 h-11 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Kategori
                </label>
                <Input
                  placeholder="Unggas / Daging Merah"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="rounded-xl border-slate-100 h-11"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Harga (Rp)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="rounded-xl border-slate-100 h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Stok
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="rounded-xl border-slate-100 h-11"
                    required
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl py-6 h-11 font-bold"
                >
                  {editingId ? "Simpan Perubahan" : "Simpan Produk"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* FILTER & SEARCH SECTION */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Cari produk..."
            className="pl-10 border-slate-200 rounded-xl h-11 bg-white focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[200px] border-slate-200 rounded-xl h-11 bg-white">
            <Filter size={18} className="mr-2 text-slate-400" />
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="unggas">Unggas</SelectItem>
            <SelectItem value="daging">Daging Merah</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TABLE SECTION */}
      <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto min-h-[450px]">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-b border-slate-100">
                <TableHead className="w-[70px] text-center font-bold text-slate-700 uppercase text-[11px]">
                  No
                </TableHead>
                <TableHead className="font-bold text-slate-700 uppercase text-[11px]">
                  Nama Produk
                </TableHead>
                <TableHead className="font-bold text-slate-700 uppercase text-[11px]">
                  Kategori
                </TableHead>
                <TableHead className="text-right font-bold text-slate-700 uppercase text-[11px]">
                  Harga
                </TableHead>
                <TableHead className="text-center font-bold text-slate-700 uppercase text-[11px]">
                  Stok
                </TableHead>
                <TableHead className="text-right font-bold text-slate-700 uppercase text-[11px] pr-6">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-72 text-center">
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
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-40 text-center text-slate-400 italic"
                  >
                    Belum ada produk terdaftar.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((item, index) => (
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
                    <TableCell>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-tighter italic">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-700">
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center justify-center min-w-[35px] px-2 py-1 rounded-md text-xs font-bold ${item.stock < 10 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
                      >
                        {item.stock}
                      </span>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg h-9 w-9"
                        >
                          <Trash2 size={16} />
                        </Button>
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
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="hidden sm:inline">dari {totalData} produk</span>
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
    </div>
  );
}
