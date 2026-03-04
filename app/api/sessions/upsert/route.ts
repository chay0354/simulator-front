import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function log(msg: string, data?: Record<string, unknown>) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [sessions/upsert] ${msg}`, data ?? "");
}

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    log("Missing Supabase config");
    return NextResponse.json(
      { error: "Missing Supabase config for sessions" },
      { status: 500 }
    );
  }

  let body: {
    sessionId?: string;
    step_reached: number;
    form_data: Record<string, unknown>;
    completed?: boolean;
    decile?: number;
    score?: number;
  };
  try {
    body = await request.json();
  } catch {
    log("Invalid JSON body");
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { sessionId, step_reached, form_data, completed, decile, score } = body;
  if (step_reached == null || form_data == null) {
    log("Rejected: missing step_reached or form_data", { step_reached, hasFormData: !!form_data });
    return NextResponse.json(
      { error: "step_reached and form_data required" },
      { status: 400 }
    );
  }

  log("Request", { sessionId: sessionId ?? "—", step_reached, completed: !!completed });

  const supabase = createClient(url, serviceRoleKey);

  // Only columns that exist in evaluation_sessions (id, created_at, updated_at, step_reached, completed, form_data, decile, score)
  const updatePayload = {
    step_reached: Number(step_reached),
    form_data,
    ...(completed !== undefined && { completed: !!completed }),
    ...(decile != null && { decile: Number(decile) }),
    ...(score != null && { score: Number(score) }),
  };

  // 1) If we have a session id, update that row
  if (sessionId) {
    const { data: updated, error } = await supabase
      .from("evaluation_sessions")
      .update(updatePayload)
      .eq("id", sessionId)
      .select("id")
      .maybeSingle();

    if (error) {
      log("Update by sessionId failed", { sessionId, error: error.message });
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (updated) {
      log("Updated by sessionId", { id: sessionId, step_reached });
      return NextResponse.json({ ok: true, id: sessionId });
    }
    log("Session id not found, inserting new", { sessionId });
  }

  // 2) Insert new row into evaluation_sessions
  const insertPayload = {
    step_reached: Number(step_reached),
    completed: completed === true,
    form_data,
    ...(decile != null && { decile: Number(decile) }),
    ...(score != null && { score: Number(score) }),
  };
  const { data: inserted, error } = await supabase
    .from("evaluation_sessions")
    .insert(insertPayload)
    .select("id")
    .single();

  if (error) {
    log("Insert failed", { error: error.message });
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  log("Inserted new session", { id: inserted?.id, step_reached });
  return NextResponse.json({ ok: true, id: inserted?.id }, { status: 201 });
}
