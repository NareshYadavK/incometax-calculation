
import { GoogleGenAI, Type } from "@google/genai";
import { IncomeData, DeductionData, ComparisonResult } from "../types";

export const getTaxAdvice = async (
  income: IncomeData,
  deductions: DeductionData,
  results: ComparisonResult
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze the following Indian tax calculation for FY 2025-26 (AY 2026-27) as per Union Budget 2025:
    
    Income Summary:
    - Basic: ₹${income.basicSalary}
    - Total Gross: ₹${results.oldRegime.grossTotalIncome}
    - Rental Income: ₹${income.rentalIncome}
    
    Current Deductions (for Old Regime):
    - 80C: ₹${deductions.section80C}
    - 80D: ₹${deductions.section80D}
    - Home Loan Interest: ₹${deductions.homeLoanInterest}
    
    Comparison:
    - Old Regime Tax: ₹${results.oldRegime.totalTax.toFixed(2)}
    - New Regime Tax: ₹${results.newRegime.totalTax.toFixed(2)}
    - Recommended: ${results.recommended} Regime
    - Potential Savings: ₹${results.savings.toFixed(2)}
    
    Budget 2025 Context:
    - New Regime Standard Deduction: ₹75,000
    - New Regime Rebate: Nil tax up to ₹12 Lakhs income
    
    Provide 3-4 professional bullet points on:
    1. Why the ${results.recommended} regime is statistically better for their profile.
    2. Specific advice on how to transition or optimize further (e.g., if switching to New Regime is better due to the higher ₹12L rebate).
    3. Missing opportunities (NPS, Health top-ups, etc.) specifically for the Old Regime if they choose it.
    Keep it very professional, concise, and focused on Budget 2025 updates.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate advice at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to the AI tax advisor.";
  }
};
