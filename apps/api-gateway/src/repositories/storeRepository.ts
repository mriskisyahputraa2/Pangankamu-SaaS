import { supabase } from "../config/supabase.js";

export const storeRepository = {
  // Simpan data toko baru ke database
  async createStore(name: string, slug: string, owner_id: string) {
    return await supabase
      .from("stores")
      .insert([{ name, slug, owner_id }])
      .select()
      .single();
  },

  // Ambil detail toko berdasarkan ID Owner (Relasi ke Supabase Auth)
  async getStoreByOwnerId(ownerId: string) {
    return await supabase
      .from("stores")
      .select("*")
      .eq("owner_id", ownerId)
      .single();
  },
};
