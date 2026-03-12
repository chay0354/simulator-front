"use client";

import { motion } from "framer-motion";
import { LabelWithTooltip } from "@/components/LabelWithTooltip";
import type { FormState, FormUpdateFn } from "@/lib/types";

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

const WHEN_OPTIONS = [
  { value: "last_year", label: "בשנה האחרונה" },
  { value: "two_years_ago", label: "לפני שנתיים" },
  { value: "help_me", label: "לא ביצעתי בכלל – אין לי מושג, תעזרו לי לגלות" },
];

type Screen4InsuranceProps = { formData: FormState; update: FormUpdateFn };

export function Screen4Insurance({ formData, update }: Screen4InsuranceProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-violet-200 to-fuchsia-200 mb-6">משכנתאות וביטוחים</h2>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-3">
          <LabelWithTooltip
            label="האם אתה משלם משכנתא?"
            tooltip="החזר חודשי לבנק על הלוואה לרכישת דירה."
          />
        </label>
        <div className="flex gap-3">
          {[
            { value: true, label: "כן" },
            { value: false, label: "לא" },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => update({ mortgage_pays: opt.value, mortgage_amount: opt.value ? formData.mortgage_amount : "" })}
              className={`choice-card flex-1 ${formData.mortgage_pays === opt.value ? "selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {formData.mortgage_pays === true && (
          <div className="mt-3 flex gap-3 flex-wrap">
            {[
              { value: "up_5k", label: "עד 5,000" },
              { value: "5k_10k", label: "יותר מ-5,000" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ mortgage_amount: opt.value })}
                className={`choice-card flex-1 min-w-[120px] py-2 text-sm ${formData.mortgage_amount === opt.value ? "selected" : ""}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-3">
          <LabelWithTooltip
            label="האם ביצעת טיוב לתיק ההשקעות הביטחוני והפנסיוני שלך?"
            tooltip="בדיקה שהחיסכון הפנסיוני והביטוחים מתאימים לך ומנוהלים במחיר סביר."
          />
        </label>
        <div className="space-y-2">
          {[
            { value: "yes_last_year", label: "כן, בשנה האחרונה" },
            { value: "over_2_years", label: "לפני יותר משנתיים" },
            { value: "help_me", label: "אין לי מושג – תעזרו לי לגלות" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ pension_optimization: opt.value })}
              className={`choice-card w-full ${formData.pension_optimization === opt.value ? "selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {formData.pension_optimization === "help_me" && (
          <p className="text-slate-500 text-xs mt-2">הן סוכנות מטעם משרד האוצר. צריך לעלות ת״ז ואנו נשלח מכתב להחתמה להתקדם משם לבדיקת התיק הפנסיוני.</p>
        )}
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-3">
          <LabelWithTooltip
            label="האם ביצעת ייעוץ מס / החזרי מס?"
            tooltip='פגישה עם יועץ או רו"ח להחזר מס או תכנון מס.'
          />
        </label>
        <div className="flex gap-3">
          {[
            { value: true, label: "כן" },
            { value: false, label: "לא" },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => update({ tax_consulting: opt.value, tax_consulting_when: opt.value ? formData.tax_consulting_when : "" })}
              className={`choice-card flex-1 ${formData.tax_consulting === opt.value ? "selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {formData.tax_consulting === true && (
          <div className="mt-3 space-y-2">
            <label className="block text-xs text-slate-500">מתי ביצעת בפעם האחרונה?</label>
            {WHEN_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ tax_consulting_when: opt.value })}
                className={`choice-card w-full py-2 text-sm ${formData.tax_consulting_when === opt.value ? "selected" : ""}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-3">
          <LabelWithTooltip
            label="האם ביצעת אי פעם מינופים פיננסיים מקופות הגמל שלך?"
            tooltip="נטילת הלוואה כנגד הצבירה בקופת גמל (למשל לרכישת דירה)."
          />
        </label>
        <div className="flex gap-3">
          {[
            { value: true, label: "כן" },
            { value: false, label: "לא" },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => update({ provident_withdrawals: opt.value, provident_when: opt.value ? formData.provident_when : "" })}
              className={`choice-card flex-1 ${formData.provident_withdrawals === opt.value ? "selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {formData.provident_withdrawals === true && (
          <div className="mt-3 space-y-2">
            <label className="block text-xs text-slate-500">מתי ביצעת בפעם האחרונה?</label>
            {WHEN_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ provident_when: opt.value })}
                className={`choice-card w-full py-2 text-sm ${formData.provident_when === opt.value ? "selected" : ""}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
