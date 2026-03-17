"use client";

import { motion } from "framer-motion";
import { LabelWithTooltip } from "@/components/LabelWithTooltip";
import type { FormState, FormUpdateFn } from "@/lib/types";

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

const TOOLTIP_HOUSEHOLD = "כמות האנשים שגרים איתך בבית (כולל ילדים).";
const TOOLTIP_INCOME = "ההכנסה הנקייה של כל בני הבית יחד (משכורות, עסק, ריבית וכו') לפני מס.";
const TOOLTIP_CAPITAL = 'כסף נזיל בפיקדונות או בקרן כספית שטרם הושקע במניות או נדל"ן.';

type Screen2CapitalProps = {
  formData: FormState;
  update: FormUpdateFn;
};

export function Screen2Capital({ formData, update }: Screen2CapitalProps) {
  const phoneDigits = (formData.phone || "").replace(/\D/g, "");
  const phoneValid = phoneDigits.length >= 9 && phoneDigits.length <= 10;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 10);
    update({ phone: v });
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-barak-200 to-barak-100 mb-6">
        אפיון והון משפחתי
      </h2>

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
          inputMode="numeric"
          value={formData.phone}
          onChange={handlePhoneChange}
          className="input-glass"
          placeholder="מס׳ טלפון (9–10 ספרות)"
        />
        {formData.phone && !phoneValid && (
          <p className="text-barak-400 text-xs mt-1">נא להזין 9–10 ספרות בלבד</p>
        )}
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          <LabelWithTooltip label="מספר נפשות בבית" tooltip={TOOLTIP_HOUSEHOLD} />
        </label>
        <input
          type="number"
          min={1}
          max={20}
          value={formData.household_size}
          onChange={(e) => update({ household_size: e.target.value })}
          className="input-glass"
          placeholder="כמות"
        />
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-3">
          <LabelWithTooltip
            label="האם ההכנסה המשפחתית ברוטו:"
            tooltip={TOOLTIP_INCOME}
          />
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
              className={`choice-card w-full ${formData.family_income === opt.value ? "selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-3">
          <LabelWithTooltip
            label="האם ברשותך הון עצמי בפיקדונות הבנקים או בקרן כספית שטרם מצאת לו ייעוד או טרם השקעת אותו? ברשותי סכום פנוי של:"
            tooltip={TOOLTIP_CAPITAL}
          />
        </label>
        <div className="space-y-2">
          {[
            { value: "under_250", label: "פחות מ-250,000" },
            { value: "250_500", label: "בין 250,000–500,000" },
            { value: "over_500", label: "מעל 500,000" },
            { value: "over_1m", label: "מעל מיליון" },
            { value: "over_5m", label: "אני ממש עשיר – מעל 5 מיליון" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ own_capital: opt.value })}
              className={`choice-card w-full ${formData.own_capital === opt.value ? "selected" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
