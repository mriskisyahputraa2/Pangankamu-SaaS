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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Loader2 } from "lucide-react";
import { updateCategory } from "@/services/category-service";
import { toast } from "sonner";

interface EditProps {
  category: any;
  storeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCategoryModal({
  category,
  storeId,
  isOpen,
  onClose,
  onSuccess,
}: EditProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (category) setName(category.name);
  }, [category]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mengirim ID kategori dan store_id untuk validasi
      await updateCategory(category.id, { store_id: storeId, name });
      toast.success("Perubahan kategori disimpan");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error("Gagal memperbarui kategori");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[24px] border-none p-0 overflow-hidden bg-white shadow-2xl">
        <div className="bg-slate-800 p-6 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Pencil size={24} />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            Edit Kategori
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-sm mt-1">
            Perbarui nama pengelompokan produk Anda[cite: 8].
          </DialogDescription>
        </div>
        <form onSubmit={handleUpdate} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Nama Kategori
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-12 border-slate-100"
              required
            />
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
