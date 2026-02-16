"use client";

import { useState } from "react";
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
import { Plus, Tag, Loader2 } from "lucide-react"; // Tambahkan Tag untuk ikon visual
import { createCategory } from "@/services/category-service";
import { toast } from "sonner";

interface AddCategoryProps {
  onSuccess: () => void;
}

export function AddCategoryModal({ onSuccess }: AddCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createCategory(name);
      toast.success(res.message);
      setIsOpen(false);
      setName("");
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menambah kategori");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 h-11 px-5 shadow-lg shadow-emerald-100 transition-all hover:scale-[1.02]"
      >
        <Plus size={18} /> Tambah Kategori
      </Button>

      <DialogContent className="rounded-[24px] border-none sm:max-w-[400px] p-0 overflow-hidden bg-white shadow-2xl">
        {/* Header dengan Aksen Warna */}
        <div className="bg-emerald-600 p-6 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Tag size={24} className="text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold font-sans">
            Kategori Baru
          </DialogTitle>
          <DialogDescription className="text-emerald-100 text-sm mt-1">
            Tambahkan kategori baru untuk memudahkan pengelompokan produk.
          </DialogDescription>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              Nama Kategori
            </label>
            <Input
              placeholder="Misal: Sayuran Segar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="rounded-xl h-12 font-semibold text-slate-500 hover:bg-slate-100"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12 font-bold shadow-md shadow-emerald-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Simpan Kategori"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
