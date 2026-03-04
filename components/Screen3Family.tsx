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

export function Screen3Family({
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
      <h2 className="text-xl font-bold text-sky-200 mb-6">הון משפחתי</h2>

      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          האם יש בבעלותך דירה?
        </label>
        <div className="space-y-2">
          {[
            { value: "none", label: "אין" },
            { value: "one", label: "דירה אחת למגורים" },
            { value: "two_plus", label: "2 דירות ומעלה" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ property_status: opt.value })}
              className={`w-full py-3 rounded-xl border transition text-right px-4 ${
                formData.property_status === opt.value
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
          האם אתה יודע ובדקת את המצב הפנסיוני שלך לאחרונה?
        </label>
        <div className="flex gap-3">
          {[
            { value: true, label: "כן" },
            { value: false, label: "לא" },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => update({ pension_checked: opt.value })}
              className={`flex-1 py-3 rounded-xl border transition ${
                formData.pension_checked === opt.value
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
          מה גובה המשכנתא שלך באחוזים מהשכר?
        </label>
        <input
          type="number"
          min={0}
          max={100}
          step={0.5}
          value={formData.mortgage_pct}
          onChange={(e) => update({ mortgage_pct: e.target.value })}
          className="input-glass"
          placeholder="אחוזים (למשל 25)"
        />
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          מה גובה הביטוח המשפחתי שלך באחוזים מהשכר?
        </label>
        <input
          type="number"
          min={0}
          max={100}
          step={0.5}
          value={formData.insurance_pct}
          onChange={(e) => update({ insurance_pct: e.target.value })}
          className="input-glass"
          placeholder="אחוזים (למשל 5)"
        />
      </motion.div>
    </motion.div>
  );
}
