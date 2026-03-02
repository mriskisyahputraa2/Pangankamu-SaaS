import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export const authService = {
  /**
   * 1. Sinkronisasi Session ke LocalStorage
   * Digunakan agar Interceptor API bisa mengambil token untuk header Authorization.
   */
  async syncLocalSession(session: any) {
    if (!session || !session.user) return null;

    const userData = {
      token: session.access_token,
      user: {
        id: session.user.id,
        email: session.user.email,
        ...session.user.user_metadata, // Mengambil full_name, role, dan store_id
      },
    };

    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  },

  /**
   * 2. Cek Eksistensi Toko (Multi-Tenancy Check)
   * Menentukan apakah user harus diarahkan ke /setup-toko atau langsung ke dashboard.
   */
  async checkStoreExistence(userId: string) {
    const { data, error } = await supabase
      .from("stores")
      .select("id, name, slug")
      .eq("owner_id", userId)
      .single();

    // Jika error PGRST116 artinya data tidak ditemukan (user belum punya toko)
    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data; // Mengembalikan objek toko atau null
  },

  /**
   * 3. Refresh Session
   * Memastikan metadata terbaru (seperti store_id yang baru dibuat) terdeteksi oleh Supabase Client.
   */
  async refreshAndGetSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();
      if (error) throw error;

      // Update juga local storage setelah refresh
      if (session) {
        await this.syncLocalSession(session);
      }

      return session;
    } catch (err) {
      return null;
    }
  },

  /**
   * 4. Logout Global
   * Menghapus sesi di Supabase dan membersihkan data di browser.
   */
  async logout() {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (err) {
      // Tetap paksa hapus local data jika API gagal
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  },
};

export default authService;
