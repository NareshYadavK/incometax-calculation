
import { IncomeData, DeductionData, TaxRegimeResults, ComparisonResult } from '../types';
import { TAX_CONSTANTS, NEW_REGIME_SLABS, OLD_REGIME_SLABS } from '../constants';

const calculateTaxForSlabs = (income: number, slabs: { limit: number; rate: number }[]) => {
  let tax = 0;
  let previousLimit = 0;

  for (const slab of slabs) {
    if (income > previousLimit) {
      const taxableInSlab = Math.min(income, slab.limit) - previousLimit;
      tax += taxableInSlab * slab.rate;
      previousLimit = slab.limit;
    } else {
      break;
    }
  }
  return tax;
};

export const calculateTaxes = (income: IncomeData, deductions: DeductionData): ComparisonResult => {
  const grossSalary = income.basicSalary + income.hra + income.specialAllowance + income.bonus + income.lta + income.otherIncomeSalary;
  const otherIncome = income.interestIncome + income.rentalIncome + income.dividendIncome + income.businessIncome + income.capitalGainsLong + income.capitalGainsShort;
  const grossTotalIncome = grossSalary + otherIncome;

  // HRA Exemption (Simplistic Calculation for Old Regime)
  const hraExemption = Math.min(
    income.hra,
    deductions.rentPaid - (0.1 * income.basicSalary),
    (deductions.metroCity ? 0.5 : 0.4) * income.basicSalary
  );
  const actualHraExemption = Math.max(0, hraExemption);

  // --- OLD REGIME ---
  const oldExemptions = actualHraExemption + income.professionalTax + income.lta + TAX_CONSTANTS.OLD_REGIME_STANDARD_DEDUCTION;
  const total80CDeduction = Math.min(deductions.section80C, TAX_CONSTANTS.SECTION_80C_LIMIT);
  const total80DDeduction = Math.min(deductions.section80D, TAX_CONSTANTS.SECTION_80D_LIMIT);
  const total80TTADeduction = Math.min(deductions.section80TTA, TAX_CONSTANTS.SECTION_80C_LIMIT);
  
  const oldTotalDeductions = total80CDeduction + total80DDeduction + total80TTADeduction + deductions.section80E + deductions.section80G + Math.min(deductions.nps, TAX_CONSTANTS.NPS_EXTRA_LIMIT) + deductions.homeLoanInterest;
  
  const oldTaxableIncome = Math.max(0, grossTotalIncome - oldExemptions - oldTotalDeductions);
  let oldTax = calculateTaxForSlabs(oldTaxableIncome, OLD_REGIME_SLABS);
  if (oldTaxableIncome <= TAX_CONSTANTS.OLD_REGIME_REBATE_LIMIT) oldTax = 0;
  
  const oldCess = oldTax * TAX_CONSTANTS.CESS_RATE;
  const oldTotalTax = oldTax + oldCess + deductions.interest234A + deductions.interest234B + deductions.interest234C + deductions.fees234F;
  
  const oldResult: TaxRegimeResults = {
    grossTotalIncome,
    totalExemptions: oldExemptions,
    totalDeductions: oldTotalDeductions,
    taxableIncome: oldTaxableIncome,
    taxBeforeCess: oldTax,
    cess: oldCess,
    interest234A: deductions.interest234A,
    interest234B: deductions.interest234B,
    interest234C: deductions.interest234C,
    fees234F: deductions.fees234F,
    totalTax: oldTotalTax,
    effectiveRate: grossTotalIncome > 0 ? oldTotalTax / grossTotalIncome : 0
  };

  // --- NEW REGIME (FY 2025-26 Changes) ---
  // Standard deduction increased to 75k in New Regime
  const newExemptions = TAX_CONSTANTS.NEW_REGIME_STANDARD_DEDUCTION; 
  const newTaxableIncome = Math.max(0, grossTotalIncome - newExemptions);
  let newTax = calculateTaxForSlabs(newTaxableIncome, NEW_REGIME_SLABS);
  
  // Rebate up to 12L in New Regime (Budget 2025)
  if (newTaxableIncome <= TAX_CONSTANTS.NEW_REGIME_REBATE_LIMIT) newTax = 0;
  
  const newCess = newTax * TAX_CONSTANTS.CESS_RATE;
  const newTotalTax = newTax + newCess + deductions.interest234A + deductions.interest234B + deductions.interest234C + deductions.fees234F;

  const newResult: TaxRegimeResults = {
    grossTotalIncome,
    totalExemptions: newExemptions,
    totalDeductions: 0,
    taxableIncome: newTaxableIncome,
    taxBeforeCess: newTax,
    cess: newCess,
    interest234A: deductions.interest234A,
    interest234B: deductions.interest234B,
    interest234C: deductions.interest234C,
    fees234F: deductions.fees234F,
    totalTax: newTotalTax,
    effectiveRate: grossTotalIncome > 0 ? newTotalTax / grossTotalIncome : 0
  };

  return {
    oldRegime: oldResult,
    newRegime: newResult,
    recommended: newResult.totalTax <= oldResult.totalTax ? 'NEW' : 'OLD',
    savings: Math.abs(newResult.totalTax - oldResult.totalTax)
  };
};
