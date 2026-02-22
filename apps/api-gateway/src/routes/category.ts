import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { sendResponse } from "../utils/response.js";

const categoryRoute = new Hono();

// menghubungkan ke supabase (createClient)
// tanda (!) diujung menandakan proses tidak dijalankan jika tidak ada key supabase url & anon key
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

// Get all API categories dan mengecek apakah udah login atau belom dengan fungsi "requireAuth"
categoryRoute.get("/", requireAuth, async (c) => {
  const storeId = c.req.query("store_id");
  const search = c.req.query("search") || "";
  const page = parseInt(c.req.query("page") || "1"); // default page nya 1
  const limit = parseInt(c.req.query("limit") || "10"); // default limit nya 10

  if (!storeId)
    return c.json(sendResponse("error", "Store ID wajib diisi"), 400);

  // logic, agar database hanya mengambil 10 data pertama
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("categories")
    .select("*", { count: "exact" }) // menghitung total seluruh kategori didatabase
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

  // logic, menangani error duplikasi nama kategori dengan kode postgress supabase: 23505
  if (error) {
    const message =
      error.code === "23505"
        ? "Nama kategori ini sudah terdaftar di toko Anda"
        : error.message;

    return c.json(sendResponse("error", message), 400);
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

  // logic update, ketika menginput nama kategori yang sama
  if (error) {
    const message =
      error.code === "23505"
        ? "Gagal update! Nama kategori tersebut sudah digunakan"
        : error.message;

    return c.json(sendResponse("error", message), 400);
  }

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
