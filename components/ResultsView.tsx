"use client";

import { motion } from "framer-motion";
import { DecileMeter } from "./DecileMeter";
import type { FormState } from "@/lib/types";
import {
  getCategoryScores,
  getProfileSummary,
  getInsights,
  getDecileComparison,
  getFinancialAnalytics,
} from "@/lib/analytics";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function ResultsView({
  formData,
  decile,
  score,
  maxScore,
  distribution,
  onBack,
}: {
  formData: FormState;
  decile: number;
  score: number;
  maxScore: number;
  distribution?: number[];
  onBack: () => void;
}) {
  const categoryScores = getCategoryScores(formData);
  const profileSummary = getProfileSummary(formData);
  const insights = getInsights(formData, decile);
  const comparisonText = getDecileComparison(decile);
  const financialAnalytics = getFinancialAnalytics(formData, decile);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-6 sm:p-8 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-center bg-gradient-to-l from-violet-200 via-fuchsia-200 to-violet-200 bg-clip-text text-transparent mb-2">
        🎉 התוצאה שלך
      </h2>
      <p className="text-slate-400 text-center text-sm mb-6">
        לפי התשובות שענית, ההערכה שלך היא:
      </p>

      {/* Main score + meter */}
      <div className="flex flex-col items-center mb-8">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-6xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-violet-200 to-fuchsia-300"
        >
          עשירון {decile}
        </motion.span>
        <p className="text-slate-400 mt-2">
          ציון {score} מתוך {maxScore}
        </p>
      </div>

      <DecileMeter decile={decile} />

      {/* Prominent CTA – Barak Finances */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-6"
      >
        <a
          href="https://www.barak-fin.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl border-2 border-violet-400/40 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 hover:from-violet-500/30 hover:to-fuchsia-500/30 hover:border-violet-300/50 text-violet-100 font-bold text-lg transition-all duration-200"
        >
          <span>ברק פיננסים – לאתר החברה</span>
          <span className="opacity-80" aria-hidden>←</span>
        </a>
        <p className="text-center text-slate-400 text-xs mt-2">
          השקעות, נדל&quot;ן, משכנתאות, ביטוח ופנסיה – פתרונות במקום אחד
        </p>
      </motion.div>

      {/* Distribution over deciles (Bayesian result) */}
      {distribution && distribution.length === 10 && (
        <div className="mt-6 py-4">
          <h3 className="text-sm font-medium text-slate-400 mb-3 text-center">
            התפלגות ההסתברות לעשירונים
          </h3>
          <div className="flex gap-0.5 items-end justify-center" dir="ltr" style={{ height: 120 }}>
            {distribution.map((p, i) => (
              <motion.div
                key={i}
                className="flex-1 min-w-0 rounded-t bg-violet-500/70 hover:bg-fuchsia-400/80 transition"
                title={`עשירון ${i + 1}: ${(p * 100).toFixed(1)}%`}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(8, p * 100)}%` }}
                transition={{ delay: 0.2 + i * 0.02, duration: 0.4 }}
                style={{ alignSelf: "flex-end" }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500" dir="ltr">
            <span>1</span>
            <span>10</span>
          </div>
        </div>
      )}

      {/* Comparison */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-8 space-y-6"
      >
        <div className="p-4 rounded-2xl bg-violet-500/10 border-2 border-violet-500/20 text-sm text-slate-200 text-center">
          <span className="text-violet-300 font-medium">השוואה: </span>
          {comparisonText}
        </div>

        {/* Real financial analytics */}
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-fuchsia-400">▸</span> אנליטיקה פיננסית – להבנת המצב שלך
          </h3>
          <div className="space-y-3">
            {financialAnalytics.map((m, i) => (
              <motion.div
                key={m.title}
                variants={item}
                className="p-4 rounded-2xl bg-white/5 border-2 border-violet-500/15"
              >
                <p className="text-xs font-medium text-violet-300 mb-1">{m.title}</p>
                <p className="text-slate-100 font-semibold">{m.value}</p>
                {m.subtext && (
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{m.subtext}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-fuchsia-400">▸</span> פירוט לפי תחומים
          </h3>
          <div className="space-y-4">
            {categoryScores.map((cat, i) => (
              <motion.div key={cat.id} variants={item}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{cat.label}</span>
                  <span className="text-slate-400 tabular-nums">
                    {cat.score}/{cat.max}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-l from-violet-500 to-fuchsia-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.score / cat.max) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Profile summary cards */}
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-violet-400">▸</span> הפרופיל הפיננסי שלך
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profileSummary.map((p, i) => (
              <motion.div
                key={p.label}
                variants={item}
                className="p-3 rounded-2xl bg-violet-500/5 border-2 border-violet-500/15 flex items-center gap-3"
              >
                <span className="text-2xl">{p.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">{p.label}</p>
                  <p className="text-sm font-medium text-slate-200 truncate">{p.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Insights / tips */}
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-emerald-400">▸</span> המלצות וטיפים
          </h3>
          <ul className="space-y-2">
            {insights.map((ins, i) => (
              <motion.li
                key={i}
                variants={item}
                className={`flex items-start gap-2 p-3 rounded-xl text-sm ${
                  ins.type === "good"
                    ? "bg-emerald-500/10 border border-emerald-400/20 text-emerald-100"
                    : ins.type === "warning"
                      ? "bg-amber-500/10 border border-amber-400/20 text-amber-100"
                      : ins.type === "tip"
                        ? "bg-violet-500/10 border border-violet-400/20 text-violet-100"
                        : "bg-slate-500/10 border border-slate-400/20 text-slate-200"
                }`}
              >
                <span>
                  {ins.type === "good"
                    ? "✓"
                    : ins.type === "warning"
                      ? "!"
                      : "•"}
                </span>
                <span>{ins.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* CTA – Barak Finances */}
        <motion.a
          href="https://www.barak-fin.com/"
          target="_blank"
          rel="noopener noreferrer"
          variants={item}
          className="mt-8 block p-5 rounded-2xl border-2 border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 hover:from-violet-500/25 hover:to-fuchsia-500/20 hover:border-violet-400/50 transition-all duration-300 group"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold text-violet-200 group-hover:text-violet-100">
                רוצים לקחת את המצב הפיננסי שלכם צעד קדימה?
              </p>
              <p className="text-sm text-slate-300 mt-1">
                קבוצת ברק פיננסים – פתרונות בנדל&quot;ן, השקעות, משכנתאות, ביטוח ופנסיה במקום אחד. פגישת היכרות וייעוץ מותאם אישית.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500/20 text-violet-200 font-medium group-hover:bg-violet-500/30 shrink-0">
              לגלות עוד באתר
              <span className="group-hover:translate-x-1 transition-transform" aria-hidden>←</span>
            </span>
          </div>
        </motion.a>
      </motion.div>

      <div className="mt-8 p-4 rounded-2xl bg-white/5 border-2 border-white/10 text-sm text-slate-400 text-center">
        זוהי הערכה כללית בהתבסס על הנתונים שהזנת. אין לראות בה ייעוץ השקעות או ייעוץ פיננסי.
      </div>

      <div className="mt-8 flex justify-center">
        <button type="button" onClick={onBack} className="btn-secondary">
          חזרה לשאלות
        </button>
      </div>
    </motion.div>
  );
}
