"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Screen1Personal } from "@/components/Screen1Personal";
import { Screen2Capital } from "@/components/Screen2Capital";
import { Screen3Family } from "@/components/Screen3Family";
import { DecileMeter } from "@/components/DecileMeter";
import { ResultsView } from "@/components/ResultsView";
import { calculateDecile } from "@/lib/decile";
import type { FormState } from "@/lib/types";

const totalSteps = 3;
const SESSION_STORAGE_KEY = "evaluation_session_id";

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormState>({
    gender: "",
    full_name: "",
    age: "",
    residence: "",
    household_size: "",
    phone: "",
    email: "",
    employment: "",
    family_income: "",
    own_capital: "",
    investments_abroad: undefined,
    has_land: undefined,
    property_status: "",
    pension_checked: undefined,
    mortgage_pct: "",
    insurance_pct: "",
  });
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
          console.error("[sessions/upsert] failed:", res.status, json);
          setSaveError(msg);
          return;
        }
        const newId = json.id;
        if (newId && !currentId) {
          sessionIdRef.current = newId;
          setSessionId(newId);
          if (typeof window !== "undefined") sessionStorage.setItem(SESSION_STORAGE_KEY, newId);
        }
        setStep(nextStep);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Network or server error";
        setSaveError(msg);
      }
    } else {
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
      const completePayload: { sessionId?: string; step_reached: number; form_data: Record<string, unknown>; completed: true; decile: number; score: number } = {
        step_reached: 3,
        form_data: formDataForDb,
        completed: true,
        decile: result.decile,
        score: result.score,
      };
      if (currentId) completePayload.sessionId = currentId;
      try {
        const res = await fetch("/api/sessions/upsert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(completePayload),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error("[sessions/upsert] complete failed:", res.status, json);
        }
      } catch (_) {}
      if (typeof window !== "undefined") sessionStorage.removeItem(SESSION_STORAGE_KEY);
      sessionIdRef.current = null;
      setSessionId(null);
      setDecileResult(result);
      setShowResults(true);
    }
  };

  const goBack = () => {
    if (showResults) setShowResults(false);
    else if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    if (step === 1) {
      return (
        formData.gender &&
        formData.full_name?.trim() &&
        formData.age?.trim() &&
        formData.residence?.trim() &&
        formData.household_size?.trim() &&
        formData.phone?.trim() &&
        formData.email?.trim()
      );
    }
    if (step === 2) {
      return (
        formData.employment &&
        formData.family_income &&
        formData.own_capital &&
        formData.investments_abroad !== undefined &&
        formData.has_land !== undefined
      );
    }
    if (step === 3) {
      return (
        formData.property_status &&
        formData.pension_checked !== undefined &&
        formData.mortgage_pct !== undefined &&
        formData.mortgage_pct !== "" &&
        formData.insurance_pct !== undefined &&
        formData.insurance_pct !== ""
      );
    }
    return false;
  };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-l from-sky-300 via-cyan-200 to-amber-200 bg-clip-text text-transparent">
            סימולטור הערכת מצב פיננסי
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            ענו על השאלות וקבלו הערכה באיזה עשירון אתם
          </p>
        </motion.header>

        {/* Progress & Decile meter (not on results) */}
        {!showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>מסך {step} מתוך {totalSteps}</span>
              {currentDecile != null && (
                <span className="text-sky-300">הערכה נוכחית: עשירון {currentDecile}</span>
              )}
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-l from-sky-500 to-cyan-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            {currentDecile != null && (
              <DecileMeter decile={currentDecile} compact />
            )}
          </motion.div>
        )}

        {/* Form screens */}
        <AnimatePresence mode="wait">
          {showResults && decileResult ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResultsView
                formData={formData}
                decile={decileResult.decile}
                score={decileResult.score}
                maxScore={decileResult.maxScore}
                distribution={decileResult.distribution}
                onBack={goBack}
              />
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              {step === 1 && (
                <Screen1Personal formData={formData} update={update} />
              )}
              {step === 2 && (
                <Screen2Capital formData={formData} update={update} />
              )}
              {step === 3 && (
                <Screen3Family formData={formData} update={update} />
              )}

              <div className="flex gap-3 mt-8 flex-row-reverse">
                {saveError && (
                  <div className="rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 text-sm">
                    שמירה נכשלה: {saveError}
                  </div>
                )}
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step === totalSteps ? "סיום וצפייה בתוצאה" : "המשך"}
                </button>
                {step > 1 && (
                  <button type="button" onClick={goBack} className="btn-secondary">
                    חזרה
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
