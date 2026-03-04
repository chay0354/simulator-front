import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Missing Supabase config for admin" },
      { status: 500 }
    );
  }
  const supabase = createClient(url, serviceRoleKey);
  const { data, error } = await supabase
    .schema("public")
    .from("evaluation_sessions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[admin/sessions] Supabase error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const body = Array.isArray(data) ? data : [];
  console.log(`[admin/sessions] ${url.replace(/\/\/.*@/, "//***@")} → ${body.length} row(s)`);
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
    },
  });
}
