"use client";

import { useState } from "react";
import { addSimpleVariableExpense, deleteVariableExpenseEntry } from "@/app/actions";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, Trash2, Calendar, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import GlobalEditModal, { EntityType } from "../../components/GlobalEditModal";

export default function ClientVariableCategoryDetail({ variableExpenses }: { variableExpenses: any[] }) {
  const router = useRouter();
  const { currencySymbol } = useCurrency();
  const [newExpenseName, setNewExpenseName] = useState("");
  const [entryMonth, setEntryMonth] = useState("");
  const [entryAmount, setEntryAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editModalData, setEditModalData] = useState<{ type: EntityType, data: any } | null>(null);

  const handleAddSimpleExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName.trim() || !entryMonth || !entryAmount) return;
    setIsSubmitting(true);
    await addSimpleVariableExpense(newExpenseName, entryMonth, parseFloat(entryAmount));
    setNewExpenseName("");
    setEntryMonth("");
    setEntryAmount("");
    setIsSubmitting(false);
  };

  const handleDeleteEntry = async (id: string) => {
    if (confirm("Delete this monthly entry?")) {
      await deleteVariableExpenseEntry(id);
    }
  };

  const allEntries = variableExpenses.flatMap(ve => 
    ve.entries.map((entry: any) => ({
      ...entry,
      name: ve.name
    }))
  ).sort((a, b) => {
    const timeA = new Date(a.month).getTime();
    const timeB = new Date(b.month).getTime();
    if (timeA === timeB) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return timeB - timeA;
  });

  return (
    <div style={{ paddingBottom: '120px' }}>
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 16px 24px' }}>
        <button onClick={() => router.back()} style={{ width: '40px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
          <ChevronLeft size={28} />
        </button>
        <div className="page-title">Variable Expenses</div>
        <div style={{ width: '40px' }}></div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {/* Simple Variable Expense Form */}
        <div className="card animate-in delay-1">
          <h2 className="mb-3" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>Add Variable Expense</h2>
          <form onSubmit={handleAddSimpleExpense} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" 
              className="form-input" 
              style={{ marginBottom: 0 }}
              value={newExpenseName} 
              onChange={(e) => setNewExpenseName(e.target.value)} 
              required 
              placeholder="Expense Name (e.g. Groceries)" 
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="month" 
                className="form-input" 
                style={{ marginBottom: 0, padding: '8px', flex: 1 }}
                value={entryMonth} 
                onChange={(e) => setEntryMonth(e.target.value)} 
                required 
              />
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{currencySymbol}</span>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-input" 
                  style={{ marginBottom: 0, padding: '8px 8px 8px 24px', width: '100%' }}
                  value={entryAmount} 
                  onChange={(e) => setEntryAmount(e.target.value)} 
                  placeholder="Amount"
                  required 
                />
              </div>
            </div>
            <button type="submit" className="btn w-100" style={{ marginTop: '4px' }} disabled={isSubmitting}>
              Add Expense
            </button>
          </form>
        </div>

        {/* Flat History List */}
        <div className="card mt-4 animate-in delay-2" style={{ marginTop: '24px' }}>
          <h2 className="mb-3" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>History</h2>
          {allEntries.length === 0 ? (
             <p className="text-muted" style={{ textAlign: 'center', fontSize: '0.9rem', fontStyle: 'italic', padding: '16px 0' }}>No variable expenses recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {allEntries.map((entry: any) => (
                <div key={entry.id} className="flex justify-between align-center" style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>{entry.name}</h3>
                    <div className="flex align-center gap-2 text-muted" style={{ fontSize: '0.85rem' }}>
                      <Calendar size={12} />
                      <span>{entry.month}</span>
                    </div>
                  </div>
                  <div className="flex align-center gap-3">
                    <span style={{ color: 'var(--danger)', fontWeight: '600', fontSize: '1.1rem' }}>
                      -{currencySymbol}{entry.amount.toFixed(2)}
                    </span>
                    <button onClick={() => setEditModalData({ type: "VARIABLE_ENTRY", data: entry })} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteEntry(entry.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
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
