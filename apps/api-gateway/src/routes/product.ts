import { Hono } from "hono";
import { supabase } from "../config/supabase.js";

const product = new Hono();

// 1. [READ] - Ambil Semua Produk dengan Pagination
product.get("/", async (c) => {
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("id", { ascending: true });

  if (error) return c.json({ status: "error", message: error.message }, 500);
  return c.json({ status: "success", data, total: count });
});

// 2. [CREATE] - Tambah Produk Baru
product.post("/", async (c) => {
  const body = await c.req.json();
  const { data, error } = await supabase
    .from("products")
    .insert([body])
    .select();

  if (error) return c.json({ status: "error", message: error.message }, 500);
  return c.json({ status: "success", data: data[0] }, 201);
});

// 3. [UPDATE] - Update Data Produk Berdasarkan ID
product.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const { data, error } = await supabase
    .from("products")
    .update(body)
    .eq("id", id)
    .select();

  if (error) return c.json({ status: "error", message: error.message }, 500);
  if (data.length === 0)
    return c.json({ status: "error", message: "Produk tidak ditemukan" }, 404);

  return c.json({ status: "success", data: data[0] }, 200);
});

// 4. [DELETE] - Hapus Produk Berdasarkan ID
product.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return c.json({ status: "error", message: error.message }, 500);
  return c.json(
    { status: "success", message: `Produk dengan ID ${id} berhasil dihapus` },
    200,
  );
});

export default product;
