import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { sendResponse } from "../utils/response.js";

const productRoute = new Hono();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

/**
 * 1. GET ALL PRODUCTS (Berdasarkan Store ID)
 * Dilengkapi fitur Search & Pagination
 */
productRoute.get("/", requireAuth, async (c) => {
  try {
    const store_id = c.req.query("store_id");
    const search = c.req.query("search");
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");

    if (!store_id) {
      return c.json(
        sendResponse("error", "Store ID wajib disertakan di URL"),
        400,
      );
    }

    const offset = (page - 1) * limit;

    // Query dasar dengan Join ke tabel categories
    let query = supabase
      .from("products")
      .select(
        `
        *,
        categories (name)
      `,
        { count: "exact" },
      ) // Mengambil total data untuk pagination
      .eq("store_id", store_id);

    // Fitur Search (Opsional)
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Pagination
    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error.message);
      return c.json(
        sendResponse("error", "Gagal mengambil data dari database"),
        500,
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return c.json({
      status: "success",
      message: "Daftar produk berhasil dimuat",
      data: data,
      meta: {
        total_data: count,
        current_page: page,
        total_pages: totalPages,
      },
    });
  } catch (error: any) {
    console.error("Server Error:", error.message);
    return c.json(
      sendResponse("error", "Terjadi kesalahan internal server"),
      500,
    );
  }
});

/**
 * 2. CREATE PRODUCT
 * Price_base & Price_sell wajib untuk Intelligent ERP
 */
productRoute.post("/", requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const store_id = c.req.query("store_id");

    const { name, category_id, price_base, price_sell, stock, unit } = body;

    if (!name || !store_id || !price_sell) {
      return c.json(
        sendResponse("error", "Nama, Store ID, dan Harga Jual wajib diisi"),
        400,
      );
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          store_id,
          category_id,
          name,
          price_base: price_base || 0,
          price_sell,
          stock: stock || 0,
          unit: unit || "pcs",
          is_active: body.is_active ?? true,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "23505")
        return c.json(
          sendResponse("error", "Nama produk sudah ada di toko ini"),
          400,
        );
      throw error;
    }

    return c.json(
      sendResponse("success", "Produk berhasil ditambahkan", data),
      201,
    );
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 500);
  }
});

/**
 * 3. UPDATE PRODUCT
 */
productRoute.put("/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param("id");
    const store_id = c.req.query("store_id");
    const body = await c.req.json();

    const { data, error } = await supabase
      .from("products")
      .update(body)
      .eq("id", id)
      .eq("store_id", store_id)
      .select()
      .single();

    if (error) return c.json(sendResponse("error", error.message), 400);
    return c.json(sendResponse("success", "Produk berhasil diperbarui", data));
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 500);
  }
});

/**
 * 4. DELETE PRODUCT
 * Menghapus produk secara permanen dari inventory tenant
 */
productRoute.delete("/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param("id");
    const store_id = c.req.query("store_id"); // Validasi isolasi tenant

    if (!store_id) {
      return c.json(
        sendResponse(
          "error",
          "Store ID wajib disertakan untuk validasi keamanan",
        ),
        400,
      );
    }

    // Eksekusi penghapusan dengan filter ganda (ID Produk + ID Toko)
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("store_id", store_id);

    if (error) {
      console.error("Delete Error:", error.message);
      return c.json(
        sendResponse("error", "Gagal menghapus produk: " + error.message),
        400,
      );
    }

    return c.json(
      sendResponse("success", "Produk PanganKU berhasil dihapus dari sistem"),
      200,
    );
  } catch (error: any) {
    console.error("Server Error on Delete:", error.message);
    return c.json(
      sendResponse("error", "Terjadi kesalahan internal saat menghapus data"),
      500,
    );
  }
});

export default productRoute;
