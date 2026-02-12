import { serve } from "@hono/node-server";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { Hono } from "hono";

dotenv.config(); // Mengaktifkan pembacaan file .env

const app = new Hono();

// Inisialisasi Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || "",
);

app.get("/", async (c) => {
  // Mencoba test tarik data dari tabel "stores"
  const { data, error } = await supabase.from("stores").select("*");

  if (error) {
    return c.json(
      {
        status: "error",
        message: "gagal terhubung ke supabase",
        detail: error.message,
      },
      500,
    );
  }

  return c.json(
    {
      status: "success",
      message: "berhasil terhubung ke supabase",
      data: data,
    },
    200,
  );
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
