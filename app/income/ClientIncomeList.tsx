"use client";

import { useState } from "react";
import { addIncome, deleteIncome } from "@/app/actions";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, SlidersHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClientIncomeList({ initialIncomes }: { initialIncomes: any[] }) {
  const { currencySymbol } = useCurrency();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addIncome({ title, amount: parseFloat(amount) || 0 });
    setTitle("");
    setAmount("");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteIncome(id);
    }
  };

  return (
    <div style={{ paddingBottom: '120px' }}>
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 0 24px' }}>
        <button onClick={() => router.back()} style={{ width: '40px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
          <ChevronLeft size={28} />
        </button>
        <div className="page-title">Incomes</div>
        <div style={{ width: '40px', textAlign: 'right', color: 'var(--text-primary)' }}><SlidersHorizontal size={20} /></div>
      </div>
      
      <div className="card animate-in delay-1" style={{ margin: '24px' }}>
        <h2 className="mb-3" style={{ color: 'var(--text-primary)' }}>Add Income</h2>
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label className="form-label">Title (e.g. Salary, Freelance)</label>
            <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Amount ({currencySymbol})</label>
            <input type="number" step="0.01" className="form-input" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Income"}
          </button>
        </form>
      </div>

      <div className="card animate-in delay-2" style={{ margin: '24px' }}>
        <h2 className="mb-4" style={{ color: 'var(--text-primary)' }}>History</h2>
        {initialIncomes.length === 0 && <p className="text-muted">No incomes yet.</p>}
        {initialIncomes.map((inc) => (
          <div key={inc.id} className="tx-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex align-center">
              <div className="tx-icon" style={{ borderColor: 'var(--text-muted)', marginRight: '12px', color: 'var(--success)' }}>💵</div>
              <div>
                <div className="font-semibold" style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{inc.title}</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>{new Date(inc.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex align-center gap-3" style={{ gap: '16px' }}>
              <div style={{ color: 'var(--success)', fontWeight: '500', fontSize: '1.1rem' }}>
                +{currencySymbol}{inc.amount.toFixed(2)}
              </div>
              <button 
                onClick={() => handleDelete(inc.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
