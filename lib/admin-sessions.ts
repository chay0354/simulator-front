import { unstable_noStore } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export interface AdminSessionRow {
  id: string;
  created_at: string;
  updated_at: string;
  step_reached: number;
  completed: boolean;
  form_data: Record<string, unknown>;
  decile: number | null;
  score: number | null;
}

/**
 * Fetch all evaluation_sessions from Supabase (server-side only).
 * Use this in the admin page so data is loaded on the server with the same env as the API.
 */
export async function getAdminSessions(): Promise<AdminSessionRow[]> {
  unstable_noStore();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    return [];
  }
  const supabase = createClient(url, serviceRoleKey);
  const { data, error } = await supabase
    .from("evaluation_sessions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error) {
    console.error("[admin getAdminSessions]", error.message);
    return [];
  }
  return (Array.isArray(data) ? data : []) as AdminSessionRow[];
}
