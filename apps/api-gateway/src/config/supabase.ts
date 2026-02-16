import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

// WAJIB ada kata 'export' di depan const
export const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || "",
);
