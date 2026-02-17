import { Hono } from "hono";
import { supabase } from "../config/supabase.js";

const category = new Hono();

// 1. [READ] - Get All Categories (Filtered by Store ID)
category.get("/", async (c) => {
  // Sesuai dokumen: Isolasi data antar toko menggunakan store_id
  const store_id = c.req.query("store_id");
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

  // Query difilter berdasarkan store_id sesuai poin 3A dokumen
  let query = supabase
    .from("categories")
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

// 2. [CREATE] - Create Category with Audit Log
category.post("/", async (c) => {
  const body = await c.req.json();

  // Insert kategori dengan menyertakan store_id (Tenant Isolation)
  const { data, error } = await supabase
    .from("categories")
    .insert([
      {
        name: body.name,
        store_id: body.store_id, // Wajib ada sesuai skema database SaaS
      },
    ])
    .select();

  if (error) return c.json({ status: "error", message: error.message }, 500);

  // Logging ke system_logs sesuai poin 5.6 dokumen perencanaan
  await supabase.from("system_logs").insert([
    {
      store_id: body.store_id,
      action: "CREATE_CATEGORY",
      severity: "info",
      message: `User menambahkan kategori baru: ${body.name}`,
    },
  ]);

  return c.json({ status: "success", data: data[0] }, 201);
});

// 3. [UPDATE] - Edit Category
category.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const { data, error } = await supabase
    .from("categories")
    .update({ name: body.name })
    .eq("id", id)
    // Keamanan tambahan: pastikan kategori milik store yang benar
    .eq("store_id", body.store_id)
    .select();

  if (error) return c.json({ status: "error", message: error.message }, 500);

  // Audit Log Update
  await supabase.from("system_logs").insert([
    {
      store_id: body.store_id,
      action: "UPDATE_CATEGORY",
      severity: "info",
      message: `Update kategori ID ${id} menjadi ${body.name}`,
    },
  ]);

  return c.json({ status: "success", data: data[0] });
});

// 4. [DELETE] - Delete Category
category.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const store_id = c.req.query("store_id"); // Dikirim via query param

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("store_id", store_id);

  if (error) return c.json({ status: "error", message: error.message }, 500);

  // Audit Log Delete
  await supabase.from("system_logs").insert([
    {
      store_id: store_id,
      action: "DELETE_CATEGORY",
      severity: "warning",
      message: `Kategori dengan ID ${id} telah dihapus`,
    },
  ]);

  return c.json({ status: "success", message: "Kategori berhasil dihapus" });
});

export default category;
