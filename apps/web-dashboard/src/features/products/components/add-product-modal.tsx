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
import { createProduct } from "../services/productService";
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

export function AddProductModal({
  onSuccess,
  activeStoreId,
}: {
  onSuccess: () => void;
  activeStoreId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
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
    if (isOpen) {
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
      fetchCategories();
    }
  }, [isOpen]);

  const handlePriceChange = (
    field: "price_base" | "price_sell",
    value: string,
  ) => {
    const numericValue = parseCurrency(value);
    const formattedValue = formatCurrency(numericValue);

    setFormData({ ...formData, [field]: numericValue });
    setDisplayValues({ ...displayValues, [field]: formattedValue });
  };

  const handleSave = async (e: React.FormEvent) => {
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

    setLoading(true);
    try {
      const payload = {
        ...formData,
        store_id: activeStoreId,
        price_base: Number(formData.price_base) || 0,
        price_sell: Number(formData.price_sell),
        stock: Number(formData.stock),
      };

      await createProduct(payload);
      toast.success("Produk berhasil ditambahkan!");
      handleClose();

      setTimeout(() => {
        onSuccess();
      }, 300);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Gagal menambah produk");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      name: "",
      category_id: "",
      price_base: "",
      price_sell: "",
      stock: "",
      unit: "pcs",
    });
    setDisplayValues({
      price_base: "",
      price_sell: "",
    });
    setLoading(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold w-full sm:w-auto text-sm"
        size="sm"
      >
        <span className="hidden sm:inline">Tambah Produk</span>
        <span className="sm:hidden">+ Produk</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Tambah Produk Baru</DialogTitle>
            <DialogDescription className="text-sm">
              Masukkan detail produk yang ingin ditambahkan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Input
                placeholder="Nama produk..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={loading}
                className="h-11"
              />
            </div>

            <div>
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  placeholder="Harga modal (Rp)"
                  value={displayValues.price_base}
                  onChange={(e) =>
                    handlePriceChange("price_base", e.target.value)
                  }
                  disabled={loading}
                  className="h-11"
                />
              </div>
              <div>
                <Input
                  placeholder="Harga jual (Rp)"
                  value={displayValues.price_sell}
                  onChange={(e) =>
                    handlePriceChange("price_sell", e.target.value)
                  }
                  disabled={loading}
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
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
              </div>
              <div>
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
    </>
  );
}
