import { useState, useEffect, useCallback } from "react";
import { getOrders, updateOrderStatus } from "../services/orderService";
import { Order, OrderMeta, OrderStatus } from "../types/order.types";
import { toast } from "sonner";

export function useOrderData() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrders(currentPage, limit, statusFilter);
      if (res.status === "success") {
        setOrders(res.data || []);
        setTotalData(res.meta?.total_data || 0);
        setTotalPages(res.meta?.total_pages || 1);
      }
    } catch (err) {
      toast.error("Gagal memuat daftar pesanan");
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, statusFilter]);

  const handleStatusUpdate = useCallback(
    async (orderId: string, newStatus: "paid" | "cancelled") => {
      setUpdatingId(orderId);
      try {
        await updateOrderStatus(orderId, newStatus);
        toast.success(
          newStatus === "paid"
            ? "Pesanan berhasil ditandai lunas ✅"
            : "Pesanan berhasil dibatalkan",
        );
        fetchOrders();
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Gagal update status pesanan");
      } finally {
        setUpdatingId(null);
      }
    },
    [fetchOrders],
  );

  const handleFilterChange = useCallback((status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    currentPage,
    setCurrentPage,
    limit,
    totalData,
    totalPages,
    statusFilter,
    updatingId,
    fetchOrders,
    handleStatusUpdate,
    handleFilterChange,
  };
}
