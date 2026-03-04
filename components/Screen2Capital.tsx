"use client";

import { motion } from "framer-motion";
import type { FormState } from "@/lib/types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function Screen2Capital({
  formData,
  update,
}: {
  formData: FormState;
  update: (u: Partial<FormState>) => void;
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-sky-200 mb-6">הון עצמי</h2>

      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          האם אתה שכיר / עצמאי?
        </label>
        <div className="flex gap-3">
          {[
            { value: "employee", label: "שכיר" },
            { value: "self", label: "עצמאי" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ employment: opt.value })}
              className={`flex-1 py-3 rounded-xl border transition ${
                formData.employment === opt.value
                  ? "border-sky-400 bg-sky-500/20 text-sky-200"
                  : "border-white/20 bg-white/5 text-slate-400 hover:border-white/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          האם ההכנסה המשפחתית שלך:
        </label>
        <div className="space-y-2">
          {[
            { value: "under_25", label: "פחות מ-25,000" },
            { value: "25_50", label: "בין 25,000–50,000" },
            { value: "over_50", label: "מעל 50,000" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ family_income: opt.value })}
              className={`w-full py-3 rounded-xl border transition text-right px-4 ${
                formData.family_income === opt.value
                  ? "border-sky-400 bg-sky-500/20 text-sky-200"
                  : "border-white/20 bg-white/5 text-slate-400 hover:border-white/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          האם ברשותך הון עצמי בפיקדונות הבנקים או בקרן כספית שטרם הושקע?
        </label>
        <div className="space-y-2">
          {[
            { value: "under_250", label: "פחות מ-250,000" },
            { value: "250_500", label: "בין 250,000–500,000" },
            { value: "over_500", label: "מעל 500,000" },
            { value: "over_1m", label: "מעל מיליון" },
            { value: "over_5m", label: "מעל 5 מיליון" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ own_capital: opt.value })}
              className={`w-full py-3 rounded-xl border transition text-right px-4 ${
                formData.own_capital === opt.value
                  ? "border-sky-400 bg-sky-500/20 text-sky-200"
                  : "border-white/20 bg-white/5 text-slate-400 hover:border-white/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          האם ברשותך השקעות מעבר לים?
        </label>
        <div className="flex gap-3">
          {[
            { value: true, label: "כן" },
            { value: false, label: "לא" },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => update({ investments_abroad: opt.value })}
              className={`flex-1 py-3 rounded-xl border transition ${
                formData.investments_abroad === opt.value
                  ? "border-sky-400 bg-sky-500/20 text-sky-200"
                  : "border-white/20 bg-white/5 text-slate-400 hover:border-white/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          האם ברשותך קרקעות?
        </label>
        <div className="flex gap-3">
          {[
            { value: true, label: "כן" },
            { value: false, label: "לא" },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => update({ has_land: opt.value })}
              className={`flex-1 py-3 rounded-xl border transition ${
                formData.has_land === opt.value
                  ? "border-sky-400 bg-sky-500/20 text-sky-200"
                  : "border-white/20 bg-white/5 text-slate-400 hover:border-white/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
