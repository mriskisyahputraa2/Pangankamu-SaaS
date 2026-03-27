"use client";

import { Order, OrderStatus } from "../types/order.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { OrderDetailModal } from "./OrderDetailModal";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Menunggu",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  paid: {
    label: "Lunas",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  expired: {
    label: "Kadaluarsa",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  currentPage: number;
  limit: number;
  updatingId: string | null;
  onStatusUpdate: (id: string, status: "paid" | "cancelled") => void;
}

export function OrderTable({
  orders,
  loading,
  currentPage,
  limit,
  updatingId,
  onStatusUpdate,
}: OrderTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatCurrency = (amount: number) =>
    `Rp ${amount.toLocaleString("id-ID")}`;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="text-[11px] uppercase font-bold text-slate-500">
                <TableHead className="text-center w-12">No</TableHead>
                <TableHead className="min-w-36">Customer</TableHead>
                <TableHead className="min-w-28">No. WhatsApp</TableHead>
                <TableHead className="min-w-24 text-right">Total</TableHead>
                <TableHead className="text-center min-w-24">Status</TableHead>
                <TableHead className="min-w-32">Waktu</TableHead>
                <TableHead className="text-center min-w-28">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-slate-100">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-slate-200 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="text-[11px] uppercase font-bold text-slate-500">
                <TableHead className="text-center w-12">No</TableHead>
                <TableHead className="min-w-36">Customer</TableHead>
                <TableHead className="min-w-28">No. WhatsApp</TableHead>
                <TableHead className="min-w-24 text-right">Total</TableHead>
                <TableHead className="text-center min-w-24">Status</TableHead>
                <TableHead className="min-w-32">Waktu</TableHead>
                <TableHead className="text-center min-w-28">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl">
                      🛒
                    </div>
                    <p className="text-slate-500 font-medium">
                      Belum ada pesanan
                    </p>
                    <p className="text-slate-400 text-sm">
                      Pesanan baru akan muncul di sini
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="text-[11px] uppercase font-bold text-slate-500">
                <TableHead className="text-center w-12">No</TableHead>
                <TableHead className="min-w-36">Customer</TableHead>
                <TableHead className="min-w-28">No. WhatsApp</TableHead>
                <TableHead className="min-w-24 text-right">Total</TableHead>
                <TableHead className="text-center min-w-24">Status</TableHead>
                <TableHead className="min-w-32">Waktu</TableHead>
                <TableHead className="text-center min-w-28">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => {
                const statusCfg = STATUS_CONFIG[order.status];
                const isUpdating = updatingId === order.id;
                const isPending = order.status === "pending";

                return (
                  <TableRow
                    key={order.id}
                    className="border-slate-100 hover:bg-slate-50/50"
                  >
                    <TableCell className="text-center font-medium text-slate-600">
                      {(currentPage - 1) * limit + index + 1}
                    </TableCell>

                    <TableCell className="font-semibold text-slate-900 text-sm">
                      {order.customer_name}
                    </TableCell>

                    <TableCell className="text-slate-600 text-sm">
                      {order.customer_phone}
                    </TableCell>

                    <TableCell className="text-right font-semibold text-emerald-600">
                      {formatCurrency(order.total_amount)}
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusCfg.className}`}
                      >
                        {statusCfg.label}
                      </span>
                    </TableCell>

                    <TableCell className="text-slate-500 text-xs">
                      {formatDate(order.created_at)}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        {/* Detail */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-blue-50 hover:bg-blue-100 text-blue-600"
                          onClick={() => setSelectedOrder(order)}
                          title="Lihat detail"
                        >
                          <Eye size={14} />
                        </Button>

                        {/* Tandai Lunas */}
                        {isPending && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                            onClick={() => onStatusUpdate(order.id, "paid")}
                            disabled={isUpdating}
                            title="Tandai Lunas"
                          >
                            {isUpdating ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <CheckCircle size={14} />
                            )}
                          </Button>
                        )}

                        {/* Batalkan */}
                        {isPending && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-red-50 hover:bg-red-100 text-red-600"
                            onClick={() => onStatusUpdate(order.id, "cancelled")}
                            disabled={isUpdating}
                            title="Batalkan Pesanan"
                          >
                            <XCircle size={14} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
}
