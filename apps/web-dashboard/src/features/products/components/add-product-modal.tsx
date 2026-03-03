"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Plus, Package, Loader2 } from "lucide-react";
import { createProduct } from "../services/productService";
import { categoryService } from "@/features/categories";
import { toast } from "sonner";

export function AddProductModal({ onSuccess }: { onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    if (isOpen) {
      const fetchCats = async () => {
        const res = await categoryService.getCategories(1, 100);
        if (res.status === "success") setCategories(res.data);
      };
      fetchCats();
    }
  }, [isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
      };
      const res = await createProduct(payload);
      toast.success(res.message || "Produk berhasil ditambah");
      setIsOpen(false);
      setFormData({ name: "", category: "", price: "", stock: "" });
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menambah produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 h-11 px-5 shadow-lg shadow-emerald-100"
      >
        <Plus size={18} /> Tambah Produk
      </Button>
      <DialogContent className="rounded-[24px] border-none sm:max-w-[425px] p-0 overflow-hidden bg-white shadow-2xl">
        <div className="bg-emerald-600 p-6 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Package size={24} />
          </div>
          <DialogTitle className="text-2xl font-bold">Produk Baru</DialogTitle>
          <DialogDescription className="text-emerald-100 text-sm mt-1">
            Lengkapi detail produk pangan Toko Rizki jaya.
          </DialogDescription>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Nama Produk
            </label>
            <Input
              placeholder="Ayam Potong"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="rounded-xl h-11 border-slate-100"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Kategori
            </label>
            <Select
              onValueChange={(v) => setFormData({ ...formData, category: v })}
              value={formData.category}
            >
              <SelectTrigger className="rounded-xl h-11 border-slate-100">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Harga (Rp)
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="rounded-xl h-11 border-slate-100"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Stok
              </label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="rounded-xl h-11 border-slate-100"
                required
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12 font-bold"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Simpan Produk"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
