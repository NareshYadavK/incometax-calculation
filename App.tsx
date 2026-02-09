
import React, { useState, useMemo, useEffect } from 'react';
import { IncomeData, DeductionData, ComparisonResult } from './types';
import { calculateTaxes } from './services/taxCalculator';
import { getTaxAdvice } from './services/geminiService';
import { InputField } from './components/InputField';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'income' | 'deductions' | 'summary'>('income');
  const [income, setIncome] = useState<IncomeData>({
    basicSalary: 1000000,
    hra: 400000,
    specialAllowance: 150000,
    bonus: 50000,
    lta: 30000,
    otherIncomeSalary: 0,
    professionalTax: 2400,
    interestIncome: 15000,
    rentalIncome: 0,
    dividendIncome: 5000,
    businessIncome: 0,
    capitalGainsShort: 0,
    capitalGainsLong: 0,
  });

  const [deductions, setDeductions] = useState<DeductionData>({
    section80C: 150000,
    section80D: 25000,
    section80E: 0,
    section80G: 0,
    section80TTA: 10000,
    nps: 50000,
    homeLoanInterest: 0,
    rentPaid: 360000,
    metroCity: true,
  });

  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const results = useMemo(() => calculateTaxes(income, deductions), [income, deductions]);

  const handleUpdateIncome = (key: keyof IncomeData, value: number) => {
    setIncome(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateDeduction = (key: keyof DeductionData, value: any) => {
    setDeductions(prev => ({ ...prev, [key]: value }));
  };

  const fetchAdvice = async () => {
    setLoadingAdvice(true);
    const advice = await getTaxAdvice(income, deductions, results);
    setAiAdvice(advice);
    setLoadingAdvice(false);
  };

  useEffect(() => {
    setAiAdvice(""); // Clear advice when data changes
  }, [income, deductions]);

  const chartData = [
    { name: 'Old Regime', tax: results.oldRegime.totalTax },
    { name: 'New Regime', tax: results.newRegime.totalTax },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-slate-900 text-white p-6 lg:fixed lg:h-full">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">T</div>
          <h1 className="text-xl font-bold tracking-tight">TaxSync</h1>
        </div>
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('income')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'income' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m.5-1c.11 0 .21-.015.31-.04M12 16c-1.11 0-2.08-.402-2.599-1M12 16v1m-1.5-1c-.11 0-.21-.015-.31-.04M3 5v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2z"></path></svg>
            Income Details
          </button>
          <button 
            onClick={() => setActiveTab('deductions')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'deductions' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            Deductions
          </button>
          <button 
            onClick={() => setActiveTab('summary')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'summary' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Tax Summary
          </button>
        </nav>

        <div className="mt-auto pt-10 text-xs text-slate-500">
          FY 2025-26 | AY 2026-27
          <br />Updated: Union Budget 2025
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 pb-24">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {activeTab === 'income' && "Annual Income Details"}
                {activeTab === 'deductions' && "Exemptions & Deductions"}
                {activeTab === 'summary' && "Tax Comparison Summary"}
              </h2>
              <p className="text-slate-500">FY 2025-26 Budget Updated Calculator</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
               <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">New Regime Slabs Updated</span>
               <p className="text-xs text-blue-800">Standard Deduction: ₹75,000 | 0 Tax up to ₹12L</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Form Content */}
          <div className="xl:col-span-2 space-y-8">
            {activeTab === 'income' && (
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold mb-6 border-b pb-2">Salary Income</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <InputField label="Basic Salary" value={income.basicSalary} onChange={(v) => handleUpdateIncome('basicSalary', v)} />
                  <InputField label="HRA" value={income.hra} onChange={(v) => handleUpdateIncome('hra', v)} />
                  <InputField label="Special Allowance" value={income.specialAllowance} onChange={(v) => handleUpdateIncome('specialAllowance', v)} />
                  <InputField label="LTA" value={income.lta} onChange={(v) => handleUpdateIncome('lta', v)} />
                  <InputField label="Performance Bonus" value={income.bonus} onChange={(v) => handleUpdateIncome('bonus', v)} />
                  <InputField label="Other Allowances" value={income.otherIncomeSalary} onChange={(v) => handleUpdateIncome('otherIncomeSalary', v)} />
                </div>
                
                <h3 className="text-lg font-semibold mt-10 mb-6 border-b pb-2">Other Sources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <InputField label="Interest Income" value={income.interestIncome} onChange={(v) => handleUpdateIncome('interestIncome', v)} />
                  <InputField label="Rental Income" value={income.rentalIncome} onChange={(v) => handleUpdateIncome('rentalIncome', v)} />
                  <InputField label="Dividend Income" value={income.dividendIncome} onChange={(v) => handleUpdateIncome('dividendIncome', v)} />
                  <InputField label="Business Income" value={income.businessIncome} onChange={(v) => handleUpdateIncome('businessIncome', v)} />
                </div>
              </section>
            )}

            {activeTab === 'deductions' && (
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Most of these deductions apply only to the <strong>Old Regime</strong>. The New Regime only allows a Standard Deduction (₹75k) and certain NPS contributions.
                  </p>
                </div>
                <h3 className="text-lg font-semibold mb-6 border-b pb-2">Common Deductions (Old Regime)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <InputField label="80C (PPF, EPF, ELSS)" value={deductions.section80C} onChange={(v) => handleUpdateDeduction('section80C', v)} />
                  <InputField label="80D (Health Premium)" value={deductions.section80D} onChange={(v) => handleUpdateDeduction('section80D', v)} />
                  <InputField label="80CCD(1B) - NPS" value={deductions.nps} onChange={(v) => handleUpdateDeduction('nps', v)} />
                  <InputField label="80E (Education Loan)" value={deductions.section80E} onChange={(v) => handleUpdateDeduction('section80E', v)} />
                  <InputField label="Home Loan Interest" value={deductions.homeLoanInterest} onChange={(v) => handleUpdateDeduction('homeLoanInterest', v)} />
                  <InputField label="80G (Charity)" value={deductions.section80G} onChange={(v) => handleUpdateDeduction('section80G', v)} />
                </div>

                <h3 className="text-lg font-semibold mt-10 mb-6 border-b pb-2">HRA Optimization Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <InputField label="Annual Rent Paid" value={deductions.rentPaid} onChange={(v) => handleUpdateDeduction('rentPaid', v)} />
                  <div className="flex items-center gap-2 pt-8">
                    <input 
                      type="checkbox" 
                      id="metro"
                      checked={deductions.metroCity} 
                      onChange={(e) => handleUpdateDeduction('metroCity', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <label htmlFor="metro" className="text-sm font-medium text-slate-700">Metro City (50% HRA limit)</label>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'summary' && (
              <section className="space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                      FY 25-26 Pick: {results.recommended} Regime
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                      <h4 className="text-slate-500 font-medium mb-1">Estimated Tax Savings</h4>
                      <p className="text-4xl font-extrabold text-slate-900">₹{results.savings.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-slate-400 mt-2 italic">Calculated based on Budget 2025 Revised Slabs</p>
                      
                      <div className="mt-8 space-y-3">
                        <div className="flex justify-between items-center text-sm border-b pb-2">
                          <span className="text-slate-500">Standard Deduction (New)</span>
                          <span className="font-semibold text-slate-700">₹75,000</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b pb-2">
                          <span className="text-slate-500">Standard Deduction (Old)</span>
                          <span className="font-semibold text-slate-700">₹50,000</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis hide />
                          <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Tax Payable']} />
                          <Bar dataKey="tax" radius={[6, 6, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.name.includes(results.recommended) ? '#3b82f6' : '#cbd5e1'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                      Old Tax Regime (FY 25-26)
                    </h5>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Taxable Income</span>
                        <span>₹{results.oldRegime.taxableIncome.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-bold text-slate-800 text-lg">
                        <span>Total Tax</span>
                        <span>₹{results.oldRegime.totalTax.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border-2 border-blue-500 shadow-md relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Budget 2025 Revised</div>
                    <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      New Tax Regime (FY 25-26)
                    </h5>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Taxable Income</span>
                        <span>₹{results.newRegime.taxableIncome.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-bold text-blue-600 text-lg">
                        <span>Total Tax</span>
                        <span>₹{results.newRegime.totalTax.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Panel: AI Advice */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group border border-slate-800">
              <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
              </div>
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="animate-pulse">✨</span>
                Budget 2025 AI Strategist
              </h4>
              
              {!aiAdvice && !loadingAdvice ? (
                <div>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Based on the <strong>revised ₹12L rebate</strong> and <strong>₹75k standard deduction</strong>, I'll calculate your best strategy.
                  </p>
                  <button 
                    onClick={fetchAdvice}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95"
                  >
                    Analyze My Taxes
                  </button>
                </div>
              ) : loadingAdvice ? (
                <div className="flex flex-col items-center py-10 gap-3">
                  <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-slate-500 text-sm animate-pulse italic">Parsing Budget 2025 Slabs...</p>
                </div>
              ) : (
                <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  {aiAdvice}
                  <button 
                    onClick={() => setAiAdvice("")}
                    className="mt-6 text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider"
                  >
                    Recalculate
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h5 className="font-bold text-slate-800 mb-4">Summary Stats</h5>
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest">Effective Tax Rate</span>
                  <div className="text-2xl font-black text-slate-800">
                    {(results.newRegime.effectiveRate * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest">Gross Income</span>
                  <div className="text-2xl font-black text-slate-800">
                    ₹{results.oldRegime.grossTotalIncome.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden p-4 grid grid-cols-3 gap-2 z-50">
        <button onClick={() => setActiveTab('income')} className={`py-3 text-xs font-black rounded-lg uppercase tracking-tighter ${activeTab === 'income' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 bg-slate-50'}`}>Income</button>
        <button onClick={() => setActiveTab('deductions')} className={`py-3 text-xs font-black rounded-lg uppercase tracking-tighter ${activeTab === 'deductions' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 bg-slate-50'}`}>Deductions</button>
        <button onClick={() => setActiveTab('summary')} className={`py-3 text-xs font-black rounded-lg uppercase tracking-tighter ${activeTab === 'summary' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 bg-slate-50'}`}>Summary</button>
      </footer>
    </div>
  );
};

export default App;
