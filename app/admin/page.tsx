import { Suspense } from "react";
import { getAdminSessions } from "@/lib/admin-sessions";
import { AdminClient } from "./AdminClient";

/**
 * Admin page: load evaluation_sessions on the server so the table always
 * gets data from Supabase. Wrapped in Suspense to avoid hydration errors
 * (React #418/#423/#425) from spreading to the root.
 */
export default async function AdminPage() {
  const initialSessions = await getAdminSessions();
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white p-8 flex items-center justify-center">טוען...</div>}>
      <AdminClient initialSessions={initialSessions} />
    </Suspense>
  );
}
