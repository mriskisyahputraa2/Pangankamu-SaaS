import { Hono } from "hono";
import { supabase, supabaseAdmin } from "../config/supabase.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { sendResponse } from "../utils/response.js";

const auth = new Hono();

/**
 * 1. SIGN-UP (Registrasi Pengusaha Baru)
 * Membuat User Auth sekaligus baris data di tabel stores
 */
auth.post("/signup", async (c) => {
  try {
    const { email, password, full_name, store_name, slug } = await c.req.json();

    if (!email || !password || !store_name) {
      return c.json(
        sendResponse("error", "Data pendaftaran tidak lengkap"),
        400,
      );
    }

    // Registrasi ke Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });

    if (authError || !authData.user) {
      return c.json(
        sendResponse("error", authError?.message || "Gagal mendaftar"),
        400,
      );
    }

    const userId = authData.user.id;

    // Membuat baris di tabel stores (Multi-Tenancy)
    const { data: storeData, error: storeError } = await supabase
      .from("stores")
      .insert([{ name: store_name, slug: slug, owner_id: userId }])
      .select()
      .single();

    if (storeError) {
      // Handle duplicate slug/name error dengan pesan bahasa Indonesia
      if (
        storeError.code === "23505" ||
        storeError.message.includes("duplicate key")
      ) {
        return c.json(
          sendResponse(
            "error",
            "Nama toko sudah digunakan, silakan pilih nama lain",
          ),
          400,
        );
      }
      return c.json(
        sendResponse("error", "Gagal membuat toko: " + storeError.message),
        400,
      );
    }

    // Update Metadata User agar store_id menempel di JWT
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { full_name, store_id: storeData.id, role: "vendor" },
    });

    return c.json(
      sendResponse("success", "Registrasi berhasil!", {
        user: { id: userId, email },
        store: { id: storeData.id, name: storeData.name },
      }),
      201,
    );
  } catch (error) {
    return c.json(sendResponse("error", "Terjadi kesalahan server"), 500);
  }
});

/**
 * 2. LOGIN (Email & Password)
 */
auth.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json(
        sendResponse("error", "Email dan password wajib diisi"),
        400,
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return c.json(sendResponse("error", "Email atau password salah"), 401);
    }

    return c.json(
      sendResponse("success", "Login berhasil", {
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          ...data.user.user_metadata,
        },
      }),
      200,
    );
  } catch (error) {
    return c.json(sendResponse("error", "Gangguan server saat login"), 500);
  }
});

/**
 * 3. LOGIN WITH GOOGLE (OAuth)
 */
auth.get("/login-google", async (c) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3001/callback", // URL Frontend kamu
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });

    if (error) return c.json(sendResponse("error", "Gagal OAuth"), 500);
    return c.redirect(data.url);
  } catch (err) {
    return c.json(sendResponse("error", "Internal error"), 500);
  }
});

/**
 * 4. SETUP STORE (Untuk User Google Baru)
 * Menghubungkan akun Google ke Toko baru
 */
auth.post("/setup-store", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const { store_name, slug } = await c.req.json();

    if (!store_name) {
      return c.json(sendResponse("error", "Nama toko wajib diisi"), 400);
    }

    // Buat data toko di database
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .insert([
        {
          name: store_name,
          slug: slug || store_name.toLowerCase().replace(/\s+/g, "-"),
          owner_id: user.id,
        },
      ])
      .select()
      .single();

    if (storeError) {
      // Handle duplicate slug/name error dengan pesan bahasa Indonesia
      if (
        storeError.code === "23505" ||
        storeError.message.includes("duplicate key")
      ) {
        return c.json(
          sendResponse(
            "error",
            "Nama toko sudah digunakan, silakan pilih nama lain",
          ),
          400,
        );
      }
      return c.json(
        sendResponse("error", "Gagal membuat toko: " + storeError.message),
        400,
      );
    }

    const userEmail = user.email ?? "";
    const defaultName = userEmail
      ? userEmail.split("@")[0]
      : "Pengusaha Pangankamu";
    // Kunci store_id ke metadata user secara permanen
    const { data: updated, error: authError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: {
          full_name: user.user_metadata?.full_name || defaultName,
          store_id: store.id,
          role: "vendor",
        },
      });

    if (authError) throw authError;

    return c.json(
      sendResponse("success", "Setup toko berhasil", {
        token: c.req.header("Authorization")?.split(" ")[1],
        user: {
          id: updated.user.id,
          email: updated.user.email,
          ...updated.user.user_metadata,
        },
      }),
    );
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 500);
  }
});

export default auth;
