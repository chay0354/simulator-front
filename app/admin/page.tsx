import { getAdminSessions } from "@/lib/admin-sessions";
import { AdminClient } from "./AdminClient";

/**
 * Admin page: load evaluation_sessions on the server so the table always
 * gets data from Supabase (same process/env as the API). Client still
 * refetches on interval and "רענן".
 */
export default async function AdminPage() {
  const initialSessions = await getAdminSessions();
  return <AdminClient initialSessions={initialSessions} />;
}
