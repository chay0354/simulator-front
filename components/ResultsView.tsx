"use client";

import { motion } from "framer-motion";
import { DecileMeter } from "./DecileMeter";
import type { FormState, FormUpdateFn } from "@/lib/types";
import {
  getCategoryScores,
  getProfileSummary,
  getInsights,
  getDecileComparison,
  getFinancialAnalytics,
} from "@/lib/analytics";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

/** פירוט העשירונים – מקור: נוי */
const DECILE_EXPLANATION: Record<number, string> = {
  1: "עשירון 1: שלב הביסוס וההישרדות הכלכלית — המיקוד שלכם בשלב זה הוא ייצוב התזרים החודשי, סגירת התחייבויות קודמות ובניית שליטה על ההוצאות. המטרה הראשונה שלכם היא לעבור מתזרים הישרדותי לתזרים מאוזן, לפני שמתחילים לחשוב על צבירת הון או השקעות.",
  2: "עשירון 2: בניית יסודות ראשוניים — אתם נמצאים בשלב של בניית משמעת פיננסית. ישנה הכנסה שמכסה את ההוצאות הבסיסיות, אך עדיין אין פניות אמיתית לחיסכון משמעותי. היעד שלכם כעת הוא לייצר כרית ביטחון מינימלית למקרי חירום ולהתחיל לתכנן קדימה.",
  3: "עשירון 3: תחילת הצבירה והמעבר לחיסכון — מעבר הדרגתי מ\"לסגור את החודש\" להתנהלות מתוכננת. בשלב זה מתחיל להיווצר עודף תזרימי קטן המאפשר פתיחת חסכונות ראשוניים. האתגר כאן הוא לייצר עקביות ולהתחיל להבין את כוחה של הריבית דריבית, גם בסכומים קטנים.",
  4: "עשירון 4: מעמד הביניים הבסיסי — יש לכם יציבות תעסוקתית, תוכניות פנסיה פעילות, וכנראה גם התחייבות משמעותית כמו משכנתא על דירת מגורים. האתגר בעשירון הזה הוא שהכסף סגור ברובו בנכס הפיזי או בקרנות הפנסיה, ואין כמעט הון נזיל שניתן למנף או להשקיע בחוץ.",
  5: "עשירון 5: מרכז הכובד הכלכלי (הסטטוס קוו) — אתם נמצאים בדיוק באמצע. יש לכם הון התחלתי וחסכונות, אבל רוב מעמד הביניים בעשירון הזה נוטה לקפוא על השמרים. הכסף יושב בפיקדונות קטנים או בקרנות השתלמות, ומושפע ישירות מהאינפלציה. זה הזמן להתחיל לייצר אסטרטגיה שתפרוץ את תקרת הזכוכית.",
  6: "עשירון 6: תחילת הדרך להשקעות אקטיביות — נוצר אצלכם הון פנוי ראשוני, ואתם מבינים שעבודה קשה לבדה לא תייצר עושר. הבעיה היא שבעשירון הזה רוב המשקיעים עושים טעויות של פיזור יתר או השקעות ספקולטיביות קטנות. הצעד הבא שלכם הוא מעבר להשקעות מנוהלות ומתוכננות לטווח ארוך.",
  7: "עשירון 7: הפוטנציאל מתחיל להתעורר. מצבכם הפיננסי מבוסס. יש לכם תיק נכסים, נדל\"ן או הון נזיל פנוי. עם זאת, סביר להניח שהכסף שלכם מנוהל ב\"טייס אוטומטי\". הפוטנציאל האמיתי של העושר שלכם עדיין לא ממומש, והוא צמא להכוונה מקצועית שתתחיל לעשות סדר במוצרים הפנסיוניים ובהון הפנוי.",
  8: "עשירון 8: עושר בהתהוות, הון לא מנוצל. אתם נמצאים במקום מצוין, עם יכולת השתכרות גבוהה והון נזיל משמעותי. הבעיה? בעשירון הזה רוב הכסף \"ישן\" בבנק, נשחק מול האינפלציה, ומושפע מתנודתיות שוק ההון. זה השלב שבו חייבים להפסיק להתנהל לבד, ולהתחיל להסיט הון לנכסים ריאליים (כמו נדל\"ן וקרנות חוב) שמייצרים תזרים יציב.",
  9: "עשירון 9: משקיעי הפרימיום וה\"כסף החכם\" — צברתם הון נזיל משמעותי שפותח לכם דלתות שאחרים רק חולמים עליהן. אתם נמצאים בטריטוריה שדורשת גישה לאפיקי השקעה אלטרנטיביים, מחוץ לבורסה. ההון שלכם גדול מספיק כדי לדרוש תכנון פיננסי מתקדם, אופטימיזציית מס אגרסיבית, ושילוב יזמות נדל\"ן תחת מעטפת מוסדית.",
  10: "עשירון 10: העשירון העליון (פסגת העושר) — אתם בטופ של הפירמידה הכלכלית. ניהול הון ברמה הזו הוא כבר לא עניין של \"לבחור מניה\", אלא ניהול סיכונים חוצה דורות, גידור מוקפד ואסטרטגיית פמילי אופיס הוליסטית (Wealth Management). השלב הזה דורש זהות אינטרסים מוחלטת עם הגוף שמנהל לכם את הכסף, ונגישות לקרנות והשקעות נוסטרו אקסקלוסיביות.",
};

