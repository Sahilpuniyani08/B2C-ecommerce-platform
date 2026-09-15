import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/test/storage — Test: verify Supabase storage connectivity
 */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.storage.listBuckets();
    if (error) throw error;

    return NextResponse.json({
      success: true,
      buckets: data.map((b) => b.name),
    });
  } catch (error) {
    console.error("Storage test failed:", error);
    return NextResponse.json(
      { success: false, error: "Storage connection failed" },
      { status: 503 }
    );
  }
}
