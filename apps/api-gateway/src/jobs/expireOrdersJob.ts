import { orderRepository } from "../repositories/orderRepository.js";
import { supabase } from "../config/supabase.js";

/**
 * Auto-Expire Orders Job
 *
 * Berjalan setiap 5 menit untuk:
 * 1. Cari pesanan dengan status "pending" yang sudah melewati expires_at
 * 2. Kembalikan stok produk ke kondisi semula
 * 3. Update status pesanan menjadi "expired"
 */
async function processExpiredOrders() {
  try {
    const { data: expiredOrders, error } =
      await orderRepository.findExpiredOrders();

    if (error) {
      console.error("[ExpireJob] Gagal ambil data expired orders:", error.message);
      return;
    }

    if (!expiredOrders || expiredOrders.length === 0) {
      return; // Tidak ada yang expired
    }

    console.log(`[ExpireJob] Ditemukan ${expiredOrders.length} pesanan kadaluarsa`);

    for (const order of expiredOrders) {
      try {
        // 1. Kembalikan stok setiap item
        if (order.order_items && order.order_items.length > 0) {
          for (const item of order.order_items as any[]) {
            if (item.product_id && item.quantity) {
              const { error: stockError } = await orderRepository.restoreStock(
                item.product_id,
                order.store_id,
                item.quantity,
              );
              if (stockError) {
                console.error(
                  `[ExpireJob] Gagal restore stok produk ${item.product_id}:`,
                  stockError.message,
                );
              }
            }
          }
        }

        // 2. Update status menjadi "expired"
        const { error: updateError } = await supabase
          .from("orders")
          .update({ status: "expired", updated_at: new Date().toISOString() })
          .eq("id", order.id);

        if (updateError) {
          console.error(
            `[ExpireJob] Gagal update status order ${order.id}:`,
            updateError.message,
          );
        } else {
          console.log(`[ExpireJob] Order ${order.id} berhasil di-expire, stok dikembalikan`);
        }
      } catch (err) {
        console.error(`[ExpireJob] Error processing order ${order.id}:`, err);
      }
    }
  } catch (err) {
    console.error("[ExpireJob] Unexpected error:", err);
  }
}

/**
 * Mulai background job
 * Jalankan sekali saat startup, lalu ulangi setiap 5 menit
 */
export function startExpireOrdersJob() {
  const INTERVAL_MS = 30 * 1000; // 30 detik (testing)

  // Jalankan sekali saat server start
  processExpiredOrders();

  // Lalu ulangi setiap 5 menit
  setInterval(processExpiredOrders, INTERVAL_MS);

  console.log("[ExpireJob] Auto-expire orders job started (interval: 5 menit)");
}
