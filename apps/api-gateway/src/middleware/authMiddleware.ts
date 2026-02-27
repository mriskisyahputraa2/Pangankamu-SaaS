import { supabase } from "../config/supabase.js";
import type { Context, Next } from "hono";
import type { User } from "@supabase/supabase-js";

// 1. Definisikan tipe Variables agar Hono tahu apa yang disimpan di 'c.set'
type HonoEnv = {
  Variables: {
    user: User;
    store_id: string | null; // Tempat menyimpan ID Toko otomatis
  };
};

/**
 * Middleware: requireAuth
 * Tugas: Validasi JWT dan Identifikasi Tenant (Multi-Tenancy) otomatis
 */
export const requireAuth = async (c: Context<HonoEnv>, next: Next) => {
  try {
    const authHeader = c.req.header("Authorization");

    // Cek apakah header Authorization ada
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json(
        { status: "error", message: "Akses ditolak. Token tidak ditemukan." },
        401,
      );
    }

    const token = authHeader.split(" ")[1];

    // Verifikasi token ke Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return c.json(
        { status: "error", message: "Sesi kadaluarsa atau token tidak valid." },
        401,
      );
    }

    const storeId = user.user_metadata?.store_id || null;

    // 3. Simpan data ke dalam konteks Hono (Context Variables)
    c.set("user", user);
    c.set("store_id", storeId);

    await next();
  } catch (err) {
    console.error("Middleware Error:", err);
    return c.json(
      { status: "error", message: "Terjadi kesalahan sistem keamanan." },
      500,
    );
  }
};

/**
 * Middleware: requireRole
 * Tugas: Membatasi akses berdasarkan role (misal: super_admin atau vendor)
 */
export const requireRole = (allowedRoles: string[]) => {
  return async (c: Context<HonoEnv>, next: Next) => {
    const user = c.get("user");
    const userRole = user?.user_metadata?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return c.json(
        {
          status: "error",
          message: `Akses dilarang. Fitur ini hanya untuk ${allowedRoles.join(" atau ")}.`,
        },
        403,
      );
    }

    await next();
  };
};
