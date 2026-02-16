"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateCategory } from "@/services/category-service";
import { toast } from "sonner";

interface EditCategoryProps {
  category: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCategoryModal({
  category,
  isOpen,
  onClose,
  onSuccess,
}: EditCategoryProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (category) setName(category.name);
  }, [category]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateCategory(category.id, name);
      toast.success(res.message);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal update kategori");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Kategori</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">
              Nama Kategori
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-11"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-emerald-600 rounded-xl h-11 font-bold"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
