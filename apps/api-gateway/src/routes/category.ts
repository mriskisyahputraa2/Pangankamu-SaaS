import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { sendResponse } from "../utils/response.js";

const categoryRoute = new Hono();

//  supabase
// tanda (!) diujung menandakan proses tidak dijalankan jika tidak ada key supabase url & anon key
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

// Get all API categories dan mengecek apakah udah login atau belom dengan fungsi "requireAuth"
categoryRoute.get("/", requireAuth, async (c) => {
  const storeId = c.req.query("store_id");
  const search = c.req.query("search") || "";
  const page = parseInt(c.req.query("page") || "");
  const limit = parseInt(c.req.query("limit") || "");

  if (!storeId)
    return c.json(sendResponse("error", "Store ID wajib diisi"), 400);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("categories")
    .select("*", { count: "exact" })
    .eq("store_id", storeId)
    .range(from, to);

  if (search) query = query.ilike("name", `%${search}`);
  const { data, error, count } = await query;

  if (error) return c.json(sendResponse("error", error.message), 500);

  return c.json(
    sendResponse("success", "Kategori berhasil diambil", data, {
      total_data: count,
      current_page: page,
      row_per_page: limit,
      total_pages: Math.ceil((count || 0) / limit),
    }),
    200,
  );
});

// Create categories
categoryRoute.post("/", requireAuth, async (c) => {
  const { name, store_id } = await c.req.json();

  if (!name)
    return c.json(
      sendResponse("error", "Nama kategori tidak boleh kosong"),
      400,
    );

  const { data, error } = await supabase
    .from("categories")
    .insert([{ name, store_id }])
    .select()
    .single();

  if (error) {
    const message = error.message.includes("unique_category_per_store")
      ? "Nama kategori ini sudah ada di toko Anda"
      : error.message;

    return c.json(sendResponse("error", message), 500);
  }
  return c.json(sendResponse("success", "Kategori berhasil dibuat", data), 200);
});

// Update categories
categoryRoute.put("/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  const { name } = await c.req.json();

  if (!name)
    return c.json(sendResponse("error", "Nama Kategori baru wajib diisi"), 400);

  const { data, error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id)
    .select()
    .single();

  if (error) return c.json(sendResponse("error", error.message), 500);

  return c.json(
    sendResponse("success", "Kategori berhasil diperbaharui", data),
    200,
  );
});

// Delete categories
categoryRoute.delete("/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) return c.json(sendResponse("error", error.message), 500);

  return c.json(sendResponse("success", "Kategori berhasil dihapus"), 200);
});

export default categoryRoute;
