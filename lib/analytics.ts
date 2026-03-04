import type { FormState } from "./types";

export interface CategoryScore {
  id: string;
  label: string;
  score: number;
  max: number;
  description: string;
}

export interface ProfileSummaryItem {
  label: string;
  value: string;
  icon: string;
}

export interface Insight {
  type: "tip" | "good" | "warning" | "info";
  text: string;
}

const INCOME_LABELS: Record<string, string> = {
  under_25: "פחות מ-25,000 ₪",
  "25_50": "בין 25,000–50,000 ₪",
  over_50: "מעל 50,000 ₪",
};

const CAPITAL_LABELS: Record<string, string> = {
  under_250: "פחות מ-250,000 ₪",
  "250_500": "בין 250,000–500,000 ₪",
  over_500: "מעל 500,000 ₪",
  over_1m: "מעל מיליון ₪",
  over_5m: "מעל 5 מיליון ₪",
};

const PROPERTY_LABELS: Record<string, string> = {
  none: "אין דירה בבעלות",
  one: "דירה אחת למגורים",
  two_plus: "2 דירות ומעלה",
};

export function getCategoryScores(formData: FormState): CategoryScore[] {
  const mortgage = formData.mortgage_pct ? parseFloat(formData.mortgage_pct) : 0;
  const insurance = formData.insurance_pct ? parseFloat(formData.insurance_pct) : 0;

  const employmentScore = formData.employment === "self" ? 4 : formData.employment === "employee" ? 2 : 0;
  const incomeScore =
    formData.family_income === "under_25"
      ? 5
      : formData.family_income === "25_50"
        ? 15
        : formData.family_income === "over_50"
          ? 25
          : 0;
  const capitalScore =
    formData.own_capital === "under_250"
      ? 3
      : formData.own_capital === "250_500"
        ? 8
        : formData.own_capital === "over_500"
          ? 12
          : formData.own_capital === "over_1m"
            ? 18
            : formData.own_capital === "over_5m"
              ? 25
              : 0;
  const propertyScore =
    formData.property_status === "none"
      ? 0
      : formData.property_status === "one"
        ? 10
        : formData.property_status === "two_plus"
          ? 18
          : 0;
  const pensionScore = formData.pension_checked ? 4 : 0;
  const mortgageScore = mortgage <= 20 ? 6 : mortgage <= 35 ? 3 : 0;
  const insuranceScore =
    insurance >= 3 && insurance <= 10 ? 3 : insurance > 10 ? 1 : 0;
  const extrasScore =
    (formData.investments_abroad ? 8 : 0) + (formData.has_land ? 6 : 0);

  return [
    {
      id: "income",
      label: "הכנסה",
      score: employmentScore + incomeScore,
      max: 29,
      description: "סטטוס תעסוקה והכנסה משפחתית",
    },
    {
      id: "capital",
      label: "הון נזיל",
      score: capitalScore + extrasScore,
      max: 39,
      description: "פיקדונות, השקעות בחו\"ל וקרקעות",
    },
    {
      id: "property",
      label: "נדל\"ן",
      score: propertyScore,
      max: 18,
      description: "דירות בבעלות",
    },
    {
      id: "pension",
      label: "פנסיה ותשלומים",
      score: pensionScore + mortgageScore + insuranceScore,
      max: 13,
      description: "בדיקת פנסיה, משכנתא וביטוח",
    },
  ];
}

