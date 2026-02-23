import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { sendResponse } from "../utils/response.js";

const productRoute = new Hono();

// inisialisasi supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

// Get Products
productRoute.get("/", requireAuth, async (c) => {
  const storeId = c.req.query("store_id");
  const search = c.req.query("search") || "";
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "10");

  if (!storeId)
    return c.json(sendResponse("error", "Store ID wajib diisi"), 400);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Melakukan JOIN dengan tabel categories untuk mendapatkan nama kategori
  let query = supabase
    .from("products")
    .select("*, categories(name)", { count: "exact" })
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error, count } = await query;

  if (error) return c.json(sendResponse("error", error.message), 500);

  return c.json(
    sendResponse("success", "Daftar produk berhasil diambil", data, {
      total_data: count,
      current_page: page,
      total_pages: Math.ceil((count || 0) / limit),
    }),
    200,
  );
});

// Create Products
productRoute.post("/", requireAuth, async (c) => {
  try {
    const body = await c.req.json();

    // MENGAMBIL STORE_ID OTOMATIS DARI URL
    const store_id = c.req.query("store_id");

    const {
      name,
      price_sell,
      category_id,
      price_base,
      stock,
      unit,
      image_url,
    } = body;

    // Validasi data wajib
    if (!name || !store_id || !price_sell) {
      return c.json(
        sendResponse(
          "error",
          "Nama, Store ID (di URL), dan Harga Jual wajib tersedia",
        ),
        400,
      );
    }

    // Memasukkan data ke Database dengan menyisipkan store_id secara otomatis
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          store_id, // Disisipkan otomatis dari URL
          category_id,
          name,
          price_base: price_base || 0,
          price_sell,
          stock: stock || 0,
          unit: unit || "pcs",
          image_url,
          is_active: body.is_active ?? true,
        },
      ])
      .select()
      .single();

    if (error) {
      const message =
        error.code === "23505"
          ? "Produk dengan nama ini sudah ada di toko Anda"
          : error.message;
      return c.json(sendResponse("error", message), 400);
    }

    return c.json(
      sendResponse("success", "Produk PanganKU berhasil ditambahkan", data),
      201,
    );
  } catch (error) {
    return c.json(sendResponse("error", "Terjadi kesalahan pada server"), 500);
  }
});

// Update Products
productRoute.put("/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param("id");
    const store_id = c.req.query("store_id");
    const body = await c.req.json();

    if (!store_id) {
      return c.json(
        sendResponse("error", "Store ID wajib disertakan di URL"),
        400,
      );
    }

    // Update data dengan filter ganda: ID Produk DAN Store ID
    const { data, error } = await supabase
      .from("products")
      .update(body)
      .eq("id", id)
      .eq("store_id", store_id) // Kunci keamanan Multi-Tenant
      .select()
      .single();

    if (error) {
      // Handle jika data tidak ditemukan atau ada duplikasi nama
      const message =
        error.code === "PGRST116"
          ? "Produk tidak ditemukan atau Anda tidak memiliki akses"
          : error.message;
      return c.json(sendResponse("error", message), 400);
    }

    return c.json(
      sendResponse("success", "Produk PanganKU berhasil diperbarui", data),
      200,
    );
  } catch (error) {
    return c.json(sendResponse("error", "Terjadi kesalahan pada server"), 500);
  }
});

// Delete Products
productRoute.delete("/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return c.json(sendResponse("error", error.message), 400);

  return c.json(sendResponse("success", "Produk berhasil dihapus"), 200);
});

export default productRoute;
