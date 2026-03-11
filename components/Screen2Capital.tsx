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

function useWording(gender: string) {
  const isFemale = gender === "female";
  return {
    your: isFemale ? "שלך" : "שלך",
  };
}

export function Screen2Capital({
  formData,
  update,
}: {
  formData: FormState;
  update: (u: Partial<FormState>) => void;
}) {
  const wording = useWording(formData.gender);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-violet-200 to-fuchsia-200 mb-6">
        אפיון והון משפחתי
      </h2>

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-2">גיל / קבוצת גיל</label>
        <input
          type="text"
          value={formData.age}
          onChange={(e) => update({ age: e.target.value })}
          className="input-glass"
          placeholder="גיל או קבוצת גיל (למשל 35 או 30–40)"
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

      <motion.div variants={item}>
        <label className="block text-sm font-semibold text-slate-300 mb-2">מספר נפשות בבית</label>
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
          האם ההכנסה המשפחתית {wording.your}:
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
          האם ברשותך הון עצמי בפיקדונות הבנקים או בקרן כספית שטרם מצאת לו ייעוד או טרם השקעת אותו? ברשותי הכנסה פנויה של:
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
