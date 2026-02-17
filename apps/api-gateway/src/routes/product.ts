import { Hono } from "hono";
import { supabase } from "../config/supabase.js";

const product = new Hono();

// 1. [READ] - Get All Products (Filtered by Store ID)
product.get("/", async (c) => {
  const store_id = c.req.query("store_id"); // Wajib untuk isolasi data SaaS
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "10");
  const search = c.req.query("search") || "";

  if (!store_id) {
    return c.json(
      { status: "error", message: "store_id diperlukan untuk keamanan SaaS" },
      400,
    );
  }

  const offset = (page - 1) * limit;

  // Query difilter berdasarkan store_id agar data tidak bocor antar tenant [cite: 85]
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("store_id", store_id);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error, count } = await query
    .order("name", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    return c.json({ status: "error", message: error.message }, 500);
  }

  return c.json({
    status: "success",
    data,
    total: count,
    page,
    limit,
  });
});

// 2. [CREATE] - Add Product with Profit Calculation Support
product.post("/", async (c) => {
  try {
    const body = await c.req.json();

    // Sesuai skema: memisahkan price_base (modal) dan price_sell (jual) [cite: 51, 52, 86]
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: body.name,
          store_id: body.store_id,
          category_id: body.category_id, // UUID relasi kategori
          price_base: Number(body.price_base), // Untuk hitung profit di masa depan
          price_sell: Number(body.price_sell),
          stock: Number(body.stock),
          unit: body.unit || "pcs",
          is_active: true,
        },
      ])
      .select();

    if (error) return c.json({ status: "error", message: error.message }, 500);

    // Logging ke system_logs (Black Box Pangankamu) [cite: 90]
    await supabase.from("system_logs").insert([
      {
        store_id: body.store_id,
        action: "CREATE_PRODUCT",
        severity: "info",
        message: `Produk baru ditambahkan: ${body.name} dengan stok ${body.stock}`,
      },
    ]);

    return c.json(
      { status: "success", message: "Produk berhasil disimpan", data: data[0] },
      201,
    );
  } catch (err: any) {
    return c.json({ status: "error", message: "Format data tidak valid" }, 400);
  }
});

// 3. [UPDATE] - Update Product & Stock
product.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const { data, error } = await supabase
    .from("products")
    .update({
      name: body.name,
      category_id: body.category_id,
      price_base: Number(body.price_base),
      price_sell: Number(body.price_sell),
      stock: Number(body.stock),
      unit: body.unit,
      is_active: body.is_active,
    })
    .eq("id", id)
    .eq("store_id", body.store_id) // Pastikan hanya bisa update milik sendiri [cite: 16]
    .select();

  if (error) return c.json({ status: "error", message: error.message }, 500);

  // Audit Log untuk Update
  await supabase.from("system_logs").insert([
    {
      store_id: body.store_id,
      action: "UPDATE_PRODUCT",
      severity: "info",
      message: `Update data produk: ${body.name}`,
    },
  ]);

  return c.json({ status: "success", data: data[0] });
});

// 4. [DELETE] - Remove Product
product.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const store_id = c.req.query("store_id");

  if (!store_id)
    return c.json({ status: "error", message: "store_id diperlukan" }, 400);

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("store_id", store_id);

  if (error) return c.json({ status: "error", message: error.message }, 500);

  // Audit Log untuk Delete
  await supabase.from("system_logs").insert([
    {
      store_id: store_id,
      action: "DELETE_PRODUCT",
      severity: "warning",
      message: `Produk dengan ID ${id} telah dihapus dari sistem`,
    },
  ]);

  return c.json({ status: "success", message: "Produk berhasil dihapus" });
});

export default product;
