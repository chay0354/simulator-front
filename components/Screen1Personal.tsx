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

export function Screen1Personal({
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
      <div className="mb-6">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-violet-200 to-fuchsia-200 mb-3">
          ברוך הבא לסימולטור משפחות
        </h2>
        <div className="rounded-2xl border-2 border-violet-500/20 bg-violet-500/5 px-4 py-3.5">
          <p className="text-slate-300 text-sm leading-relaxed">
            נתוני הסימולטור מבוססים על <span className="text-violet-200 font-medium">מידע אמיתי</span> ומושווים לדאטה של{" "}
            <span className="text-fuchsia-200 font-medium">ברק פיננסים</span> ומקורות נוספים. תקבל הערכה לאיזה{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-violet-200 to-fuchsia-200 font-semibold">עשירון משקי</span> אתה שייך.
          </p>
        </div>
      </div>

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
        <p className="text-slate-500 text-xs mt-1.5">* התוצאות ישלחו לטלפון – שימלאו את המספר הנכון.</p>
      </motion.div>
    </motion.div>
  );
}
