
export const TAX_CONSTANTS = {
  NEW_REGIME_STANDARD_DEDUCTION: 75000,
  OLD_REGIME_STANDARD_DEDUCTION: 50000,
  SECTION_80C_LIMIT: 150000,
  SECTION_80D_LIMIT: 25000,
  SECTION_80D_SENIOR_LIMIT: 50000,
  SECTION_80TTA_LIMIT: 10000,
  SECTION_80TTB_LIMIT: 50000,
  NPS_EXTRA_LIMIT: 50000,
  CESS_RATE: 0.04,
  NEW_REGIME_REBATE_LIMIT: 1200000, // Nil tax up to 12L income in New Regime
  OLD_REGIME_REBATE_LIMIT: 500000,
};

// FY 2025-26 (AY 2026-27) - Revised New Slabs
export const NEW_REGIME_SLABS = [
  { limit: 400000, rate: 0 },
  { limit: 800000, rate: 0.05 },
  { limit: 1200000, rate: 0.10 },
  { limit: 1600000, rate: 0.15 },
  { limit: 2400000, rate: 0.20 },
  { limit: Infinity, rate: 0.30 },
];

export const OLD_REGIME_SLABS = [
  { limit: 250000, rate: 0 },
  { limit: 500000, rate: 0.05 },
  { limit: 1000000, rate: 0.20 },
  { limit: Infinity, rate: 0.30 },
];
