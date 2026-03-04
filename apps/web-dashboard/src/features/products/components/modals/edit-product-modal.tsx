"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Loader2 } from "lucide-react";
import { updateProduct } from "../../services/productService";
import { categoryService } from "@/features/categories";
import { getErrorMessage } from "@/utils/error-handler";
import { toast } from "sonner";

// Format currency function
const formatCurrency = (value: string) => {
  const number = value.replace(/[^0-9]/g, "");
  return new Intl.NumberFormat("id-ID").format(Number(number));
};

// Parse currency to number
const parseCurrency = (value: string) => {
  return value.replace(/[^0-9]/g, "");
};

interface EditProductModalProps {
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
}: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price_base: "",
    price_sell: "",
    stock: "",
    unit: "pcs",
  });

  // Format display values for currency inputs
  const [displayValues, setDisplayValues] = useState({
    price_base: "",
    price_sell: "",
  });

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || "",
        category_id: product.category_id || "",
        price_base: product.price_base?.toString() || "",
        price_sell: product.price_sell?.toString() || "",
        stock: product.stock?.toString() || "",
        unit: product.unit || "pcs",
      });

      setDisplayValues({
        price_base: product.price_base
          ? formatCurrency(product.price_base.toString())
          : "",
        price_sell: product.price_sell
          ? formatCurrency(product.price_sell.toString())
          : "",
      });

      fetchCategories();
    }
  }, [product, isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories(1, 100, "");
      if (res.status === "success") {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handlePriceChange = (
    field: "price_base" | "price_sell",
    value: string,
  ) => {
    const numericValue = parseCurrency(value);
    const formattedValue = formatCurrency(numericValue);

    setFormData({ ...formData, [field]: numericValue });
    setDisplayValues({ ...displayValues, [field]: formattedValue });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Nama produk tidak boleh kosong");
      return;
    }

    if (!formData.price_sell || Number(formData.price_sell) <= 0) {
      toast.error("Harga jual harus diisi dan lebih dari 0");
      return;
    }

    if (!formData.stock || Number(formData.stock) < 0) {
      toast.error("Stok harus diisi dan tidak boleh negatif");
      return;
    }

    // Check if there are any changes
    const hasChanges =
      formData.name !== product.name ||
      formData.category_id !== product.category_id ||
      Number(formData.price_base) !== (product.price_base || 0) ||
      Number(formData.price_sell) !== product.price_sell ||
      Number(formData.stock) !== product.stock ||
      formData.unit !== product.unit;

    if (!hasChanges) {
      toast.info("Tidak ada perubahan yang dibuat");
      onClose();
      return;
    }

    // Get store ID
    const storeId = localStorage.getItem("storeId");
    if (!storeId) {
      toast.error("Store ID tidak ditemukan");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        store_id: storeId,
        name: formData.name.trim(),
        category_id: formData.category_id,
        price_base: Number(formData.price_base) || 0,
        price_sell: Number(formData.price_sell),
        stock: Number(formData.stock),
        unit: formData.unit,
      };

      await updateProduct(product.id, payload);
      toast.success("Produk berhasil diperbarui!");
      onClose();
      onSuccess();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Gagal memperbarui produk");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form to original product data
    if (product) {
      setFormData({
        name: product.name || "",
        category_id: product.category_id || "",
        price_base: product.price_base?.toString() || "",
        price_sell: product.price_sell?.toString() || "",
        stock: product.stock?.toString() || "",
        unit: product.unit || "pcs",
      });

      setDisplayValues({
        price_base: product.price_base
          ? formatCurrency(product.price_base.toString())
          : "",
        price_sell: product.price_sell
          ? formatCurrency(product.price_sell.toString())
          : "",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Produk</DialogTitle>
          <DialogDescription className="text-sm">
            Perbarui detail produk "{product?.name}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            placeholder="Nama produk..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
            className="h-11"
          />

          <Select
            value={formData.category_id}
            onValueChange={(value) =>
              setFormData({ ...formData, category_id: value })
            }
            disabled={loading}
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Harga modal (Rp)"
              value={displayValues.price_base}
              onChange={(e) => handlePriceChange("price_base", e.target.value)}
              disabled={loading}
              className="h-11"
            />
            <Input
              placeholder="Harga jual (Rp)"
              value={displayValues.price_sell}
              onChange={(e) => handlePriceChange("price_sell", e.target.value)}
              disabled={loading}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Stok"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              disabled={loading}
              className="h-11"
              min="0"
            />
            <Select
              value={formData.unit}
              onValueChange={(value) =>
                setFormData({ ...formData, unit: value })
              }
              disabled={loading}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pcs">Pcs</SelectItem>
                <SelectItem value="kg">Kg</SelectItem>
                <SelectItem value="gram">Gram</SelectItem>
                <SelectItem value="liter">Liter</SelectItem>
                <SelectItem value="ml">ML</SelectItem>
                <SelectItem value="pack">Pack</SelectItem>
              </SelectContent>
            </Select>
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
              disabled={
                loading ||
                !formData.name.trim() ||
                !formData.price_sell ||
                !formData.stock
              }
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold w-full sm:w-auto"
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
