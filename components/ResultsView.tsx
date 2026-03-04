"use client";

import { motion } from "framer-motion";
import { DecileMeter } from "./DecileMeter";
import type { FormState } from "@/lib/types";
import {
  getCategoryScores,
  getProfileSummary,
  getInsights,
  getDecileComparison,
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-6 sm:p-8 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-center bg-gradient-to-l from-amber-200 to-yellow-300 bg-clip-text text-transparent mb-2">
        התוצאה שלך
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
          className="text-6xl sm:text-7xl font-bold text-sky-300"
        >
          עשירון {decile}
        </motion.span>
        <p className="text-slate-400 mt-2">
          ציון {score} מתוך {maxScore}
        </p>
      </div>

      <DecileMeter decile={decile} />

      {/* Distribution over deciles (Bayesian result) */}
      {distribution && distribution.length === 10 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-400 mb-2 text-center">
            התפלגות ההסתברות לעשירונים
          </h3>
          <div className="flex gap-0.5 h-8 items-end justify-center" dir="ltr">
            {distribution.map((p, i) => (
              <motion.div
                key={i}
                className="flex-1 min-w-0 rounded-t bg-sky-500/70 hover:bg-sky-400/80 transition"
                title={`עשירון ${i + 1}: ${(p * 100).toFixed(1)}%`}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(8, p * 100)}%` }}
                transition={{ delay: 0.2 + i * 0.02, duration: 0.4 }}
                style={{ alignSelf: "flex-end" }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-slate-500" dir="ltr">
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
        <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sm text-slate-200 text-center">
          <span className="text-sky-300 font-medium">השוואה: </span>
          {comparisonText}
        </div>

        {/* Category breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-cyan-400">▸</span> פירוט לפי תחומים
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
                    className="h-full rounded-full bg-gradient-to-l from-cyan-500 to-sky-400"
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
            <span className="text-amber-400">▸</span> הפרופיל הפיננסי שלך
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profileSummary.map((p, i) => (
              <motion.div
                key={p.label}
                variants={item}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3"
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
                        ? "bg-sky-500/10 border border-sky-400/20 text-sky-100"
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
          className="mt-8 block p-5 rounded-2xl border-2 border-amber-400/30 bg-gradient-to-br from-amber-500/15 to-sky-500/10 hover:from-amber-500/25 hover:to-sky-500/20 hover:border-amber-400/50 transition-all duration-300 group"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold text-amber-200 group-hover:text-amber-100">
                רוצים לקחת את המצב הפיננסי שלכם צעד קדימה?
              </p>
              <p className="text-sm text-slate-300 mt-1">
                קבוצת ברק פיננסים – פתרונות בנדל&quot;ן, השקעות, משכנתאות, ביטוח ופנסיה במקום אחד. פגישת היכרות וייעוץ מותאם אישית.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 text-amber-200 font-medium group-hover:bg-amber-500/30 shrink-0">
              לגלות עוד באתר
              <span className="group-hover:translate-x-1 transition-transform" aria-hidden>←</span>
            </span>
          </div>
        </motion.a>
      </motion.div>

      <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 text-center">
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
