import { Hono } from "hono";
import { supabase, supabaseAdmin } from "../config/supabase.js";

const auth = new Hono();

/* API SIGN-UP (PENDAFTARAN PENGUSAHA BARU)
 *
 * Alur Kerja:
 * 1. Mendaftar akun ke supabase auth
 * 2. Membuat toko ditabel "public.store".
 * 3. Menanamkan role "vendor" dan "store_id" ke dalam metadata User.
 */
auth.post("/signup", async (c) => {
  try {
    // menerima data dari frontend, yaitu: email, password, nama lengkap, nama toko, dan slug
    const { email, password, full_name, store_name, slug } = await c.req.json();

    // buat akun di supabase auth, melalui email dan password
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name,
        },
      },
    });

    // jika terjadi error atau datanya tidak sesuai
    if (authError || !authData.user) {
      return c.json({ status: "error", message: authError?.message }, 400);
    }
    // jika akunnya berhasil dibuat, maka akan diberikan user ID unik
    const userId = authData.user.id;

    // buat toko yang akan disimpan ketabel "stores"
    const { data: storeData, error: storeError } = await supabase
      .from("stores")
      .insert([
        {
          name: store_name,
          slug: slug,
          owner_id: userId,
        },
      ])
      .select()
      .single();

    // logic jika toko gagal dibuat
    if (storeError) {
      return c.json(
        { status: "error", message: "Gagal membuat toko" + storeError.message },
        500,
      );
    }

    // logic jika berhasil, maka id toko akan disimpan kedalam user ke supabase
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          full_name: full_name,
          store_id: storeData.id,
          role: "vendor", // default signup rolenya ialah: vendor(pengusaha)
        },
      });

    if (updateError) {
      return c.json(
        { status: "error", message: "Gagal mengatur hak akses user" },
        500,
      );
    }

    return c.json(
      {
        status: "success",
        message: "Register berhasil, Toko digital kamu sudah siap.",
        data: {
          user: {
            id: userId,
            name: full_name,
          },
          data: {
            id: storeData.id,
            name: storeData.name,
            slug: storeData.slug,
            role: "vendor",
          },
        },
      },
      201,
    );
  } catch (error) {
    return c.json({
      status: "error",
      message: "Terjadi kesalahan pada server.",
    });
  }
});

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
      return c.json(
        { status: "error", message: "Email atau password salah" },
        401,
      );
    }

    // jika berhasil proses verifikasi
    return c.json({
      status: "success",
      message: "Login Berhasil",
      data: {
        token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          ...data.user.user_metadata,
        },
      },
    });
  } catch (error) {
    return c.json(
      { status: "error", message: "Terjadi gangguan pada server" },
      500,
    );
  }
});

export default auth;
