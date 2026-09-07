"use client";

import { useState } from "react";
import { addExpense, deleteExpense } from "@/app/actions";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, SlidersHorizontal, Trash2 } from "lucide-react";

export default function ClientExpenseList({ initialExpenses, categories }: { initialExpenses: any[], categories: any[] }) {
  const { currencySymbol } = useCurrency();
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [monthlyCost, setMonthlyCost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addExpense({ title, categoryId, monthlyCost: parseFloat(monthlyCost) || 0 });
    setTitle("");
    setMonthlyCost("");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteExpense(id);
    }
  };

  return (
    <div className="grid-2">
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 0 24px' }}>
        <button style={{ width: '40px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
          <ChevronLeft size={28} />
        </button>
        <div className="page-title">Expenses</div>
        <div style={{ width: '40px', textAlign: 'right', color: 'var(--text-primary)' }}><SlidersHorizontal size={20} /></div>
      </div>
      <div className="card animate-in delay-1">
        <h2 className="mb-3" style={{ color: 'var(--text-primary)' }}>Add Expense</h2>
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Monthly Cost ({currencySymbol})</label>
            <input type="number" step="0.01" className="form-input" value={monthlyCost} onChange={(e) => setMonthlyCost(e.target.value)} required />
          </div>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>

      <div className="card animate-in delay-2">
        <h2 className="mb-4" style={{ color: 'var(--text-primary)' }}>History</h2>
        {initialExpenses.length === 0 && <p className="text-muted">No expenses yet.</p>}
        {initialExpenses.map((expense) => (
          <div key={expense.id} className="tx-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex align-center">
              <div className="tx-icon" style={{ borderColor: 'var(--text-muted)', marginRight: '12px' }}>📉</div>
              <div>
                <div className="font-semibold" style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{expense.title}</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>{expense.category.name}</div>
              </div>
            </div>
            <div className="flex align-center gap-3" style={{ gap: '16px' }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '1.1rem' }}>
                {currencySymbol}{expense.monthlyCost.toFixed(2)}
              </div>
              <button 
                onClick={() => handleDelete(expense.id)}
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
