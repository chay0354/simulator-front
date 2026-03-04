"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { AdminSessionRow } from "@/lib/admin-sessions";

const FORM_LABELS: Record<string, string> = {
  gender: "מין",
  full_name: "שם מלא",
  age: "גיל",
  residence: "מקום מגורים",
  household_size: "נפשות בבית",
  phone: "טלפון",
  email: "אימייל",
  employment: "שכיר/עצמאי",
  family_income: "הכנסה משפחתית",
  own_capital: "הון נזיל",
  investments_abroad: "השקעות בחו\"ל",
  has_land: "קרקעות",
  property_status: "דיור",
  pension_checked: "בדק פנסיה",
  mortgage_pct: "משכנתא %",
  insurance_pct: "ביטוח %",
};
const INCOME_LABELS: Record<string, string> = {
  under_25: "פחות מ-25k",
  "25_50": "25–50k",
  over_50: "מעל 50k",
};
const CAPITAL_LABELS: Record<string, string> = {
  under_250: "פחות מ-250k",
  "250_500": "250–500k",
  over_500: "מעל 500k",
  over_1m: "מעל מיליון",
  over_5m: "מעל 5 מיליון",
};
const PROPERTY_LABELS: Record<string, string> = {
  none: "אין",
  one: "דירה אחת",
  two_plus: "2+",
};

function formatFormValue(key: string, value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  if (key === "gender") return value === "male" ? "זכר" : "נקבה";
  if (key === "employment") return value === "self" ? "עצמאי" : "שכיר";
  if (key === "family_income") return INCOME_LABELS[value as string] ?? String(value);
  if (key === "own_capital") return CAPITAL_LABELS[value as string] ?? String(value);
  if (key === "property_status") return PROPERTY_LABELS[value as string] ?? String(value);
  if (key === "investments_abroad" || key === "has_land" || key === "pension_checked")
    return value ? "כן" : "לא";
  return String(value);
}

const REFRESH_INTERVAL_MS = 15_000;

interface AdminClientProps {
  initialSessions: AdminSessionRow[];
}

export function AdminClient({ initialSessions }: AdminClientProps) {
  const [sessions, setSessions] = useState<AdminSessionRow[]>(initialSessions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadSessions = useCallback(() => {
    const url = `/api/admin/sessions?t=${Date.now()}`;
    return fetch(url, { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = (data && typeof data.error === "string") ? data.error : res.statusText;
          throw new Error(msg);
        }
        return Array.isArray(data) ? data : (Array.isArray((data as { data?: unknown })?.data) ? (data as { data: AdminSessionRow[] }).data : []);
      })
      .then(setSessions)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    const id = setInterval(() => loadSessions(), REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [loadSessions]);

  useEffect(() => {
    const onFocus = () => loadSessions();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadSessions]);

  const onRefresh = () => {
    setLoading(true);
    setError(null);
    loadSessions().finally(() => setLoading(false));
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 sm:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">ניהול משתמשים – סימולטור</h1>
            <p className="text-slate-400 text-sm mt-1">טבלת evaluation_sessions ({sessions.length} שורות)</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="text-sky-400 hover:text-sky-300 text-sm border border-sky-400/50 px-3 py-1 rounded disabled:opacity-50"
            >
              {loading ? "…" : "רענן"}
            </button>
            <Link href="/" className="text-sky-400 hover:text-sky-300 text-sm">
              ← חזרה לסימולטור
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-200 px-4 py-2 text-sm">
            שגיאה: {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
          <div className="px-4 py-2 border-b border-white/10 text-slate-400 text-sm font-mono">evaluation_sessions</div>
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-white/10 text-slate-300 text-sm">
                <th className="p-3 font-medium">תאריך</th>
                <th className="p-3 font-medium">מסך שהגיע</th>
                <th className="p-3 font-medium">הושלם</th>
                <th className="p-3 font-medium">עשירון</th>
                <th className="p-3 font-medium">שם / אימייל</th>
                <th className="p-3 font-medium w-20"></th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 space-y-2">
                    <p>אין רשומות בטבלת evaluation_sessions (0 שורות).</p>
                    <p className="text-sm">כדי שיופיעו נתונים: היכנס לסימולטור, מלא את הדף הראשון ולחץ «המשך».</p>
                    <p className="text-xs text-slate-600">מתעדכן אוטומטית כל 15 שניות, או לחץ «רענן».</p>
                  </td>
                </tr>
              ) : (
                sessions.map((row) => {
                  const fd = (row.form_data || {}) as Record<string, unknown>;
                  const isExpanded = expandedId === row.id;
                  return (
                    <Fragment key={row.id}>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3 text-slate-300 text-sm">
                          {new Date(row.created_at).toLocaleString("he-IL")}
                        </td>
                        <td className="p-3">
                          <span className="text-amber-300 font-medium">מסך {row.step_reached}</span>
                        </td>
                        <td className="p-3">
                          {row.completed ? (
                            <span className="text-emerald-400">כן</span>
                          ) : (
                            <span className="text-slate-500">לא</span>
                          )}
                        </td>
                        <td className="p-3 text-sky-300">
                          {row.decile != null ? `עשירון ${row.decile}` : "—"}
                        </td>
                        <td className="p-3 text-slate-200">
                          {formatFormValue("full_name", fd.full_name)} / {formatFormValue("email", fd.email)}
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : row.id)}
                            className="text-sky-400 hover:text-sky-300 text-sm"
                          >
                            {isExpanded ? "סגור" : "פרטים"}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-white/5">
                          <td colSpan={6} className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                              {Object.entries(fd).map(([key, value]) => (
                                <div key={key} className="flex flex-col gap-0.5">
                                  <span className="text-slate-500">{FORM_LABELS[key] ?? key}</span>
                                  <span className="text-slate-200">{formatFormValue(key, value)}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
