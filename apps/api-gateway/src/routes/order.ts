import { Hono } from "hono";
import { orderService } from "../services/orderService.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { sendResponse } from "../utils/response.js";

const orderRoute = new Hono();

// ----------------------------
// GET /orders — Semua pesanan milik toko (dengan filter status & pagination)
// ----------------------------
orderRoute.get("/", requireAuth, async (c) => {
  try {
    const storeId = c.get("store_id");
    if (!storeId)
      return c.json(sendResponse("error", "Store ID tidak ditemukan"), 401);

    const result = await orderService.getOrders(storeId, c.req.query());

    return c.json(
      sendResponse("success", "Berhasil mengambil pesanan", result.data, result.meta),
      200,
    );
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 500);
  }
});

// ----------------------------
// GET /orders/:id — Detail 1 pesanan
// ----------------------------
orderRoute.get("/:id", requireAuth, async (c) => {
  try {
    const storeId = c.get("store_id");
    if (!storeId)
      return c.json(sendResponse("error", "Store ID tidak ditemukan"), 401);

    const id = c.req.param("id");
    const data = await orderService.getOrderById(id, storeId);

    return c.json(sendResponse("success", "Detail pesanan", data), 200);
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 404);
  }
});

// ----------------------------
// POST /orders — Buat pesanan baru (soft-booking stok 30 menit)
// Body: { customer_name, customer_phone, items: [{product_id, quantity}] }
// ----------------------------
orderRoute.post("/", requireAuth, async (c) => {
  try {
    const storeId = c.get("store_id");
    if (!storeId)
      return c.json(sendResponse("error", "Sesi tidak valid"), 401);

    const body = await c.req.json();
    const data = await orderService.createOrder(storeId, body);

    return c.json(
      sendResponse("success", "Pesanan berhasil dibuat", data),
      201,
    );
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 400);
  }
});

// ----------------------------
// PATCH /orders/:id/status — Update status pesanan
// Body: { status: "paid" | "cancelled" }
// ----------------------------
orderRoute.patch("/:id/status", requireAuth, async (c) => {
  try {
    const storeId = c.get("store_id");
    if (!storeId)
      return c.json(sendResponse("error", "Akses ditolak"), 401);

    const id = c.req.param("id");
    const { status } = await c.req.json();

    if (!status)
      return c.json(sendResponse("error", "Status wajib diisi"), 400);

    const data = await orderService.updateOrderStatus(id, storeId, status);

    return c.json(
      sendResponse("success", `Pesanan berhasil diupdate ke "${status}"`, data),
      200,
    );
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 400);
  }
});

// ----------------------------
// DELETE /orders/:id — Soft delete pesanan
// ----------------------------
orderRoute.delete("/:id", requireAuth, async (c) => {
  try {
    const storeId = c.get("store_id");
    if (!storeId)
      return c.json(sendResponse("error", "Akses ditolak"), 401);

    const id = c.req.param("id");
    await orderService.deleteOrder(id, storeId);

    return c.json(sendResponse("success", "Pesanan dihapus"), 200);
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 500);
  }
});

export default orderRoute;
