"use client";

import { useState, useEffect } from "react";
import { categoryService } from "@/services/category-service";
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
import { Category } from "@/types";

interface EditProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCategoryModal({
  category,
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
    if (!name.trim()) {
      toast.error("Nama kategori tidak boleh kosong");
      return;
    }

    if (name.trim() === category.name) {
      toast.info("Tidak ada perubahan yang dibuat");
      onClose();
      return;
    }

    setLoading(true);
    try {
      await categoryService.updateCategory(category.id, name.trim());

      toast.success("Kategori berhasil diperbarui!");
      onClose();
      onSuccess();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Gagal memperbarui kategori");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setName(category?.name || "");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Kategori</DialogTitle>
          <DialogDescription>
            Perbarui nama kategori "{category?.name}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kategori..."
              disabled={loading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={
                loading || !name.trim() || name.trim() === category?.name
              }
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