export function ResultsView({
  formData,
  decile,
  score,
  maxScore,
  distribution,
  onBack,
  update,
}: {
  formData: FormState;
  decile: number;
  score: number;
  maxScore: number;
  distribution?: number[];
  onBack: () => void;
  update?: FormUpdateFn;
}) {
  const categoryScores = getCategoryScores(formData);
  const profileSummary = getProfileSummary(formData);
  const insights = getInsights(formData, decile);
  const comparisonText = getDecileComparison(decile);
  const financialAnalytics = getFinancialAnalytics(formData, decile);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-6 sm:p-8 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-center bg-gradient-to-l from-barak-200 via-barak-100 to-barak-200 bg-clip-text text-transparent mb-2">
        🎉 התוצאה שלך
      </h2>
      <p className="text-slate-400 text-center text-sm mb-6">
        לפי התשובות שענית, ההערכה שלך היא:
      </p>

      {/* Main score + meter */}
      <div className="flex flex-col items-center mb-8">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-6xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-barak-200 to-barak-100"
        >
          עשירון {decile}
        </motion.span>
        <p className="text-slate-400 mt-2">
          ציון {score} מתוך {maxScore}
        </p>
      </div>

      <DecileMeter decile={decile} />

      {/* הסבר על העשירון – פירוט מלא לפי העשירון */}
      {DECILE_EXPLANATION[decile] && (
        <div className="mt-6 p-5 rounded-2xl bg-barak-700/15 border-2 border-barak-600/25 text-sm text-slate-200 text-right leading-relaxed">
          {DECILE_EXPLANATION[decile]}
        </div>
      )}

      {/* Distribution over deciles (Bayesian result) */}
      {distribution && distribution.length === 10 && (
        <div className="mt-6 py-4">
          <h3 className="text-sm font-medium text-slate-400 mb-3 text-center">
            התפלגות ההסתברות לעשירונים
          </h3>
          <div className="flex gap-0.5 items-end justify-center" dir="ltr" style={{ height: 120 }}>
            {distribution.map((p, i) => (
              <motion.div
                key={i}
                className="flex-1 min-w-0 rounded-t bg-barak-700/70 hover:bg-barak-600/80 transition"
                title={`עשירון ${i + 1}: ${(p * 100).toFixed(1)}%`}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(8, p * 100)}%` }}
                transition={{ delay: 0.2 + i * 0.02, duration: 0.4 }}
                style={{ alignSelf: "flex-end" }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500" dir="ltr">
            <span>1</span>
            <span>10</span>
          </div>
        </div>
      )}

      {/* Comparison */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-8 space-y-6"
      >
        <div className="p-4 rounded-2xl bg-barak-700/15 border-2 border-barak-600/25 text-sm text-slate-200 text-center">
          <span className="text-barak-300 font-medium">השוואה: </span>
          {comparisonText}
        </div>

        {/* Real financial analytics */}
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-barak-400">▸</span> אנליטיקה פיננסית – להבנת המצב שלך
          </h3>
          <div className="space-y-3">
            {financialAnalytics.map((m, i) => (
              <motion.div
                key={m.title}
                variants={item}
                className="p-4 rounded-2xl bg-white/5 border-2 border-barak-600/20"
              >
                <p className="text-xs font-medium text-barak-300 mb-1">{m.title}</p>
                <p className="text-slate-100 font-semibold">{m.value}</p>
                {m.subtext && (
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{m.subtext}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-barak-400">▸</span> פירוט לפי תחומים
          </h3>
          <div className="space-y-4">
            {categoryScores.map((cat, i) => (
              <motion.div key={cat.id} variants={item}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{cat.label}</span>
                  <span className="text-slate-400 tabular-nums">
                    {cat.score}/{cat.max}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-l from-barak-700 to-barak-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.score / cat.max) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Profile summary cards */}
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-barak-400">▸</span> הפרופיל הפיננסי שלך
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profileSummary.map((p, i) => (
              <motion.div
                key={p.label}
                variants={item}
                className="p-3 rounded-2xl bg-barak-700/10 border-2 border-barak-600/20 flex items-center gap-3"
              >
                <span className="text-2xl">{p.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">{p.label}</p>
                  <p className="text-sm font-medium text-slate-200 truncate">{p.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Insights / tips */}
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <span className="text-emerald-400">▸</span> המלצות וטיפים
          </h3>
          <ul className="space-y-2">
            {insights.map((ins, i) => (
              <motion.li
                key={i}
                variants={item}
                className={`flex items-start gap-2 p-3 rounded-xl text-sm ${
                  ins.type === "good"
                    ? "bg-emerald-500/10 border border-emerald-400/20 text-emerald-100"
                    : ins.type === "warning"
                      ? "bg-amber-500/10 border border-amber-400/20 text-amber-100"
                      : ins.type === "tip"
                        ? "bg-barak-700/15 border border-barak-600/25 text-barak-200"
                        : "bg-slate-500/10 border border-slate-400/20 text-slate-200"
                }`}
              >
                <span>
                  {ins.type === "good"
                    ? "✓"
                    : ins.type === "warning"
                      ? "!"
                      : "•"}
                </span>
                <span>{ins.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* אופציה לשיחה עם מומחה השקעות */}
        <motion.div variants={item} className="mt-8 p-5 rounded-2xl border-2 border-barak-600/30 bg-barak-700/10">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.wants_expert_call === true}
              onChange={(e) => update?.({ wants_expert_call: e.target.checked })}
              className="mt-1 w-5 h-5 rounded border-barak-500/50 bg-white/5 text-barak-700 focus:ring-barak-500"
            />
            <span className="text-slate-200 text-sm leading-relaxed">
              מעוניין/ת בשיחה עם מומחה השקעות שיעבור על תוצאות הדוח ויקיים איתי שיחה טלפונית לטובת ייעול מבנה ההון שלי.
            </span>
          </label>
        </motion.div>

        {/* לינק לברק פיננסים – בסוף */}
        <motion.a
          href="https://www.barak-fin.com/"
          target="_blank"
          rel="noopener noreferrer"
          variants={item}
          className="mt-6 block p-5 rounded-2xl border-2 border-barak-600/35 bg-gradient-to-br from-barak-700/20 to-barak-600/15 hover:from-barak-700/30 hover:to-barak-600/25 hover:border-barak-500/50 transition-all duration-300 group"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold text-barak-200 group-hover:text-barak-100">
                ברק פיננסים – לאתר החברה
              </p>
              <p className="text-sm text-slate-300 mt-1">
                השקעות, נדל&quot;ן, משכנתאות, ביטוח ופנסיה – פתרונות במקום אחד.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-barak-700/30 text-barak-200 font-medium group-hover:bg-barak-700/40 shrink-0">
              לגלות עוד באתר
              <span className="group-hover:translate-x-1 transition-transform" aria-hidden>←</span>
            </span>
          </div>
        </motion.a>
      </motion.div>

      <div className="mt-8 p-4 rounded-2xl bg-white/5 border-2 border-white/10 text-sm text-slate-400 text-center">
        זוהי הערכה כללית בהתבסס על הנתונים שהזנת. אין לראות בה ייעוץ השקעות או ייעוץ פיננסי.
      </div>

      <div className="mt-8 flex justify-center">
        <button type="button" onClick={onBack} className="btn-secondary">
          חזרה לשאלות
        </button>
      </div>
    </motion.div>
  );
}
