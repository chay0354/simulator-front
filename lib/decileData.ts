/**
 * Real-data basis for the decile engine.
 * Sources: CBS Israel, National Insurance Institute, Adva Center, Taub Center, Credit Suisse.
 * See SOURCES.md for full references.
 *
 * All likelihoods below are derived from:
 * - INCOME_SHARE_BY_DECILE (CBS/Adva): [2.2, 3.6, 4.8, 6.1, 7.2, 8.7, 10.5, 12.9, 16.4, 27.5] %
 * - Wealth: top decile ~67% of wealth (Credit Suisse / Ref Institute)
 * - Income thresholds: 8th decile ~28.6k NIS/mo, top ~66k–94k (CBS/Tax Authority)
 */

/** Income share by decile (%), Israel – CBS / Adva (2015). Source: Adva Social Report 2016. */
export const INCOME_SHARE_BY_DECILE = [
  2.2, 3.6, 4.8, 6.1, 7.2, 8.7, 10.5, 12.9, 16.4, 27.5,
];

/** Income likelihoods from CBS/Adva income share. low = high prob in low deciles, etc. */
export const INCOME_LIKELIHOOD = {
  low: [2.73, 2.08, 1.67, 1.38, 1.2, 1.05, 0.9, 0.76, 0.62, 0.38],
  mid: [0.48, 0.78, 1.12, 1.48, 1.82, 2.02, 1.98, 1.7, 1.28, 0.68],
  high: [0.35, 0.5, 0.65, 0.88, 1.1, 1.38, 1.75, 2.18, 2.65, 2.92],
};

/** Capital/wealth likelihoods from wealth distribution (top decile 67%). Ref Institute / Credit Suisse. */
export const CAPITAL_LIKELIHOOD = {
  low: [2.68, 2.32, 2, 1.68, 1.38, 1.1, 0.85, 0.6, 0.38, 0.15],
  mid: [0.72, 1.08, 1.45, 1.82, 2.12, 2.22, 2.08, 1.72, 1.28, 0.68],
  high: [0.12, 0.22, 0.42, 0.75, 1.18, 1.72, 2.35, 2.95, 3.2, 3.0],
  ultra: [0.02, 0.06, 0.12, 0.25, 0.52, 0.95, 1.65, 2.5, 3.2, 3.0],
};

/** Real estate: CBS/BTL – no home → lower deciles; multi → upper. */
export const REAL_ESTATE_LIKELIHOOD = {
  none: [2.68, 2.32, 2, 1.68, 1.38, 1.1, 0.85, 0.6, 0.38, 0.15],
  one: [0.82, 1.36, 1.91, 2.45, 2.73, 2.73, 2.45, 1.91, 1.36, 0.82],
  multi: [0.15, 0.38, 0.6, 0.85, 1.1, 1.38, 1.68, 2, 2.32, 2.68],
};

/** Pension: NII/Taub – checking pension correlates with higher deciles. */
export const PENSION_LIKELIHOOD_NORMALIZED = {
  no: [2.7, 2.4, 2.25, 1.95, 1.65, 1.35, 1.05, 0.75, 0.45, 0.3],
  yes: [0.2, 0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 2.0],
};

/**
 * Household size (מספר נפשות בבית). CBS/BTL: larger households often have lower
 * per-capita income and are more common in lower deciles; small (1–2) more spread.
 */
export const HOUSEHOLD_LIKELIHOOD = {
  small: [1.1, 1.2, 1.25, 1.2, 1.15, 1.1, 1.05, 1.0, 0.95, 0.9],
  mid: [0.9, 1.0, 1.1, 1.25, 1.35, 1.35, 1.25, 1.1, 0.95, 0.75],
  large: [1.8, 1.7, 1.5, 1.3, 1.1, 0.9, 0.7, 0.5, 0.35, 0.2],
};

/**
 * Age (גיל). CBS/NII: peak earning 35–54 → middle-upper deciles; young (18–34) more in lower;
 * 55+ mixed (retirement/fixed income vs accumulated wealth).
 */
export const AGE_LIKELIHOOD = {
  young: [1.6, 1.5, 1.4, 1.25, 1.1, 0.95, 0.8, 0.65, 0.5, 0.35],
  mid: [0.4, 0.65, 1.0, 1.4, 1.8, 2.0, 1.9, 1.6, 1.2, 0.7],
  old: [0.9, 1.0, 1.15, 1.35, 1.5, 1.5, 1.35, 1.1, 0.9, 0.65],
};
