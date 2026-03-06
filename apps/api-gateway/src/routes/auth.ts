import { Hono } from "hono";
import { authService } from "../services/authService.js";
import { supabase } from "../config/supabase.js";
import { sendResponse } from "../utils/response.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const auth = new Hono();

// 1. SIGN-UP
auth.post("/signup", async (c) => {
  try {
    const body = await c.req.json();
    const result = await authService.registerVendor(body);
    return c.json(sendResponse("success", "Registrasi berhasil!", result), 201);
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 400);
  }
});

// 2. LOGIN EMAIL
auth.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const result = await authService.login(email, password);
    return c.json(sendResponse("success", "Login berhasil", result), 200);
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 401);
  }
});

// 3. LOGIN WITH GOOGLE (OAuth Redirect)
auth.get("/login-google", async (c) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3001/callback", // URL Dashboard Frontend
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });

  if (error) return c.json(sendResponse("error", "Gagal melakukan OAuth"), 500);
  return c.redirect(data.url);
});

// 4. SETUP STORE (Khusus pengguna Google baru)
auth.post("/setup-store", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json();
    const result = await authService.setupStore(user, body);

    return c.json(sendResponse("success", "Setup toko berhasil", result), 200);
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 500);
  }
});

// 5. GET STORE PROFILE (Get current user's store data)
auth.get("/store-profile", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    const result = await authService.getStoreProfile(user.id);

    return c.json(
      sendResponse("success", "Store profile retrieved", result),
      200,
    );
  } catch (error: any) {
    return c.json(sendResponse("error", error.message), 404);
  }
});

export default auth;
