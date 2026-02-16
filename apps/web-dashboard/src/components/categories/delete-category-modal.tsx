"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { deleteCategory } from "@/services/category-service";
import { toast } from "sonner";

interface DeleteProps {
  categoryId: number;
  categoryName: string;
  onSuccess: () => void;
}

export function DeleteCategoryDialog({
  categoryId,
  categoryName,
  onSuccess,
}: DeleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteCategory(categoryId);
      toast.success(res.message);
      onSuccess();
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menghapus kategori");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg h-9 w-9"
      >
        <Trash2 size={16} />
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="rounded-[24px] border-none p-6 shadow-2xl">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-slate-900">
              Hapus Kategori?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Apakah kamu yakin ingin menghapus kategori{" "}
              <span className="font-bold text-slate-900">"{categoryName}"</span>
              ? Tindakan ini tidak dapat dibatalkan dan mungkin mempengaruhi
              produk terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex gap-2">
            <AlertDialogCancel className="flex-1 rounded-xl h-12 border-slate-200 font-semibold">
              Batal
            </AlertDialogCancel>
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-red-100"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Ya, Hapus Sekarang"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
