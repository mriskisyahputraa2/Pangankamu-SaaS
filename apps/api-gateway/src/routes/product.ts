import { Hono } from "hono";
import { productService } from "../services/productService.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { sendResponse } from "../utils/response.js";

const productRoute = new Hono();

// GET ALL
productRoute.get("/", requireAuth, async (c) => {
  try {
    const storeId = c.get("store_id");

    if (!storeId) {
      return c.json(sendResponse("error", "Store ID tidak ditemukan"), 401);
    }

    const result = await productService.getProducts(storeId, c.req.query());

    return c.json(
      sendResponse(
        "success",
        "Berhasil mengambil produk",
        result.data,
        result.meta,
      ),
      200,
    );
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 500);
  }
});

// POST
productRoute.post("/", requireAuth, async (c) => {
  try {
    const storeId = c.get("store_id");
    if (!storeId) return c.json(sendResponse("error", "Sesi tidak valid"), 401);

    const body = await c.req.json();
    const { name, category_id, price_base, price_sell, stock, unit } = body;

    const productData = {
      store_id: storeId,
      category_id,
      name,
      price_base: price_base || 0,
      price_sell,
      stock: stock || 0,
      unit: unit || "pcs",
    };

    const data = await productService.createProduct(productData);
    return c.json(sendResponse("success", "Produk berhasil dibuat", data), 201);
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 400);
  }
});

// PUT
productRoute.put("/:id", requireAuth, async (c) => {
  try {
    const storeId = c.get("store_id");
    if (!storeId) return c.json(sendResponse("error", "Akses ditolak"), 401);

    const id = c.req.param("id");
    const body = await c.req.json();

    const data = await productService.updateProduct(id, storeId, body);
    return c.json(sendResponse("success", "Produk diperbarui", data), 200);
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 400);
  }
});

// DELETE
productRoute.delete("/:id", requireAuth, async (c) => {
  try {
    const storeId = c.get("store_id");
    if (!storeId) return c.json(sendResponse("error", "Akses ditolak"), 401);

    const id = c.req.param("id");
    await productService.deleteProduct(id, storeId);
    return c.json(sendResponse("success", "Produk dihapus"), 200);
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 500);
  }
});

export default productRoute;
