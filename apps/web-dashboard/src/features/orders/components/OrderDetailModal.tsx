"use client";

import { Order } from "../types/order.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";

// Komponen countdown timer
function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [remaining, setRemaining] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("Kadaluarsa");
        return;
      }
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setIsUrgent(minutes < 5);
      setRemaining(`${minutes}m ${seconds.toString().padStart(2, "0")}s`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <span
      className={`font-mono font-bold text-sm ${
        isUrgent ? "text-red-600 animate-pulse" : "text-yellow-600"
      }`}
    >
      ⏱ {remaining}
    </span>
  );
}

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

const formatCurrency = (amount: number) =>
  `Rp ${amount.toLocaleString("id-ID")}`;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  const profit =
    order.order_items?.reduce((acc, item) => {
      return (
        acc +
        (Number(item.price_sell_snapshot) - Number(item.price_base_snapshot)) *
          Number(item.quantity)
      );
    }, 0) ?? 0;

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-800">Detail Pesanan</DialogTitle>
        </DialogHeader>

        {/* Info Customer */}
        <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">ID Pesanan</span>
            <span className="font-mono text-xs text-slate-600 truncate max-w-[180px]">
              {order.id}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Customer</span>
            <span className="font-semibold text-slate-800">
              {order.customer_name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">WhatsApp</span>
            <span className="text-slate-700">{order.customer_phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                order.status === "paid"
                  ? "bg-emerald-100 text-emerald-700"
                  : order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-slate-100 text-slate-600"
              }`}
            >
              {order.status === "paid"
                ? "Lunas"
                : order.status === "pending"
                  ? "Menunggu"
                  : order.status === "cancelled"
                    ? "Dibatalkan"
                    : "Kadaluarsa"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tanggal</span>
            <span className="text-slate-700">
              {formatDate(order.created_at)}
            </span>
          </div>
          {order.paid_at && (
            <div className="flex justify-between">
              <span className="text-slate-500">Dibayar</span>
              <span className="text-emerald-600">
                {formatDate(order.paid_at)}
              </span>
            </div>
          )}
          {order.expires_at && (order.status === "pending" || order.status === "expired") && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">
                {order.status === "expired" ? "Kadaluarsa pada" : "Batas waktu bayar"}
              </span>
              <div className="text-right">
                <span className={order.status === "expired" ? "text-red-500 text-sm" : "text-yellow-600 text-sm"}>
                  {formatDate(order.expires_at)}
                </span>
                {order.status === "pending" && (
                  <div className="mt-0.5">
                    <CountdownTimer expiresAt={order.expires_at} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Item Pesanan */}
        {order.order_items && order.order_items.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">
              Item Pesanan
            </p>
            <div className="space-y-2">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white border border-slate-100 rounded-lg px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {item.product_name}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {formatCurrency(item.price_sell_snapshot)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      {formatCurrency(item.subtotal)}
                    </p>
                    {order.status === "paid" || order.status === "pending" ? (
                      <p className="text-emerald-600 text-xs">
                        +{formatCurrency((Number(item.price_sell_snapshot) - Number(item.price_base_snapshot)) * Number(item.quantity))} profit
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ringkasan */}
        <div className="border-t border-slate-100 pt-3 space-y-2 text-sm">
          <div className="flex justify-between font-semibold text-slate-800">
            <span>Total Pembayaran</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
          {(order.status === "paid" || order.status === "pending") && (
            <div className="flex justify-between text-emerald-600">
              <span>
                {order.status === "paid" ? "Profit" : "Estimasi Profit"}
              </span>
              <span className="font-semibold">+{formatCurrency(profit)}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
