import { Hono } from "hono";
import { categoryService } from "../services/categoryService.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { sendResponse } from "../utils/response.js";

const categoryRoute = new Hono();

// GET ALL
categoryRoute.get("/", requireAuth, async (c) => {
  try {
    const storeId = c.get("store_id");

    if (!storeId) {
      return c.json(sendResponse("error", "Store ID tidak ditemukan"), 401);
    }

    const result = await categoryService.getCategories(storeId, c.req.query());

    return c.json(
      sendResponse(
        "success",
        "Berhasil mengambil kategori",
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
categoryRoute.post("/", requireAuth, async (c) => {
  try {
    const storeId = c.get("store_id");
    if (!storeId) return c.json(sendResponse("error", "Sesi tidak valid"), 401);

    const { name } = await c.req.json();
    if (!name)
      return c.json(sendResponse("error", "Nama kategori wajib diisi"), 400);

    const data = await categoryService.addCategory(name, storeId);
    return c.json(
      sendResponse("success", "Kategori berhasil dibuat", data),
      201,
    );
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 400);
  }
});

// PUT
categoryRoute.put("/:id", requireAuth, async (c) => {
  try {
    const storeId = c.get("store_id");
    if (!storeId) return c.json(sendResponse("error", "Akses ditolak"), 401);

    const id = c.req.param("id");
    const { name } = await c.req.json();

    const data = await categoryService.updateCategory(id, name, storeId);
    return c.json(sendResponse("success", "Kategori diperbarui", data), 200);
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 400);
  }
});

// DELETE
categoryRoute.delete("/:id", requireAuth, async (c) => {
  try {
    const storeId = c.get("store_id");
    if (!storeId) return c.json(sendResponse("error", "Akses ditolak"), 401);

    const id = c.req.param("id");
    await categoryService.deleteCategory(id, storeId);
    return c.json(sendResponse("success", "Kategori dihapus"), 200);
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 500);
  }
});

export default categoryRoute;
