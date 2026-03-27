"use client";

import { useOrderData } from "@/features/orders/hooks/useOrderData";
import { OrderTable } from "@/features/orders/components/OrderTable";
import { OrderFilters } from "@/features/orders/components/OrderFilters";
import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  const {
    orders,
    loading,
    currentPage,
    setCurrentPage,
    limit,
    totalData,
    totalPages,
    statusFilter,
    updatingId,
    handleStatusUpdate,
    handleFilterChange,
  } = useOrderData();

  return (
    <div className="w-full space-y-4 md:space-y-6 font-jakarta px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            Manajemen Pesanan
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Kelola pesanan masuk dan update status pembayaran
          </p>
        </div>

        {/* Stats badge */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shrink-0">
          <ShoppingCart size={16} className="text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">
            {totalData}
          </span>
          <span className="text-sm text-slate-500">Total Pesanan</span>
        </div>
      </div>

      {/* Filter Status */}
      <OrderFilters
        statusFilter={statusFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Tabel Pesanan */}
      <OrderTable
        orders={orders}
        loading={loading}
        currentPage={currentPage}
        limit={limit}
        updatingId={updatingId}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Menampilkan {orders.length} dari {totalData} pesanan
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1 bg-slate-800 text-white rounded-lg">
              {currentPage}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
