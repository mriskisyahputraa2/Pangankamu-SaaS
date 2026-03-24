import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { User } from "@supabase/supabase-js";

// Import Routes
import productRoute from "./routes/product.js";
import categoryRoute from "./routes/category.js";
import orderRoute from "./routes/order.js";
import auth from "./routes/auth.js";

// Import Middleware
import { requireAuth, requireRole } from "./middleware/authMiddleware.js";
import { sendResponse } from "./utils/response.js";

// Definisikan tipe untuk Context Hono agar Type-Safe
type Variables = {
  user: User;
};

const app = new Hono<{ Variables: Variables }>();

// Middleware Global
app.use("*", cors());
app.use("*", logger());

// Error Handler
app.onError((err, c) => {
  console.log(`Server Error: ${c.req.path}: ${err.message}`);

  return c.json(
    sendResponse(
      "error",
      "Maaf terjadi gangguan pada server. Silahkan coba lagi",
    ),
    500,
  );
});

// Health Check
app.get("/", (c) => c.json({ message: "API PanganKamu is Online!" }));

// Cek Profil: Bisa diakses semua user yang login
app.get("/auth/profile", requireAuth, (c) => {
  const user = c.get("user");
  return c.json({
    status: "success",
    data: {
      email: user.email,
      fullName: user.user_metadata.full_name,
      role: user.user_metadata.role,
    },
  });
});

// Dashboard: Hanya untuk Super Admin (Riski)
app.get("/admin/dashboard", requireAuth, requireRole(["super_admin"]), (c) => {
  return c.json({
    status: "success",
    message: "Halo Riski! Selamat datang di dashboard utama PanganKU.",
  });
});

// --- LIST ROUTES ---
app.route("/auth", auth);
app.route("/categories", categoryRoute);
app.route("/products", productRoute);
app.route("/orders", orderRoute);

// Start Server
serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
