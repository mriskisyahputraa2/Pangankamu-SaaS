import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

async function testAPI() {
  try {
    // Login to get fresh token
    console.log("🔍 Logging in...");
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: "index.test@gmail.com",
        password: "Pangankamu123", // Replace with actual password
      });

    if (authError) {
      console.error("❌ Login error:", authError);
      return;
    }

    console.log("✅ Login successful");
    const token = authData.session?.access_token;
    console.log("🎫 Token:", token?.substring(0, 50) + "...");

    // Test categories API
    console.log("\n🔍 Testing categories API...");
    const response = await fetch(
      "http://localhost:3000/categories?page=1&limit=10&search=",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const result = await response.json();
    console.log("✅ API Response:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

testAPI();
