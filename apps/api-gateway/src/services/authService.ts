import { supabase, supabaseAdmin } from "../config/supabase.js";
import { storeRepository } from "../repositories/storeRepository.js";

export const authService = {
  // Alur pendaftaran vendor manual (Email & Password)
  async registerVendor(payload: any) {
    const { email, password, full_name, store_name, slug } = payload;

    // 1. Registrasi ke Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message || "Gagal mendaftar");
    }

    const userId = authData.user.id;

    // 2. Simpan data toko menggunakan Repository
    const { data: storeData, error: storeError } =
      await storeRepository.createStore(store_name, slug, userId);

    if (storeError) {
      if (storeError.code === "23505")
        throw new Error("Nama toko/slug sudah digunakan");
      throw new Error(storeError.message);
    }

    // 3. Update Metadata User Admin (store_id & role)
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { full_name, store_id: storeData.id, role: "vendor" },
    });

    return {
      user: { id: userId, email },
      store: { id: storeData.id, name: storeData.name },
    };
  },

  // Alur login manual
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error("Email atau password salah");

    return {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        ...data.user.user_metadata,
      },
    };
  },

  // Alur setup toko untuk user yang masuk lewat Google OAuth
  async setupStore(user: any, payload: { store_name: string; slug?: string }) {
    const { store_name, slug } = payload;
    const generatedSlug = slug || store_name.toLowerCase().replace(/\s+/g, "-");

    // 1. Simpan data toko via Repository
    const { data: store, error: storeError } =
      await storeRepository.createStore(store_name, generatedSlug, user.id);

    if (storeError) {
      if (storeError.code === "23505")
        throw new Error("Nama toko sudah digunakan");
      throw new Error(storeError.message);
    }

    // 2. Kunci store_id dan role vendor ke metadata user secara permanen
    const userEmail = user.email ?? "";
    const defaultName =
      user.user_metadata?.full_name || userEmail.split("@")[0];

    const { data: updated, error: authError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: {
          full_name: defaultName,
          store_id: store.id,
          role: "vendor",
        },
      });

    if (authError) throw authError;

    return {
      user: {
        id: updated.user.id,
        email: updated.user.email,
        ...updated.user.user_metadata,
      },
      store,
    };
  },

  // Get store profile untuk current user
  async getStoreProfile(userId: string) {
    const { data: store, error } =
      await storeRepository.getStoreByOwnerId(userId);

    if (error || !store) {
      throw new Error("Store not found for this user");
    }

    return {
      id: store.id,
      name: store.name,
      slug: store.slug,
      owner_id: store.owner_id,
      created_at: store.created_at,
    };
  },
};

export default authService;
