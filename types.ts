
export interface IncomeData {
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  bonus: number;
  lta: number;
  otherIncomeSalary: number;
  professionalTax: number;
  interestIncome: number;
  rentalIncome: number;
  dividendIncome: number;
  businessIncome: number;
  capitalGainsShort: number;
  capitalGainsLong: number;
}

export interface DeductionData {
  section80C: number;
  section80D: number;
  section80E: number;
  section80G: number;
  section80TTA: number;
  nps: number;
  homeLoanInterest: number;
  rentPaid: number;
  metroCity: boolean;
}

export interface TaxRegimeResults {
  grossTotalIncome: number;
  totalExemptions: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeCess: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
}

export interface ComparisonResult {
  oldRegime: TaxRegimeResults;
  newRegime: TaxRegimeResults;
  recommended: 'OLD' | 'NEW';
  savings: number;
}
