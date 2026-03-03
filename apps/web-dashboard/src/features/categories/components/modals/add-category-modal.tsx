"use client";

import { useState } from "react";
import { categoryService } from "../../services/categoryService";
import { getErrorMessage } from "@/utils/error-handler";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AddCategoryModal({ onSuccess }: { onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama kategori tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      await categoryService.createCategory({ name: name.trim() });

      toast.success("Kategori berhasil ditambahkan!");
      setIsOpen(false);
      setName("");

      setTimeout(() => {
        onSuccess();
      }, 300);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Gagal menambah kategori");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setName("");
    setLoading(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold w-full sm:w-auto text-sm"
        size="sm"
      >
        <span className="hidden sm:inline">Tambah Kategori</span>
        <span className="sm:hidden">+ Kategori</span>
      </Button>{" "}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Tambah Kategori Baru</DialogTitle>
            <DialogDescription className="text-sm">
              Masukkan nama kategori yang ingin ditambahkan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kategori..."
                disabled={loading}
                className="h-11"
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading || !name.trim()}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold w-full sm:w-auto"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
