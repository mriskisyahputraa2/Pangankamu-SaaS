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

// Mobile Card Component for better mobile experience
function ProductCard({
  product,
  index,
  currentPage,
  limit,
  storeId,
  onEdit,
  onRefresh,
}: {
  product: any;
  index: number;
  currentPage: number;
  limit: number;
  storeId: string;
  onEdit: (product: any) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">
              #{(currentPage - 1) * limit + index + 1}
            </span>
            <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold uppercase text-slate-600">
              {product.categories?.name || "Umum"}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-2">
            {product.name}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-xs text-slate-500">Harga Jual</span>
              <p className="font-medium">
                Rp {Number(product.price_sell).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-500">Stok</span>
              <p
                className={`font-medium ${product.stock < 10 ? "text-red-600" : "text-emerald-600"}`}
              >
                {product.stock} {product.unit || "pcs"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
        <Button
          variant="ghost"
          size="sm"
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-200 h-8 px-3"
          onClick={() => onEdit(product)}
        >
          <Pencil size={14} className="mr-1" />
          Edit
        </Button>
        <DeleteProductDialog
          productId={product.id}
          productName={product.name}
          storeId={storeId}
          onSuccess={onRefresh}
        />
      </div>
    </div>
  );
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
        {/* Desktop Table Loading */}
        <div className="hidden md:block border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="text-[11px] uppercase font-bold text-slate-500">
                <TableHead className="text-center w-16">No</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Harga Jual</TableHead>
                <TableHead className="text-center">Stok</TableHead>
                <TableHead className="text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="h-60 text-center">
                  <Loader2 className="animate-spin inline text-emerald-500" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Mobile Loading */}
        <div className="md:hidden flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-emerald-500" size={32} />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="space-y-4">
        {/* Desktop Empty State */}
        <div className="hidden md:block border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="text-[11px] uppercase font-bold text-slate-500">
                <TableHead className="text-center w-16">No</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Harga Jual</TableHead>
                <TableHead className="text-center">Stok</TableHead>
                <TableHead className="text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-40 text-center text-slate-400 italic"
                >
                  Belum ada produk.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Mobile Empty State */}
        <div className="md:hidden bg-white border border-slate-100 rounded-xl p-8 text-center">
          <p className="text-slate-400 italic">Belum ada produk.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="text-[11px] uppercase font-bold text-slate-500">
              <TableHead className="text-center w-16">No</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Harga Jual</TableHead>
              <TableHead className="text-center">Stok</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((item, index) => (
              <TableRow key={item.id} className="text-sm">
                <TableCell className="text-center text-slate-400">
                  {(currentPage - 1) * limit + index + 1}
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  {item.name}
                </TableCell>
                <TableCell>
                  <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold uppercase">
                    {item.categories?.name || "Umum"}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  Rp {Number(item.price_sell).toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      item.stock < 10
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {item.stock}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-200"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil size={16} />
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {products.map((item, index) => (
          <ProductCard
            key={item.id}
            product={item}
            index={index}
            currentPage={currentPage}
            limit={limit}
            storeId={storeId}
            onEdit={onEdit}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    </div>
  );
}
