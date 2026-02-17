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
import { Plus, FolderPlus, Loader2 } from "lucide-react";
import { createCategory } from "@/services/category-service";
import { toast } from "sonner";

export function AddCategoryModal({
  storeId,
  onSuccess,
}: {
  storeId: string;
  onSuccess: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mengirim store_id sesuai dokumen poin 3A
      await createCategory({ store_id: storeId, name });
      toast.success("Kategori berhasil ditambahkan dan dicatat di log");
      setIsOpen(false);
      setName("");
      onSuccess();
    } catch (err: any) {
      toast.error("Gagal menambah kategori");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 h-11 shadow-lg shadow-emerald-100"
      >
        <Plus size={18} /> Tambah Kategori
      </Button>
      <DialogContent className="rounded-[24px] border-none p-0 overflow-hidden bg-white shadow-2xl">
        <div className="bg-emerald-600 p-6 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <FolderPlus size={24} />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            Kategori Baru
          </DialogTitle>
          <DialogDescription className="text-emerald-100 text-sm mt-1">
            Gunakan kategori untuk memisahkan stok barang dagangan.
          </DialogDescription>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Nama Kategori
            </label>
            <Input
              placeholder="Contoh: Sayur Segar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-12 border-slate-100 focus:ring-emerald-500"
              required
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12 font-bold transition-all"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
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
