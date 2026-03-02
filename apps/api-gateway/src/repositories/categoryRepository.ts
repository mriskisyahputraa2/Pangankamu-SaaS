import { supabase } from "../config/supabase.js";

export const categoryRepository = {
  // Ambil data berdasarkan store_id toko yang sedang login dengan ordering created_at
  async getAll(storeId: string, search: string, from: number, to: number) {
    let query = supabase
      .from("categories")
      .select("*", { count: "exact" })
      .eq("store_id", storeId)
      .range(from, to)
      .order("created_at", { ascending: false }); // Data terbaru di atas berdasarkan timestamp

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    return await query;
  },

  // Simpan data dengan menyertakan store_id
  async create(name: string, storeId: string) {
    return await supabase
      .from("categories")
      .insert([{ name, store_id: storeId }])
      .select()
      .single();
  },

  async update(id: string, name: string, storeId: string) {
    return await supabase
      .from("categories")
      .update({ name })
      .eq("id", id)
      .eq("store_id", storeId)
      .select()
      .single();
  },

  async delete(id: string, storeId: string) {
    return await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("store_id", storeId);
  },
};
