"use client";

import { useState } from "react";
import { addLoan, deleteLoan } from "@/app/actions";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, Trash2, Landmark, Calendar, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import GlobalEditModal, { EntityType } from "../../components/GlobalEditModal";

export default function ClientLoanCategoryDetail({ loans }: { loans: any[] }) {
  const router = useRouter();
  const { currencySymbol } = useCurrency();
  
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [totalTenureMonths, setTotalTenureMonths] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editModalData, setEditModalData] = useState<{ type: EntityType, data: any } | null>(null);

  // Auto-calculation logic (Standard EMI)
  let calculatedTotal = 0;
  let calculatedMonthly = 0;
  
  const p = parseFloat(totalAmount) || 0;
  const rAnnual = parseFloat(interestRate) || 0;
  const n = parseInt(totalTenureMonths) || 0;

  if (p > 0 && n > 0) {
    if (rAnnual > 0) {
      const r = rAnnual / 12 / 100;
      const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      calculatedMonthly = emi;
      calculatedTotal = emi * n;
    } else {
      calculatedTotal = p;
      calculatedMonthly = p / n;
    }
  }

  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !provider.trim() || !totalAmount || !interestRate || !startDate || !totalTenureMonths) return;
    
    setIsSubmitting(true);
    await addLoan(
      title,
      provider,
      parseFloat(totalAmount),
      parseFloat(interestRate),
      startDate,
      parseInt(totalTenureMonths)
    );
    
    setTitle("");
    setProvider("");
    setTotalAmount("");
    setInterestRate("");
    setStartDate("");
    setTotalTenureMonths("");
    setIsSubmitting(false);
  };

  const handleDeleteLoan = async (id: string) => {
    if (confirm("Are you sure you want to delete this loan record?")) {
      await deleteLoan(id);
    }
  };

  return (
    <div style={{ paddingBottom: '120px' }}>
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 16px 24px' }}>
        <button onClick={() => router.back()} style={{ width: '40px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
          <ChevronLeft size={28} />
        </button>
        <div className="page-title">Loans</div>
        <div style={{ width: '40px' }}></div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {/* New Loan Form */}
        <div className="card animate-in delay-1">
          <h2 className="mb-3" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>Add New Loan</h2>
          <form onSubmit={handleAddLoan} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" 
              className="form-input" 
              style={{ marginBottom: 0 }}
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="Loan Title (e.g. Home Loan)" 
            />
            <input 
              type="text" 
              className="form-input" 
              style={{ marginBottom: 0 }}
              value={provider} 
              onChange={(e) => setProvider(e.target.value)} 
              required 
              placeholder="Provider (e.g. HDFC Bank)" 
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{currencySymbol}</span>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-input" 
                  style={{ marginBottom: 0, paddingLeft: '28px' }}
                  value={totalAmount} 
                  onChange={(e) => setTotalAmount(e.target.value)} 
                  required 
                  placeholder="Principal Amount" 
                />
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>%</span>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-input" 
                  style={{ marginBottom: 0, paddingRight: '36px' }}
                  value={interestRate} 
                  onChange={(e) => setInterestRate(e.target.value)} 
                  required 
                  placeholder="Interest Rate (p.a.)" 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input 
                type="date" 
                className="form-input" 
                style={{ marginBottom: 0, padding: '14px' }}
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                required 
              />
              <input 
                type="number" 
                className="form-input" 
                style={{ marginBottom: 0 }}
                value={totalTenureMonths} 
                onChange={(e) => setTotalTenureMonths(e.target.value)} 
                required 
                placeholder="Tenure (Months)" 
              />
            </div>

            {/* Auto Calculation Display */}
            <div style={{ 
              background: 'rgba(0,0,0,0.03)', 
              borderRadius: '12px', 
              padding: '16px', 
              marginTop: '8px',
              border: '1px solid var(--glass-border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>Estimated Monthly EMI:</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{currencySymbol}{calculatedMonthly.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>Total Payable (with Interest):</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{currencySymbol}{calculatedTotal.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className="btn w-100" style={{ marginTop: '8px' }} disabled={isSubmitting}>
              Save Loan Details
            </button>
          </form>
        </div>

        {/* Active Loans */}
        <div className="card mt-4 animate-in delay-2" style={{ marginTop: '24px' }}>
          <h2 className="mb-3" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>Active Loans</h2>
          {loans.length === 0 ? (
             <p className="text-muted" style={{ textAlign: 'center', fontSize: '0.9rem', fontStyle: 'italic', padding: '16px 0' }}>No loans recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {loans.map((loan: any) => {
                // Calculate total dynamically
                const r = loan.interestRate / 12 / 100;
                const emi = r > 0 ? (loan.totalAmount * r * Math.pow(1 + r, loan.totalTenureMonths) / (Math.pow(1 + r, loan.totalTenureMonths) - 1)) : (loan.totalAmount / loan.totalTenureMonths);
                const totalCalculated = emi * loan.totalTenureMonths;

                return (
                  <div key={loan.id} style={{ padding: '16px', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div className="flex justify-between align-center mb-3">
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>{loan.title}</h3>
                        <div className="flex align-center gap-1 text-muted" style={{ fontSize: '0.85rem' }}>
                          <Landmark size={12} />
                          <span>{loan.provider}</span>
                        </div>
                      </div>
                      <div className="flex align-center gap-2">
                        <button onClick={() => setEditModalData({ type: "LOAN", data: loan })} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDeleteLoan(loan.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px', opacity: 0.7 }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px', fontSize: '0.85rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Principal Amount</div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{currencySymbol}{loan.totalAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Interest Rate</div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{loan.interestRate}% p.a.</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '0.85rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Start Date</div>
                        <div className="flex align-center gap-1" style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                          <Calendar size={12} />
                          {new Date(loan.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Tenure</div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{loan.totalTenureMonths} Months</div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px dashed var(--glass-border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Payable:</span>
                      <span style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--danger)' }}>
                        {currencySymbol}{totalCalculated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {editModalData && (
        <GlobalEditModal
          entityType={editModalData.type}
          entityData={editModalData.data}
          onClose={() => setEditModalData(null)}
        />
      )}
    </div>
  );
}
