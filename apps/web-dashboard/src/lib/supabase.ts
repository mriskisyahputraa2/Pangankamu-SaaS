import { createClient } from "@supabase/supabase-js";

// Konfigurasi khusus untuk OAuth callback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // PENTING: Untuk detect OAuth callback
    flowType: "implicit", // Untuk Google OAuth
  },
});
