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
      <motion.div variants={item} className="flex justify-center">
        <span className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-barak-700 to-barak-600 px-6 py-3.5 text-lg font-bold text-white shadow-lg shadow-barak-700/30">
          לבדיקת סטטוס העושר שלי
        </span>
      </motion.div>

      <motion.div
        variants={item}
        className="rounded-2xl border border-barak-600/30 bg-barak-700/10 px-4 py-3.5 flex gap-3 items-center"
      >
        <span className="shrink-0 w-10 h-10 rounded-xl bg-barak-700/25 flex items-center justify-center text-lg" aria-hidden>
          ?
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-barak-200">
            כדי לגלות באיזה <span className="font-semibold text-barak-200">עשירון משקי בית</span> אתה – המשך למלא את הפרטים בשלבים הבאים.
          </p>
          <p className="text-xs text-barak-300/80 mt-1">
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
        <label className="block text-sm font-semibold text-slate-300 mb-2">גיל</label>
        <input
          type="text"
          inputMode="numeric"
          value={formData.age}
          onChange={(e) => update({ age: e.target.value })}
          className="input-glass"
          placeholder="גיל (למשל 35)"
        />
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-2">מקום מגורים</label>
        <input
          type="text"
          value={formData.residence}
          onChange={(e) => update({ residence: e.target.value })}
          className="input-glass"
          placeholder="עיר / יישוב"
        />
      </motion.div>
    </motion.div>
  );
}
