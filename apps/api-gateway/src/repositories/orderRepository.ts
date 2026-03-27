import { supabase } from "../config/supabase.js";

export const orderRepository = {
  /**
   * Ambil semua pesanan milik toko dengan pagination
   */
  async getAll(
    storeId: string,
    page: number,
    limit: number,
    status?: string,
  ) {
    const offset = (page - 1) * limit;

    let query = supabase
      .from("orders")
      .select(
        `*, order_items (
          id,
          product_name,
          price_base_snapshot,
          price_sell_snapshot,
          quantity,
          subtotal
        )`,
        { count: "exact" },
      )
      .eq("store_id", storeId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query.range(
      offset,
      offset + limit - 1,
    );

    return { data, error, count };
  },

  /**
   * Ambil 1 pesanan berdasarkan ID
   */
  async findById(orderId: string, storeId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `*, order_items (
          id,
          product_id,
          product_name,
          price_base_snapshot,
          price_sell_snapshot,
          quantity,
          subtotal
        )`,
      )
      .eq("id", orderId)
      .eq("store_id", storeId)
      .is("deleted_at", null)
      .single();

    return { data, error };
  },

  /**
   * Buat pesanan baru
   */
  async create(orderData: {
    store_id: string;
    customer_name: string;
    customer_phone: string;
    total_amount: number;
    expires_at: string;
  }) {
    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    return { data, error };
  },

  /**
   * Buat item-item pesanan sekaligus
   */
  async createItems(
    items: {
      order_id: string;
      product_id: string;
      product_name: string;
      price_base_snapshot: number;
      price_sell_snapshot: number;
      quantity: number;
      subtotal: number;
    }[],
  ) {
    const { data, error } = await supabase
      .from("order_items")
      .insert(items)
      .select();

    return { data, error };
  },

  /**
   * Update status pesanan
   */
  async updateStatus(
    orderId: string,
    storeId: string,
    status: string,
    extraData?: { paid_at?: string; payment_method?: string },
  ) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status, ...extraData })
      .eq("id", orderId)
      .eq("store_id", storeId)
      .select()
      .single();

    return { data, error };
  },

  /**
   * Kurangi stok produk setelah pesanan dibuat (soft-booking)
   */
  async decreaseStock(productId: string, storeId: string, qty: number) {
    const { data, error } = await supabase.rpc("decrease_product_stock", {
      p_product_id: productId,
      p_store_id: storeId,
      p_qty: qty,
    });

    return { data, error };
  },

  /**
   * Kembalikan stok produk jika pesanan expired/dibatalkan
   */
  async restoreStock(productId: string, storeId: string, qty: number) {
    const { data, error } = await supabase.rpc("restore_product_stock", {
      p_product_id: productId,
      p_store_id: storeId,
      p_qty: qty,
    });

    return { data, error };
  },

  /**
   * Soft delete pesanan
   */
  async softDelete(orderId: string, storeId: string) {
    const { error } = await supabase
      .from("orders")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", orderId)
      .eq("store_id", storeId);

    return { error };
  },

  /**
   * Cari pesanan yang expired (untuk auto-rollback stok)
   */
  async findExpiredOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select(`*, order_items (product_id, quantity)`)
      .eq("status", "pending")
      .lt("expires_at", new Date().toISOString())
      .is("deleted_at", null);

    return { data, error };
  },
};
