import { orderRepository } from "../repositories/orderRepository.js";
import { productRepository } from "../repositories/productRepository.js";
import { supabase } from "../config/supabase.js";

export const orderService = {
  /**
   * Ambil semua pesanan milik toko
   */
  async getOrders(storeId: string, query: any) {
    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "10");
    const status = query.status || undefined;

    const { data, error, count } = await orderRepository.getAll(
      storeId,
      page,
      limit,
      status,
    );

    if (error) throw new Error(error.message);

    return {
      data: data || [],
      meta: {
        total_data: count || 0,
        current_page: page,
        row_per_page: limit,
        total_pages: Math.ceil((count || 0) / limit),
      },
    };
  },

  /**
   * Ambil detail 1 pesanan
   */
  async getOrderById(orderId: string, storeId: string) {
    const { data, error } = await orderRepository.findById(orderId, storeId);
    if (error || !data) throw new Error("Pesanan tidak ditemukan");
    return data;
  },

  /**
   * Buat pesanan baru dengan soft-booking stok 30 menit
   */
  async createOrder(
    storeId: string,
    payload: {
      customer_name: string;
      customer_phone: string;
      items: { product_id: string; quantity: number }[];
    },
  ) {
    const { customer_name, customer_phone, items } = payload;

    // 1. Validasi input
    if (!customer_name || !customer_phone || !items?.length) {
      throw new Error("Nama customer, nomor WhatsApp, dan item wajib diisi");
    }

    // 2. Cek stok & ambil data produk untuk setiap item
    const orderItemsData = [];
    let totalAmount = 0;

    for (const item of items) {
      const { data: product, error: productError } =
        await productRepository.findById(item.product_id, storeId);

      if (productError || !product) {
        throw new Error(
          `Produk dengan ID ${item.product_id} tidak ditemukan`,
        );
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Stok produk "${product.name}" tidak cukup. Stok tersedia: ${product.stock}`,
        );
      }

      const subtotal = product.price_sell * item.quantity;
      totalAmount += subtotal;

      orderItemsData.push({
        product_id: item.product_id,
        product_name: product.name,
        price_base_snapshot: product.price_base,
        price_sell_snapshot: product.price_sell,
        quantity: item.quantity,
        subtotal,
      });
    }

    // 3. Buat pesanan dengan expires_at = 30 menit dari sekarang
    // const expiresAt = new Date(Date.now() + 1 * 60 * 1000).toISOString(); // 1 menit (testing)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const { data: order, error: orderError } = await orderRepository.create({
      store_id: storeId,
      customer_name,
      customer_phone,
      total_amount: totalAmount,
      expires_at: expiresAt,
    });

    if (orderError || !order) {
      throw new Error("Gagal membuat pesanan: " + orderError?.message);
    }

    // 4. Buat order_items dengan snapshot harga
    const itemsWithOrderId = orderItemsData.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } =
      await orderRepository.createItems(itemsWithOrderId);

    if (itemsError) {
      throw new Error("Gagal menyimpan item pesanan: " + itemsError.message);
    }

    // 5. Kurangi stok produk (soft-booking)
    for (const item of items) {
      const { error: stockError } = await orderRepository.decreaseStock(
        item.product_id,
        storeId,
        item.quantity,
      );

      if (stockError) {
        throw new Error("Gagal mengunci stok: " + stockError.message);
      }
    }

    // 6. Return pesanan lengkap
    const { data: fullOrder } = await orderRepository.findById(
      order.id,
      storeId,
    );
    return fullOrder;
  },

  /**
   * Update status pesanan (paid, cancelled)
   */
  async updateOrderStatus(
    orderId: string,
    storeId: string,
    newStatus: string,
  ) {
    const allowedStatus = ["paid", "cancelled"];
    if (!allowedStatus.includes(newStatus)) {
      throw new Error(
        `Status tidak valid. Gunakan: ${allowedStatus.join(", ")}`,
      );
    }

    // Cek pesanan ada
    const { data: existingOrder } = await orderRepository.findById(
      orderId,
      storeId,
    );
    if (!existingOrder) throw new Error("Pesanan tidak ditemukan");

    if (existingOrder.status !== "pending") {
      throw new Error(
        `Pesanan sudah berstatus "${existingOrder.status}", tidak bisa diubah`,
      );
    }

    // Jika dibatalkan → kembalikan stok
    if (newStatus === "cancelled" && existingOrder.order_items) {
      for (const item of existingOrder.order_items as any[]) {
        if (item.product_id) {
          await orderRepository.restoreStock(
            item.product_id,
            storeId,
            item.quantity,
          );
        }
      }
    }

    const extraData =
      newStatus === "paid" ? { paid_at: new Date().toISOString() } : {};

    const { data, error } = await orderRepository.updateStatus(
      orderId,
      storeId,
      newStatus,
      extraData,
    );

    if (error) throw new Error("Gagal update status: " + error.message);
    return data;
  },

  /**
   * Soft delete pesanan
   */
  async deleteOrder(orderId: string, storeId: string) {
    const { data: existingOrder } = await orderRepository.findById(
      orderId,
      storeId,
    );
    if (!existingOrder) throw new Error("Pesanan tidak ditemukan");

    const { error } = await orderRepository.softDelete(orderId, storeId);
    if (error) throw new Error("Gagal menghapus pesanan: " + error.message);

    return { success: true };
  },
};
