import { Hono } from "hono";
import { supabase } from "../config/supabase.js";

const category = new Hono();

// Get All Categories
category.get("/", async (c) => {
  console.log("Mencoba mengambil kategori...");
  // mengambil parameter dari url query page, limit dan search
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "10");
  const search = c.req.query("search") || "";

  // menghitung offset (titik awal data)
  const offset = (page - 1) * limit;

  // menyiapkan query dasar ke supabase
  let query = supabase.from("categories").select("*", { count: "exact" });

  // logic searching
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  // mendapatkan data categori
  const { data, error, count } = await query
    .order("name", { ascending: true }) // urutkan berdasarkan nama (A - Z)
    .range(offset, offset + limit - 1); // batas baris yang diambil

  // jika api categori nya tidak dapat, maka tampilkan error dengan respon 500
  if (error) {
    console.error("[BUG] Fetch Category:", error.message);
    return c.json({ status: "error", message: error.message }, 500);
  }
  //jika ada return status success dan data categorinya
  return c.json({
    status: "success",
    data, // Daftar kategori hasil filter/pagination
    total: count, // Total seluruh data di database (untuk Data Counter)
    page, // Halaman saat ini
    limit, // Jumlah data per halaman
  });
});

// Create Categories
category.post("/", async (c) => {
  const body = await c.req.json();

  // logic tambah categori
  const { data, error } = await supabase
    .from("categories")
    .insert([body])
    .select();

  // jika terjadi error
  if (error) return c.json({ status: "error", message: error.message }, 500);

  // jika berhasil
  return c.json({ status: "success", data: data[0] }, 201);
});

// Edit & Update Categories
category.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const { data, error } = await supabase
    .from("categories")
    .update({ name: body.name })
    .eq("id", id)
    .select();

  if (error) return c.json({ status: "error", message: error.message }, 500);
  return c.json({ status: "success", data: data[0] });
});

// Delete Categories
category.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return c.json({ status: "error", message: error.message }, 500);
  return c.json({ status: "success", message: "Kategori dihapus" });
});

export default category;
