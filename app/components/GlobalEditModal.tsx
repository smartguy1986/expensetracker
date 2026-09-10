"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { 
  updateIncomeFull, 
  updateExpenseFull, 
  updateFixedExpenseEntry, 
  updateVariableExpenseEntry, 
  updateLoan, 
  updateCreditCardTransaction,
  updateRetirementInvestment
} from "@/app/actions";

export type EntityType = "INCOME" | "EXPENSE" | "FIXED_ENTRY" | "VARIABLE_ENTRY" | "LOAN" | "CREDIT_CARD_TX" | "RETIREMENT_INVESTMENT";

interface GlobalEditModalProps {
  entityType: EntityType;
  entityData: any;
  onClose: () => void;
}

export default function GlobalEditModal({ entityType, entityData, onClose }: GlobalEditModalProps) {
  const { currencySymbol } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states based on entityData
  const [title, setTitle] = useState(entityData.title || entityData.source || entityData.name || "");
  const [amount, setAmount] = useState(entityData.amount || entityData.monthlyCost || entityData.totalAmount || entityData.installmentAmount || "");
  const initialDate = entityData.date || entityData.startDate || entityData.createdAt;
  const [date, setDate] = useState(initialDate ? new Date(initialDate).toISOString().split('T')[0] : "");
  // Loan / EMI specific states
  const [provider, setProvider] = useState(entityData.provider || "");
  const [interestRate, setInterestRate] = useState(entityData.interestRate || "");
  const [tenure, setTenure] = useState(entityData.tenure || entityData.totalTenureMonths || "");
  const [monthlyEmi, setMonthlyEmi] = useState(entityData.monthlyEmi || "");

  // Retirement Investment specific states
  const [paymentTerms, setPaymentTerms] = useState(entityData.paymentTerms || "Monthly");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (entityType === "INCOME") {
        await updateIncomeFull(entityData.id, title, parseFloat(amount), date);
      } else if (entityType === "EXPENSE") {
        await updateExpenseFull(entityData.id, title, parseFloat(amount), date);
      } else if (entityType === "FIXED_ENTRY") {
        await updateFixedExpenseEntry(entityData.id, parseFloat(amount));
      } else if (entityType === "VARIABLE_ENTRY") {
        await updateVariableExpenseEntry(entityData.id, parseFloat(amount));
      } else if (entityType === "LOAN") {
        await updateLoan(entityData.id, title, provider, parseFloat(amount), parseFloat(interestRate) || 0, date, parseInt(tenure));
      } else if (entityType === "CREDIT_CARD_TX") {
        await updateCreditCardTransaction(entityData.id, title, parseFloat(amount), date, parseFloat(interestRate) || undefined, parseInt(tenure) || undefined, parseFloat(monthlyEmi) || undefined);
      } else if (entityType === "RETIREMENT_INVESTMENT") {
        await updateRetirementInvestment(entityData.id, {
          name: title,
          provider,
          startDate: date,
          paymentTerms,
          installmentAmount: parseFloat(amount)
        });
      }
      onClose();
    } catch (err) {
      console.error("Failed to update:", err);
      setIsSubmitting(false);
    }
  };

  const isEmiTx = entityType === "CREDIT_CARD_TX" && entityData.isEmi;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div className="card animate-in" style={{ width: '100%', maxWidth: '400px', margin: 0, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '24px' }}>Edit Entry</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          
          {(entityType === "INCOME" || entityType === "EXPENSE" || entityType === "LOAN" || entityType === "CREDIT_CARD_TX" || entityType === "RETIREMENT_INVESTMENT") && (
            <input type="text" className="form-input" placeholder="Title/Name" value={title} onChange={(e) => setTitle(e.target.value)} required />
          )}

          {(entityType === "LOAN" || entityType === "RETIREMENT_INVESTMENT") && (
            <input type="text" className="form-input" placeholder="Provider" value={provider} onChange={(e) => setProvider(e.target.value)} required />
          )}

          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{currencySymbol}</span>
            <input type="number" step="0.01" className="form-input" style={{ paddingLeft: '32px' }} placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>

          {(entityType === "INCOME" || entityType === "EXPENSE" || entityType === "LOAN" || entityType === "CREDIT_CARD_TX" || entityType === "RETIREMENT_INVESTMENT") && (
            <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required />
          )}

          {(entityType === "LOAN" || isEmiTx) && (
            <div className="flex gap-2">
              <input type="number" step="0.01" className="form-input" placeholder="Interest Rate %" value={interestRate} onChange={e => setInterestRate(e.target.value)} />
              <input type="number" className="form-input" placeholder="Tenure (Months)" value={tenure} onChange={e => setTenure(e.target.value)} required />
            </div>
          )}

          {entityType === "RETIREMENT_INVESTMENT" && (
            <select className="form-input" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half Yearly">Half Yearly</option>
              <option value="Yearly">Yearly</option>
            </select>
          )}

          {isEmiTx && (
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{currencySymbol}</span>
              <input type="number" step="0.01" className="form-input" style={{ paddingLeft: '32px' }} placeholder="Monthly EMI" value={monthlyEmi} onChange={(e) => setMonthlyEmi(e.target.value)} required />
            </div>
          )}

          <button type="submit" className="btn mt-2" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
