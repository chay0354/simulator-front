"use client";

import { motion } from "framer-motion";
import type { FormState } from "@/lib/types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

type Screen1PersonalProps = {
  formData: FormState;
  update: (u: Partial<FormState>) => void;
};

export function Screen1Personal({ formData, update }: Screen1PersonalProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-violet-200 to-fuchsia-200 mb-3">
          ברוך הבא לסימולטור משפחות
        </h2>
      </div>

      <motion.div
        variants={item}
        className="rounded-2xl border border-violet-400/30 bg-violet-500/10 px-4 py-3.5 flex gap-3 items-center"
      >
        <span className="shrink-0 w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-lg" aria-hidden>
          ?
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-violet-200/95">
            כדי לגלות באיזה <span className="font-semibold text-violet-200">עשירון משקי בית</span> אתה – המשך למלא את הפרטים בשלבים הבאים.
          </p>
          <p className="text-xs text-violet-300/70 mt-1">
            ככל שתענה על יותר שאלות, נציג לך את העשירון המשוער שלך במדד.
          </p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-3">זכר / נקבה</label>
        <div className="flex gap-3">
          {[
            { value: "male", label: "זכר" },
            { value: "female", label: "נקבה" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ gender: opt.value })}
              className={`choice-card flex-1 ${formData.gender === opt.value ? "selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-3">שכיר / עצמאי</label>
        <div className="flex gap-3">
          {[
            { value: "employee", label: "שכיר" },
            { value: "self", label: "עצמאי" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ employment: opt.value })}
              className={`choice-card flex-1 ${formData.employment === opt.value ? "selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-2">שם מלא</label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => update({ full_name: e.target.value })}
          className="input-glass"
          placeholder="הכנס את שמך המלא"
        />
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-2">טלפון</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => update({ phone: e.target.value })}
          className="input-glass"
          placeholder="מס׳ טלפון"
        />
      </motion.div>
    </motion.div>
  );
}
