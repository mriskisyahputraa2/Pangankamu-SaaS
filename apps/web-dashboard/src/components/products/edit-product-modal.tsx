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
import { Pencil, Loader2 } from "lucide-react";
import { updateProduct } from "@/services/product-service";
import { getCategories } from "@/services/category-service";
import { toast } from "sonner";

interface EditProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditProductModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: EditProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
      });
      const fetchCats = async () => {
        const res = await getCategories(1, 100);
        if (res.status === "success") setCategories(res.data);
      };
      fetchCats();
    }
  }, [product]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
      };
      await updateProduct(product.id, payload);
      toast.success("Produk diperbarui");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error("Gagal memperbarui produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[24px] border-none sm:max-w-[425px] p-0 overflow-hidden bg-white shadow-2xl">
        <div className="bg-slate-800 p-6 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Pencil size={24} />
          </div>
          <DialogTitle className="text-2xl font-bold">Edit Produk</DialogTitle>
          <DialogDescription className="text-slate-300 text-sm mt-1">
            Ubah informasi stok pangan Anda.
          </DialogDescription>
        </div>
        <form onSubmit={handleUpdate} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Nama Produk
            </label>
            <Input
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
                <SelectValue />
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
              className="w-full bg-slate-800 hover:bg-slate-900 rounded-xl h-12 font-bold"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
