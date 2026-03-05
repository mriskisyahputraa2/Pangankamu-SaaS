import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { DeleteProductDialog } from "./modals/delete-product-modal";

interface ProductTableProps {
  products: any[];
  categories: any[];
  loading: boolean;
  currentPage: number;
  limit: number;
  storeId: string;
  onEdit: (product: any) => void;
  onRefresh: () => void;
}

export function ProductTable({
  products,
  categories,
  loading,
  currentPage,
  limit,
  storeId,
  onEdit,
  onRefresh,
}: ProductTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Loading Table - Responsive dengan scroll horizontal */}
        <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="text-[11px] uppercase font-bold text-slate-500">
                  <TableHead className="text-center w-16 min-w-12">
                    No
                  </TableHead>
                  <TableHead className="min-w-36">Produk</TableHead>
                  <TableHead className="min-w-30">Kategori</TableHead>
                  <TableHead className="text-right min-w-30">
                    Harga Modal
                  </TableHead>
                  <TableHead className="text-right min-w-30">
                    Harga Jual
                  </TableHead>
                  <TableHead className="text-center min-w-24">Stok</TableHead>
                  <TableHead className="text-center min-w-20">Unit</TableHead>
                  <TableHead className="text-center min-w-24">Status</TableHead>
                  <TableHead className="text-center min-w-24">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: parseInt(limit.toString()) }).map(
                  (_, index) => (
                    <TableRow key={index} className="border-slate-100">
                      <TableCell className="text-center">
                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <div className="h-6 w-6 bg-slate-200 rounded animate-pulse"></div>
                          <div className="h-6 w-6 bg-slate-200 rounded animate-pulse"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="space-y-4">
        {/* Empty State Table */}
        <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="text-[11px] uppercase font-bold text-slate-500">
                  <TableHead className="text-center w-16 min-w-12">
                    No
                  </TableHead>
                  <TableHead className="min-w-36">Produk</TableHead>
                  <TableHead className="min-w-30">Kategori</TableHead>
                  <TableHead className="text-right min-w-30">
                    Harga Modal
                  </TableHead>
                  <TableHead className="text-right min-w-30">
                    Harga Jual
                  </TableHead>
                  <TableHead className="text-center min-w-24">Stok</TableHead>
                  <TableHead className="text-center min-w-20">Unit</TableHead>
                  <TableHead className="text-center min-w-24">Status</TableHead>
                  <TableHead className="text-center min-w-24">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        📦
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">
                          Belum ada produk
                        </p>
                        <p className="text-slate-400 text-sm">
                          Tambahkan produk pertama Anda
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table dengan scroll horizontal untuk semua ukuran screen */}
      <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="text-[11px] uppercase font-bold text-slate-500">
                <TableHead className="text-center w-16 min-w-12">No</TableHead>
                <TableHead className="min-w-36">Produk</TableHead>
                <TableHead className="min-w-30">Kategori</TableHead>
                <TableHead className="text-right min-w-30">
                  Harga Modal
                </TableHead>
                <TableHead className="text-right min-w-30">
                  Harga Jual
                </TableHead>
                <TableHead className="text-center min-w-24">Stok</TableHead>
                <TableHead className="text-center min-w-20">Unit</TableHead>
                <TableHead className="text-center min-w-24">Status</TableHead>
                <TableHead className="text-center min-w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="border-slate-100 hover:bg-slate-50/50"
                >
                  <TableCell className="text-center font-medium text-slate-600">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>

                  <TableCell className="font-medium">
                    <span className="font-semibold text-slate-900 text-sm">
                      {item.name}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      {item.categories?.name || "Umum"}
                    </span>
                  </TableCell>

                  <TableCell className="text-right font-medium text-slate-600">
                    Rp {item.price_base?.toLocaleString("id-ID") || "0"}
                  </TableCell>

                  <TableCell className="text-right font-medium text-emerald-600">
                    Rp {item.price_sell?.toLocaleString("id-ID") || "0"}
                  </TableCell>

                  <TableCell className="text-center">
                    <span
                      className={`font-semibold ${
                        item.stock < 10 ? "text-red-600" : "text-slate-700"
                      }`}
                    >
                      {item.stock}
                    </span>
                  </TableCell>

                  <TableCell className="text-center font-medium text-slate-600">
                    {item.unit}
                  </TableCell>

                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.stock < 10
                          ? "bg-red-100 text-red-700"
                          : item.stock < 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {item.stock < 10
                        ? "Stok Rendah"
                        : item.stock < 50
                          ? "Stok Sedang"
                          : "Stok Aman"}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-200 h-8 w-8"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <DeleteProductDialog
                        productId={item.id}
                        productName={item.name}
                        storeId={storeId}
                        onSuccess={onRefresh}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
