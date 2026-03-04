/**
 * Decile Engine – Bayesian update from likelihood tables.
 * Likelihoods are derived from real Israeli data (CBS, NII, Adva, Taub, Credit Suisse).
 * See lib/decileData.ts and SOURCES.md.
 */

import {
  INCOME_LIKELIHOOD,
  CAPITAL_LIKELIHOOD,
  REAL_ESTATE_LIKELIHOOD,
  HOUSEHOLD_LIKELIHOOD,
  AGE_LIKELIHOOD,
} from "./decileData";

const DECILES = 10;

/** Initial uniform distribution over deciles 1–10 */
export function initialDistribution(): number[] {
  return Array(DECILES).fill(0.1);
}

/** Likelihood tables from real data: P(answer | decile) per dimension */
export const likelihood = {
  income: INCOME_LIKELIHOOD,
  capital: CAPITAL_LIKELIHOOD,
  realEstate: REAL_ESTATE_LIKELIHOOD,
  household: HOUSEHOLD_LIKELIHOOD,
  age: AGE_LIKELIHOOD,
} as const;

/** Weights per dimension */
export const weights = {
  income: 1.5,
  capital: 2,
  realEstate: 1.5,
  household: 0.8,
  age: 0.7,
} as const;

/**
 * Update distribution: P_new[i] ∝ P[i] * L[i]^weight, then normalize.
 */
export function updateProbabilities(
  P: number[],
  L: number[],
  weight: number
): number[] {
  const newP = P.map((p, i) => p * Math.pow(L[i], weight));
  const sum = newP.reduce((a, b) => a + b, 0);
  if (sum === 0) return P;
  return newP.map((p) => p / sum);
}

/**
 * Expected decile (1–10): weighted average of (i+1) with weights P[i], rounded.
 */
export function getDecileFromDistribution(P: number[]): number {
  const weighted = P.reduce((sum, p, i) => sum + p * (i + 1), 0);
  return Math.round(weighted);
}

/** Map form family_income to likelihood key */
function incomeKey(family_income?: string): keyof typeof likelihood.income | null {
  if (family_income === "under_25") return "low";
  if (family_income === "25_50") return "mid";
  if (family_income === "over_50") return "high";
  return null;
}

/** Map form own_capital to likelihood key */
function capitalKey(own_capital?: string): keyof typeof likelihood.capital | null {
  if (own_capital === "under_250") return "low";
  if (own_capital === "250_500") return "mid";
  if (own_capital === "over_500" || own_capital === "over_1m") return "high";
  if (own_capital === "over_5m") return "ultra";
  return null;
}

/** Map form property_status to likelihood key */
function realEstateKey(property_status?: string): keyof typeof likelihood.realEstate | null {
  if (property_status === "none") return "none";
  if (property_status === "one") return "one";
  if (property_status === "two_plus") return "multi";
  return null;
}

/** Map form household_size (מספר נפשות בבית) to likelihood key: 1–2 small, 3–4 mid, 5+ large */
function householdKey(household_size?: string): keyof typeof likelihood.household | null {
  const n = household_size ? parseInt(household_size, 10) : NaN;
  if (Number.isNaN(n) || n < 1) return null;
  if (n <= 2) return "small";
  if (n <= 4) return "mid";
  return "large";
}

/** Map form age (גיל) to likelihood key: 18–34 young, 35–54 mid, 55+ old */
function ageKey(age?: string): keyof typeof likelihood.age | null {
  const n = age ? parseInt(age, 10) : NaN;
  if (Number.isNaN(n) || n < 18 || n > 120) return null;
  if (n <= 34) return "young";
  if (n <= 54) return "mid";
  return "old";
}

export interface DecileInput {
  family_income?: string;
  own_capital?: string;
  property_status?: string;
  household_size?: string;
  age?: string;
}

/**
 * Run the full decile engine: start from uniform P, apply all available
 * likelihood updates, return decile and distribution.
 * Works with partial answers (only updates for answered dimensions).
 */
export function calculateDecile(answers: DecileInput): {
  decile: number;
  distribution: number[];
  score: number;
  maxScore: number;
} {
  let P = initialDistribution();

  const inc = incomeKey(answers.family_income);
  if (inc) P = updateProbabilities(P, likelihood.income[inc], weights.income);

  const cap = capitalKey(answers.own_capital);
  if (cap) P = updateProbabilities(P, likelihood.capital[cap], weights.capital);

  const re = realEstateKey(answers.property_status);
  if (re) P = updateProbabilities(P, likelihood.realEstate[re], weights.realEstate);

  const hh = householdKey(answers.household_size);
  if (hh) P = updateProbabilities(P, likelihood.household[hh], weights.household);

  const age = ageKey(answers.age);
  if (age) P = updateProbabilities(P, likelihood.age[age], weights.age);

  const decile = Math.min(10, Math.max(1, getDecileFromDistribution(P)));

  return {
    decile,
    distribution: P,
    score: decile * 10,
    maxScore: 100,
  };
}
