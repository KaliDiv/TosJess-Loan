import { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, MessageCircle } from 'lucide-react';
import { trackWhatsAppClick } from '../lib/tracking';

export function LoanCalculator({ config }: { config: any }) {
  const [amount, setAmount] = useState(1000000);
  const [months, setMonths] = useState(6);

  // Assuming a standard 5% flat monthly interest rate for demonstration
  const monthlyInterestRate = 0.05; 
  const totalInterest = amount * monthlyInterestRate * months;
  const totalRepayment = amount + totalInterest;
  const monthlyRepayment = totalRepayment / months;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleApply = () => {
    const customMessage = `Hello TOSJESS Investment Limited, I used your loan calculator and I'm interested in a loan of ${formatCurrency(amount)} over ${months} months.`;
    trackWhatsAppClick('loan_calculator', { ...config, message: customMessage });
  };

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-navy/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-navy/5 px-4 py-1.5 rounded-full mb-6 border border-navy/10">
            <Calculator className="w-4 h-4 text-navy" />
            <span className="text-navy text-xs font-bold tracking-widest uppercase">Transparent Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-navy mb-6 tracking-tight">Loan Calculator</h2>
          <p className="text-navy/70 text-xl leading-relaxed">Estimate your repayments instantly. No hidden fees, just clear and transparent terms.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Controls */}
          <div className="lg:col-span-7 bg-surface-low p-10 rounded-[2.5rem] border border-navy/5">
            <div className="mb-12">
              <div className="flex justify-between items-end mb-6">
                <label className="font-bold text-navy text-lg">Loan Amount</label>
                <span className="text-3xl font-display font-black text-gold">{formatCurrency(amount)}</span>
              </div>
              <input 
                type="range" 
                min="50000" 
                max="5000000" 
                step="50000" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-navy/10 rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <div className="flex justify-between text-xs font-bold text-navy/40 mt-3 uppercase tracking-wider">
                <span>₦50,000</span>
                <span>₦5,000,000</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-6">
                <label className="font-bold text-navy text-lg">Duration (Months)</label>
                <span className="text-3xl font-display font-black text-gold">{months} Months</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="12" 
                step="1" 
                value={months} 
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full h-2 bg-navy/10 rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <div className="flex justify-between text-xs font-bold text-navy/40 mt-3 uppercase tracking-wider">
                <span>1 Month</span>
                <span>12 Months</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-5 relative">
            <div className="bg-navy rounded-[2.5rem] p-10 text-white shadow-2xl border border-gold/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[60px] -z-10"></div>
              
              <h3 className="text-xl font-bold mb-8 text-white/80">Repayment Summary</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center pb-6 border-b border-white/10">
                  <span className="text-white/60">Monthly Repayment</span>
                  <span className="text-2xl font-display font-bold text-white">{formatCurrency(monthlyRepayment)}</span>
                </div>
                <div className="flex justify-between items-center pb-6 border-b border-white/10">
                  <span className="text-white/60">Total Interest (Flat)</span>
                  <span className="text-xl font-display font-bold text-white/90">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 font-bold">Total Repayment</span>
                  <span className="text-3xl font-display font-black text-gold">{formatCurrency(totalRepayment)}</span>
                </div>
              </div>

              <button 
                onClick={handleApply}
                className="w-full bg-gold text-navy py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-gold/20"
              >
                <MessageCircle className="w-5 h-5" />
                Apply via WhatsApp
              </button>
              <p className="text-center text-white/40 text-xs mt-4">
                *Estimates are for illustrative purposes. Final terms may vary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