export function getProfileSummary(formData: FormState): ProfileSummaryItem[] {
  return [
    {
      label: "הכנסה משפחתית",
      value: INCOME_LABELS[formData.family_income] || "—",
      icon: "💰",
    },
    {
      label: "הון בפיקדונות",
      value: CAPITAL_LABELS[formData.own_capital] || "—",
      icon: "🏦",
    },
    {
      label: "דיור",
      value: PROPERTY_LABELS[formData.property_status] || "—",
      icon: "🏠",
    },
    {
      label: "שכיר / עצמאי",
      value: formData.employment === "self" ? "עצמאי" : formData.employment === "employee" ? "שכיר" : "—",
      icon: "💼",
    },
    {
      label: "השקעות בחו\"ל",
      value: formData.investments_abroad === true ? "כן" : formData.investments_abroad === false ? "לא" : "—",
      icon: "🌍",
    },
    {
      label: "קרקעות",
      value: formData.has_land === true ? "כן" : formData.has_land === false ? "לא" : "—",
      icon: "🪨",
    },
    {
      label: "בדקת פנסיה לאחרונה",
      value: formData.pension_checked === true ? "כן" : formData.pension_checked === false ? "לא" : "—",
      icon: "📊",
    },
    {
      label: "משכנתא (% מהשכר)",
      value: formData.mortgage_pct ? `${formData.mortgage_pct}%` : "—",
      icon: "📉",
    },
    {
      label: "ביטוח (% מהשכר)",
      value: formData.insurance_pct ? `${formData.insurance_pct}%` : "—",
      icon: "🛡️",
    },
  ];
}

