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
      <h2 className="text-xl font-bold text-sky-200 mb-6">פרטים אישיים</h2>

      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-2">זכר / נקבה</label>
        <div className="flex gap-3">
          {[
            { value: "male", label: "זכר" },
            { value: "female", label: "נקבה" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ gender: opt.value })}
              className={`flex-1 py-3 rounded-xl border transition ${
                formData.gender === opt.value
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
        <label className="block text-sm font-medium text-slate-300 mb-2">שם מלא</label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => update({ full_name: e.target.value })}
          className="input-glass"
          placeholder="הכנס את שמך המלא"
        />
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-2">גיל</label>
        <input
          type="number"
          min={18}
          max={120}
          value={formData.age}
          onChange={(e) => update({ age: e.target.value })}
          className="input-glass"
          placeholder="גיל"
        />
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-2">מקום מגורים</label>
        <input
          type="text"
          value={formData.residence}
          onChange={(e) => update({ residence: e.target.value })}
          className="input-glass"
          placeholder="עיר / יישוב"
        />
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-2">מספר נפשות בבית</label>
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
        <label className="block text-sm font-medium text-slate-300 mb-2">טלפון</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => update({ phone: e.target.value })}
          className="input-glass"
          placeholder="מס׳ טלפון"
        />
      </motion.div>

      <motion.div variants={item}>
        <label className="block text-sm font-medium text-slate-300 mb-2">אימייל</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => update({ email: e.target.value })}
          className="input-glass"
          placeholder="כתובת אימייל"
        />
      </motion.div>
    </motion.div>
  );
}
