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
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-violet-200 to-fuchsia-200 mb-6">השקעות ונכסים פיננסיים</h2>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-2">אימייל</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => update({ email: e.target.value })}
          className="input-glass"
          placeholder="כתובת אימייל"
        />
        <p className="text-slate-500 text-xs mt-1">את הדוח מהשלבים הבאים אנו שולחים למייל. במידה שתרצה לקבל לשם את המידע – הכנס את המייל שלך.</p>
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-3">האם יש בבעלותך דירה?</label>
        <div className="space-y-2">
          {[
            { value: "none", label: "אין לי דירה" },
            { value: "one", label: "דירה אחת למגורים" },
            { value: "two_plus", label: "2 דירות ומעלה" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ property_status: opt.value })}
              className={`choice-card w-full ${formData.property_status === opt.value ? "selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-3">האם יש לך כסף שמושקע בשוק ההון?</label>
        <div className="flex gap-3 flex-wrap">
          {[
            { value: "under_half_m", label: "מתחת לחצי מיליון" },
            { value: "over_half_m", label: "מעל חצי מיליון" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ stock_market: opt.value })}
              className={`choice-card flex-1 min-w-[140px] ${formData.stock_market === opt.value ? "selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-3">האם ברשותך השקעות מעבר לים?</label>
        <div className="flex gap-3">
          {[
            { value: true, label: "כן" },
            { value: false, label: "לא" },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => update({ investments_abroad: opt.value, investments_abroad_scope: opt.value ? formData.investments_abroad_scope : "" })}
              className={`choice-card flex-1 ${formData.investments_abroad === opt.value ? "selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {formData.investments_abroad === true && (
          <div className="mt-3 flex gap-3 flex-wrap">
            {[
              { value: "over_200k", label: "היקף מעל 200 אלף דולר" },
              { value: "under_200k", label: "היקף מתחת ל-200 אלף דולר" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ investments_abroad_scope: opt.value })}
                className={`choice-card flex-1 min-w-[140px] py-2 text-sm ${formData.investments_abroad_scope === opt.value ? "selected" : ""}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-3">האם ברשותך קרקעות?</label>
        <div className="flex gap-3">
          {[
            { value: true, label: "כן" },
            { value: false, label: "לא" },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => update({ has_land: opt.value })}
              className={`choice-card flex-1 ${formData.has_land === opt.value ? "selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-3">האם ברשותך פיקדון בנקרי או קרן כספית?</label>
        <div className="flex gap-3">
          {[
            { value: true, label: "כן" },
            { value: false, label: "לא" },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => update({ has_deposits: opt.value, deposits_scope: opt.value ? formData.deposits_scope : "" })}
              className={`choice-card flex-1 ${formData.has_deposits === opt.value ? "selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {formData.has_deposits === true && (
          <div className="mt-3">
            <label className="block text-xs text-slate-500 mb-2">מה היקף ההשקעות?</label>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: "scope_1", label: "עד 500,000 ₪" },
                { value: "scope_2", label: "מעל 500,000 ₪" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ deposits_scope: opt.value })}
                  className={`choice-card flex-1 min-w-[100px] py-2 text-sm ${formData.deposits_scope === opt.value ? "selected" : ""}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