export function getInsights(formData: FormState, decile: number): Insight[] {
  const insights: Insight[] = [];
  const mortgage = formData.mortgage_pct ? parseFloat(formData.mortgage_pct) : 0;
  const insurance = formData.insurance_pct ? parseFloat(formData.insurance_pct) : 0;
  const age = formData.age ? parseInt(formData.age, 10) : 0;
  const householdSize = formData.household_size ? parseInt(formData.household_size, 10) : 0;
  const isYoung = age >= 18 && age <= 34;
  const isMidAge = age >= 35 && age <= 54;
  const isOlder = age >= 55;
  const hasLowCapital =
    formData.own_capital && ["under_250", "250_500"].includes(formData.own_capital);
  const hasHighCapital =
    formData.own_capital && ["over_500", "over_1m", "over_5m"].includes(formData.own_capital);
  const largeHousehold = householdSize >= 5;

  // Strong position – keep momentum
  if (decile >= 7) {
    insights.push({
      type: "good",
      text: "המצב הפיננסי שלך לפי ההערכה חזק. שמרו על הרגלי חיסכון, פיזרו השקעות, ובדקו אחת לשנה שהתיק תואם את הסיכון והיעדים.",
    });
    if (formData.employment === "self" && hasHighCapital) {
      insights.push({
        type: "tip",
        text: "כעצמאי עם הון נזיל – כדאי להתייעץ עם רו\"ח על תכנון מס ופנסיה עצמאית (קרן השתלמות, ביטוח מנהלים, קופ\"ג).",
      });
    }
    if (formData.property_status === "two_plus") {
      insights.push({
        type: "info",
        text: "עם מספר נכסים – מומלץ לעדכן שווי ולהבין ח exposure למס שבח ולהיטל. יועץ נדל\"ן או רו\"ח יכולים לסייע.",
      });
    }
  }

  // Lower deciles – focus on foundations
  if (decile <= 3) {
    insights.push({
      type: "info",
      text: "התמקדו ביסודות: קרן חירום (3–6 חודשי הוצאות), צמצום חובות בריבית גבוהה, ובדיקת זכאות לקצבאות ולמענקים – באתר ביטוח לאומי ובמשרדים הממשלתיים.",
    });
    if (largeHousehold) {
      insights.push({
        type: "tip",
        text: "משק בית גדול – בדקו זכאות להנחות בארנונה, סיוע בשכר לימוד, ותוכניות סיוע לילדים (מחשב לכל ילד, קייטנות).",
      });
    }
    if (isYoung) {
      insights.push({
        type: "tip",
        text: "בגיל צעיר – התחלה מוקדמת של חיסכון פנסיוני (גם סכומים קטנים) משתלמת מאוד לאורך זמן. בדקו עם המעסיק הפקדות משלימות.",
      });
    }
  }

  // Pension
  if (formData.pension_checked === false) {
    insights.push({
      type: "tip",
      text: "בדיקת פנסיה: היכנסו לאתר ביטוח לאומי לבדיקת צבירה, והשוו דמי ניהול ותיקי קרן בין הגופים (גמל, ביטוח מנהלים). מומלץ לעדכן פעם בשנה.",
    });
  }

  // Mortgage
  if (mortgage > 35) {
    insights.push({
      type: "warning",
      text: "אחוז המשכנתא מההכנסה גבוה. מומלץ: לבדוק ריענון משכנתא (ריבית/תנאים), לשקול הארכת תקופה להקטנת תשלום חודשי, ולהימנע מלוואות נוספות עד ייצוב.",
    });
  }
  if (mortgage >= 20 && mortgage <= 35 && formData.property_status === "one") {
    insights.push({
      type: "info",
      text: "אם יש לכם עודף חודשי – פירעון מואץ של חלק מהמשכנתא (במיוחד מסלולים בריבית גבוהה) יכול לחסוך אלפי שקלים לאורך השנים.",
    });
  }

  // Insurance
  if (insurance > 0 && insurance < 3) {
    insights.push({
      type: "tip",
      text: "ביטוח משפחתי: כ־3%–7% מההכנסה נחשבים סביר. וודאו כיסוי למקרה אובדן כושר עבודה ולחיים – ובדקו שלא משלמים על כיסויים כפולים.",
    });
  }
  if (insurance > 12) {
    insights.push({
      type: "warning",
      text: "אחוז גבוה מההכנסה לביטוח – כדאי לעבור עם סוכן או יועץ על הפוליסות ולוודא שהכיסוי מתאים ושאתם לא משלמים על מוצרים מיותרים.",
    });
  }

  // Emergency fund / liquidity
  if (hasLowCapital && decile >= 4) {
    insights.push({
      type: "info",
      text: "קרן חירום: מומלץ 3–6 חודשי הוצאות בפיקדון או נזיל. התחלה עם חודש אחד ואז הגדלה הדרגתית מפחיתה חרדה ומאפשרת תגובה למשברים.",
    });
  }

  // First apartment
  if (formData.property_status === "none" && decile >= 4) {
    insights.push({
      type: "info",
      text: "רכישת דירה ראשונה: הכירו את מחיר למשתכן, הלוואות לזוגות צעירים ומסלולי משרד השיכון. חסכון קבוע (גם קטן) + רישום לרשימות מגדילים סיכוי.",
    });
  }
  if (formData.property_status === "none" && isYoung) {
    insights.push({
      type: "tip",
      text: "בצעו מעקב הוצאות חודשי (אפליקציה או גיליון) – כך תראו היכן ניתן לחסוך ליעד הדירה מבלי לפגוע באיכות החיים.",
    });
  }

  // Diversification
  if (hasHighCapital && formData.investments_abroad === false) {
    insights.push({
      type: "tip",
      text: "עם הון נזיל משמעותי – פיזור בין אפיקים (מניות, אג\"ח, קרנות) ומטבעות מקטין סיכון. יועץ השקעות או רו\"ח יכולים להתאים תיק לגיל וליעדים.",
    });
  }

  // Self-employed
  if (formData.employment === "self" && decile <= 6) {
    insights.push({
      type: "tip",
      text: "עצמאים: הפרידו בין חשבון עסקי לפרטי, והקצו לפחות 30% מהרווחים למס ולפנסיה. קרן חירום ל־6–12 חודשים מומלצת בגלל תזרים משתנה.",
    });
  }

  // Older age
  if (isOlder && formData.pension_checked === false) {
    insights.push({
      type: "warning",
      text: "מעל גיל 55 – בדיקת הפנסיה וההכנה לפרישה חשובות במיוחד. מומלץ לפנות לגוף המנהל את החיסכון ולבקש סימולציית פרישה.",
    });
  }

  // Fallback
  if (insights.length === 0) {
    insights.push({
      type: "info",
      text: "ההערכה מבוססת על הנתונים שהזנת. מומלץ להתייעץ עם יועץ פיננסי או רו\"ח לתכנון מותאם אישית.",
    });
  }

  return insights;
}

export function getDecileComparison(decile: number): string {
  const pctAbove = (10 - decile) * 10;
  const pctBelow = decile * 10;
  if (decile <= 2) return `כ־${pctAbove}% מהמשקי בית נחשבים למצב פיננסי חזק יותר.`;
  if (decile >= 9) return `כ־${pctBelow}% מהמשקי בית נחשבים למצב פיננסי נמוך יותר.`;
  return `כ־${pctAbove}% מעליך ו־כ־${pctBelow}% מתחתיך במדד ההערכה.`;
}
