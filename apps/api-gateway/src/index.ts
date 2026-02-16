import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import productRoutes from "./routes/product.js";
import categoryRoute from "./routes/category.js";
import { logger } from "hono/logger";

const app = new Hono();

app.use("*", cors()); // untuk keamanan server siapa saja yng boleh akses data dari API
app.use("*", logger()); // mencatat setiap permintaan (GET, POST, PUT, DELETE) untuk memantau aktivitas server seperti bug, dll

// Menangkap semya bug yang tidak terduga diseluruh route
app.onError((err, c) => {
  //mendapaktan pesan bug di terminal
  console.log(`BUG DETECTED PATH: ${c.req.path}`);
  console.log(`Message: ${err.message}`);
  console.log(`Stack: ${err.stack}`);

  // Kirim pesan aman untuk user agar tidak bingung
  return c.json(
    {
      status: "error",
      message:
        "Terjadi kesalahan pada server. Kami akan segera memperbaikinya.",
    },
    500,
  );
});

// Rute tes koneksi tetap di sini tidak apa-apa
app.get("/", (c) => c.json({ message: "API PanganKamu is Online!" }));

// list list route
app.route("/categories", categoryRoute); // route categoriesx
app.route("/products", productRoutes); // route products

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
