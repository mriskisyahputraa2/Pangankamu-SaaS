import { Hono } from "hono";
import { supabase, supabaseAdmin } from "../config/supabase.js";
import { sendResponse } from "../utils/response.js";

const auth = new Hono();

/**
 * 1. SIGN-UP (PENDAFTARAN PENGUSAHA BARU)
 * Alur: Auth -> Create Store -> Update Metadata
 */
auth.post("/signup", async (c) => {
  try {
    const { email, password, full_name, store_name, slug } = await c.req.json();

    // Validasi input minimal
    if (!email || !password || !store_name) {
      return c.json(
        sendResponse("error", "Data pendaftaran tidak lengkap"),
        400,
      );
    }

    if (password.lenght < 6) {
      return c.json(
        sendResponse("error", "Password terlalu pendek, minimal 6 karakter"),
      );
    }

    // Registrasi akun ke Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });

    if (authError || !authData.user) {
      const message =
        authError?.message === "User already registered"
          ? "Email ini sudah terdaftar. Silakan gunakan email lain atau login."
          : authError?.message || "Gagal mendaftar";

      return c.json(sendResponse("error", message), 400);
    }

    const userId = authData.user.id;

    // Membuat Toko Baru (Table stores)
    const { data: storeData, error: storeError } = await supabase
      .from("stores")
      .insert([{ name: store_name, slug: slug, owner_id: userId }])
      .select()
      .single();

    if (storeError) {
      // Jika toko gagal, gunakan kode error 23505 untuk cek slug ganda
      const msg =
        storeError.code === "23505"
          ? "Slug atau nama toko sudah digunakan"
          : storeError.message;
      return c.json(sendResponse("error", "Gagal membuat toko: " + msg), 400);
    }

    // Update Metadata User (Role & Store ID)
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          full_name,
          store_id: storeData.id,
          role: "vendor",
        },
      });

    if (updateError) {
      return c.json(sendResponse("error", "Gagal mengatur hak akses"), 500);
    }

    return c.json(
      sendResponse(
        "success",
        "Registrasi berhasil, toko digital PanganKU kamu sudah siap!",
        {
          user: { id: userId, name: full_name },
          store: { id: storeData.id, name: storeData.name, role: "vendor" },
        },
      ),
      201,
    );
  } catch (error) {
    return c.json(
      sendResponse("error", "Terjadi kesalahan internal pada server"),
      500,
    );
  }
});

/* API LOGIN */
auth.post("/login", async (c) => {
  try {
    // data permintan untuk login yaitu: email dan password
    const { email, password } = await c.req.json();

    // logic jika email dan password tidak ada dimasukkan
    if (!email || !password) {
      return c.json({
        status: "error",
        message: "Email dan password wajib diisi",
      });
    }

    // proses verifikasi email dan password yang dikirim ke supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // logic jika proses verifikasi gagal
    if (error) {
      return c.json(sendResponse("error", "Email atau password salah"), 401);
    }

    // jika berhasil proses verifikasi
    return c.json(
      sendResponse("success", "Login berhasil", {
        token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          ...data.user.user_metadata,
        },
      }),
      200,
    );
  } catch (error) {
    return c.json(sendResponse("error", "Terjadi gangguan pada server"), 500);
  }
});

/* ROUTE LOGIN GOOGLE */
auth.get("/login-google", async (c) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3001/callback", // Sesuaikan dengan URL Frontend
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });

    if (error)
      return c.json(
        sendResponse("error", "Gagal menghubungkan ke Google"),
        500,
      );

    return c.redirect(data.url);
  } catch (err) {
    return c.json(sendResponse("error", "OAuth failed"), 500);
  }
});

export default auth;
