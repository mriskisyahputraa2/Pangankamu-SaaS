import { supabase } from "../config/supabase.js";
import type { Context, Next } from "hono";
import type { User } from "@supabase/supabase-js";

// Definisikan tipe Env agar Middleware tahu apa yang ada di dalam Context
type HonoEnv = {
  Variables: {
    user: User;
  };
};

/**
 * Middleware: requireAuth
 * Tugas: Memastikan user membawa token valid dan menyimpannya ke Context
 */
export const requireAuth = async (c: Context<HonoEnv>, next: Next) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json(
        { status: "error", message: "Akses ditolak. Token tidak ditemukan." },
        401,
      );
    }

    const token = authHeader.split(" ")[1];
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

    // Simpan data user ke dalam konteks Hono
    c.set("user", user);
    await next();
  } catch (err) {
    return c.json(
      { status: "error", message: "Terjadi kesalahan sistem keamanan." },
      500,
    );
  }
};

/**
 * Middleware: requireRole
 * Tugas: Mengecek apakah role user ada dalam daftar yang diizinkan
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
