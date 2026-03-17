"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Screen1Personal } from "@/components/Screen1Personal";
import { Screen2Capital } from "@/components/Screen2Capital";
import { Screen3Family } from "@/components/Screen3Family";
import { Screen4Insurance } from "@/components/Screen4Insurance";
import { DecileMeter } from "@/components/DecileMeter";
import { ResultsView } from "@/components/ResultsView";
import { calculateDecile } from "@/lib/decile";
import type { FormState } from "@/lib/types";

const totalSteps = 5;
const SESSION_STORAGE_KEY = "evaluation_session_id";

const initialFormState: FormState = {
  gender: "",
  employment: "",
  full_name: "",
  phone: "",
  age: "",
  age_group: "",
  residence: "",
  household_size: "",
  family_income: "",
  own_capital: "",
  email: "",
  property_status: "",
  stock_market: "",
  investments_abroad: undefined,
  investments_abroad_scope: "",
  has_land: undefined,
  has_deposits: undefined,
  deposits_scope: "",
  mortgage_pays: undefined,
  mortgage_amount: "",
  pension_optimization: "",
  tax_consulting: undefined,
  tax_consulting_when: "",
  provident_withdrawals: undefined,
  provident_when: "",
  id_upload_skipped: undefined,
  clearinghouse_skipped: undefined,
  pension_checked: undefined,
  mortgage_pct: "",
  insurance_pct: "",
  wants_expert_call: undefined,
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [showResults, setShowResults] = useState(false);
  const [decileResult, setDecileResult] = useState<{
    decile: number;
    score: number;
    maxScore: number;
    distribution: number[];
  } | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  });
  const [saveError, setSaveError] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  if (sessionId) sessionIdRef.current = sessionId;

  const update = (updates: Partial<FormState>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const currentDecile = (() => {
    if (step < 2) return null;
    const { decile } = calculateDecile({
      family_income: formData.family_income || undefined,
      own_capital: formData.own_capital || undefined,
      property_status: formData.property_status || undefined,
      household_size: formData.household_size || undefined,
      age: formData.age || undefined,
    });
    return decile;
  })();

  const saveAndGoToResults = async () => {
    const result = calculateDecile({
      family_income: formData.family_income || undefined,
      own_capital: formData.own_capital || undefined,
      property_status: formData.property_status || undefined,
      household_size: formData.household_size || undefined,
      age: formData.age || undefined,
    });
    const currentId = sessionIdRef.current ?? sessionId ?? (typeof window !== "undefined" ? sessionStorage.getItem(SESSION_STORAGE_KEY) : null);
    const formDataForDb = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, v === undefined ? null : v])
    );
    try {
      const payload = {
        sessionId: currentId || undefined,
        step_reached: totalSteps,
        form_data: formDataForDb,
        completed: true,
        decile: result.decile,
        score: result.score,
      };
      const res = await fetch("/api/sessions/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        if (json.id && !currentId) {
          sessionIdRef.current = json.id;
          setSessionId(json.id);
          if (typeof window !== "undefined") sessionStorage.setItem(SESSION_STORAGE_KEY, json.id);
        }
      }
    } catch (_) {}
    if (typeof window !== "undefined") sessionStorage.removeItem(SESSION_STORAGE_KEY);
    sessionIdRef.current = null;
    setSessionId(null);
    setDecileResult(result);
    setShowResults(true);
  };

  const goNext = async () => {
    if (step < totalSteps) {
      const nextStep = step + 1;
      const currentId = sessionIdRef.current ?? sessionId ?? (typeof window !== "undefined" ? sessionStorage.getItem(SESSION_STORAGE_KEY) : null);
      const formDataForDb = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, v === undefined ? null : v])
      );
      setSaveError(null);
      try {
        const body: { sessionId?: string; step_reached: number; form_data: Record<string, unknown> } = {
          step_reached: nextStep,
          form_data: formDataForDb,
        };
        if (currentId) body.sessionId = currentId;
        const res = await fetch("/api/sessions/upsert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = (json as { error?: string }).error || res.statusText || "Save failed";
          setSaveError(msg);
          return;
        }
        const newId = json.id;
        if (newId && !currentId) {
          sessionIdRef.current = newId;
          setSessionId(newId);
          if (typeof window !== "undefined") sessionStorage.setItem(SESSION_STORAGE_KEY, newId);
        }
        if (nextStep === totalSteps) {
          await saveAndGoToResults();
          return;
        }
        setStep(nextStep);
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : "Network error");
      }
    } else {
      await saveAndGoToResults();
    }
  };

  const goBack = () => {
    if (showResults) setShowResults(false);
    else if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    if (step === 1) {
      return Boolean(formData.gender && formData.employment && formData.age?.trim() && formData.residence?.trim());
    }
    if (step === 2) {
      const phoneDigits = (formData.phone || "").replace(/\D/g, "");
      const phoneOk = phoneDigits.length >= 9 && phoneDigits.length <= 10;
      return Boolean(
        formData.full_name?.trim() &&
          phoneOk &&
          formData.household_size?.trim() &&
          formData.family_income &&
          formData.own_capital
      );
    }
    if (step === 3) {
      const base =
        formData.property_status &&
        formData.stock_market &&
        formData.investments_abroad !== undefined &&
        formData.has_land !== undefined &&
        formData.has_deposits !== undefined;
      if (!base) return false;
      if (formData.investments_abroad === true && !formData.investments_abroad_scope) return false;
      if (formData.has_deposits === true && !formData.deposits_scope) return false;
      return true;
    }
    if (step === 4) {
      const base =
        formData.mortgage_pays !== undefined &&
        formData.pension_optimization &&
        formData.tax_consulting !== undefined &&
        formData.provident_withdrawals !== undefined;
      if (!base) return false;
      if (formData.mortgage_pays === true && !formData.mortgage_amount) return false;
      if (formData.tax_consulting === true && !formData.tax_consulting_when) return false;
      if (formData.provident_withdrawals === true && !formData.provident_when) return false;
      return true;
    }
    return false;
  };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-2xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <a
            href="https://www.barak-fin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-3"
          >
            <img src="/unnamed.png" alt="ברק פיננסים" className="h-14 sm:h-16 w-auto object-contain" />
          </a>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-l from-barak-200 via-barak-100 to-barak-50 bg-clip-text text-transparent drop-shadow-sm">
            סימולטור משפחות
          </h1>
          {!showResults && (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-200 mt-4">
                איפה אתם ממוקמים בסרגל העושר הפיננסי?
              </h2>
              <p className="text-slate-300 mt-2 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                רוב המשפחות מנהלות את הכסף שלהן ב&quot;טייס אוטומטי&quot;. סימולטור העושר של ברק פיננסים ייצר עבורכם ב-2 דקות תמונת מצב מדויקת: היכן אתם עומדים ביחס לאוכלוסייה, איזה פוטנציאל מתפספס, ומהן האסטרטגיות המעשיות להשבחת ההון שלכם.
              </p>
            </>
          )}
        </motion.header>

        {!showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            {currentDecile != null && (
              <div className="flex justify-end mb-3">
                <span className="text-barak-200 font-medium text-sm bg-barak-700/30 px-3 py-1 rounded-full">
                  הערכה: עשירון {currentDecile}
                </span>
              </div>
            )}
            <div className="flex gap-2 justify-center mb-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                <motion.div
                  key={s}
                  className={`h-3 flex-1 max-w-[56px] rounded-full transition-all duration-300 ${
                    s <= step ? "bg-gradient-to-l from-barak-700 to-barak-600 shadow-lg shadow-barak-700/30" : "bg-white/15"
                  }`}
                  initial={false}
                  animate={{
                    scale: s === step ? 1.08 : 1,
                    opacity: s <= step ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
            <p className="text-center text-slate-500 text-xs">שלב {step} מתוך {totalSteps}</p>
            <p className="text-center text-barak-200 text-sm font-medium mt-1 mb-2">
              נכון לעכשיו מדד העושר שלכם הוא:
            </p>
            <DecileMeter decile={currentDecile ?? null} compact />
          </motion.div>
        )}

        {!showResults && (
          <div className="relative rounded-2xl overflow-hidden border border-barak-600/30 bg-gradient-to-br from-barak-700/15 via-barak-600/10 to-transparent px-5 py-4 shadow-inner mb-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-barak-600 to-barak-500 rounded-r" aria-hidden />
            <div className="flex gap-3">
              <span className="shrink-0 w-9 h-9 rounded-xl bg-barak-700/25 flex items-center justify-center text-lg" aria-hidden>
                📊
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-barak-300 uppercase tracking-wide mb-1.5">
                  מבוסס על נתונים מדויקים
                </p>
                <p className="text-slate-200 text-sm leading-relaxed">
                  מושווה לנתונים רשמיים של הלשכה המרכזית לסטטיסטיקה ולמקורות נוספים: ברק פיננסים, דו&quot;חות CBS, מחקרי אדווה וטאוב, Credit Suisse. תקבל הערכה ל{" "}
                  <span className="relative inline-block group">
                    <span
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2.5 rounded-xl bg-barak-900/95 text-white text-xs font-medium text-center min-w-[260px] max-w-[320px] shadow-lg border border-barak-600/40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-10"
                      role="tooltip"
                    >
                      עשירון משקי בית מחלק את משקי הבית בישראל ל־10 קבוצות לפי הכנסה ונכסים – מעשירון 1 (הנמוך) עד עשירון 10 (הגבוה). כאן תקבל הערכה לאיזה עשירון אתה שייך.
                      <span className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-barak-900" aria-hidden />
                    </span>
                    <span className="text-barak-200 font-semibold cursor-help">עשירון משקי</span>
                  </span>{" "}
                  שלך.
                </p>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {showResults && decileResult ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <ResultsView
                formData={formData}
                decile={decileResult.decile}
                score={decileResult.score}
                maxScore={decileResult.maxScore}
                distribution={decileResult.distribution}
                onBack={goBack}
                update={update}
              />
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="glass p-6 sm:p-8"
            >
              {step === 1 && <Screen1Personal formData={formData} update={update} />}
              {step === 2 && <Screen2Capital formData={formData} update={update} />}
              {step === 3 && <Screen3Family formData={formData} update={update} />}
              {step === 4 && <Screen4Insurance formData={formData} update={update} />}

              <div className="flex flex-col gap-4 mt-8">
                {saveError && (
                  <div className="rounded-2xl bg-red-500/20 border-2 border-red-500/40 text-red-200 px-4 py-2 text-sm">
                    שמירה נכשלה: {saveError}
                  </div>
                )}
                <div className="flex gap-3 flex-row-reverse flex-wrap">
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canProceed()}
                    className="btn-primary"
                  >
                    {step >= totalSteps - 1 ? "🎉 סיום וצפייה בתוצאה" : "הבא ←"}
                  </button>
                  {step > 1 && (
                    <button type="button" onClick={goBack} className="btn-secondary">
                      חזרה →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
