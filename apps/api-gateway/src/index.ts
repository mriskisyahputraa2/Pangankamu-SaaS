import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import productRoutes from "./routes/product.js";

const app = new Hono();

app.use("*", cors());

// Daftarkan rute modular
app.route("/products", productRoutes);

// Rute tes koneksi tetap di sini tidak apa-apa
app.get("/", (c) => c.json({ message: "API PanganKamu is Online!" }));

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
