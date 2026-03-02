import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

async function testUniqueConstraint() {
  try {
    console.log("🔍 Testing unique constraint...");

    // Try to insert duplicate data
    const testData = {
      name: "test-duplicate",
      store_id: "75024b51-6a4c-4408-9800-f41211d89500",
    };

    console.log("📝 Inserting first record...");
    const { data: firstInsert, error: firstError } = await supabase
      .from("categories")
      .insert([testData])
      .select()
      .single();

    if (firstError) {
      console.log("❌ First insert error:", firstError);
      return;
    }

    console.log("✅ First insert success:", firstInsert);

    console.log("📝 Trying to insert duplicate...");
    const { data: secondInsert, error: secondError } = await supabase
      .from("categories")
      .insert([testData])
      .select()
      .single();

    if (secondError) {
      console.log("✅ Duplicate caught! Error code:", secondError.code);
      console.log("✅ Error message:", secondError.message);
    } else {
      console.log("❌ Duplicate not prevented! This is a problem.");
      console.log("❌ Second insert success:", secondInsert);
    }

    // Cleanup - delete test data
    console.log("🧹 Cleaning up test data...");
    await supabase
      .from("categories")
      .delete()
      .eq("name", "test-duplicate")
      .eq("store_id", "75024b51-6a4c-4408-9800-f41211d89500");

    console.log("✅ Cleanup complete");
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

testUniqueConstraint();
