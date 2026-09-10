"use client";

import { useState } from "react";
import { addFixedExpense, addFixedExpenseEntry, deleteFixedExpense, deleteFixedExpenseEntry } from "@/app/actions";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, Trash2, Plus, Calendar, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import GlobalEditModal, { EntityType } from "../../components/GlobalEditModal";

export default function ClientFixedCategoryDetail({ fixedExpenses }: { fixedExpenses: any[] }) {
  const router = useRouter();
  const { currencySymbol } = useCurrency();
  const [newExpenseName, setNewExpenseName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit state
  const [editModalData, setEditModalData] = useState<{ type: EntityType, data: any } | null>(null);

  // State for monthly entries
  const [activeExpenseId, setActiveExpenseId] = useState<string | null>(null);
  const [entryMonth, setEntryMonth] = useState("");
  const [entryAmount, setEntryAmount] = useState("");

  const handleAddFixedExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName.trim()) return;
    setIsSubmitting(true);
    await addFixedExpense(newExpenseName);
    setNewExpenseName("");
    setIsSubmitting(false);
  };

  const handleDeleteFixedExpense = async (id: string) => {
    if (confirm("Are you sure you want to delete this Fixed Expense type and all its monthly entries?")) {
      await deleteFixedExpense(id);
    }
  };

  const handleAddEntry = async (e: React.FormEvent, fixedExpenseId: string) => {
    e.preventDefault();
    if (!entryMonth || !entryAmount) return;
    setIsSubmitting(true);
    await addFixedExpenseEntry(fixedExpenseId, entryMonth, parseFloat(entryAmount));
    setEntryMonth("");
    setEntryAmount("");
    setActiveExpenseId(null);
    setIsSubmitting(false);
  };

  const handleDeleteEntry = async (id: string) => {
    if (confirm("Delete this monthly entry?")) {
      await deleteFixedExpenseEntry(id);
    }
  };

  return (
    <div style={{ paddingBottom: '120px' }}>
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 16px 24px' }}>
        <button onClick={() => router.back()} style={{ width: '40px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
          <ChevronLeft size={28} />
        </button>
        <div className="page-title">Fixed Expenses</div>
        <div style={{ width: '40px' }}></div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {/* Setup New Fixed Expense */}
        <div className="card animate-in delay-1">
          <h2 className="mb-3" style={{ color: 'var(--text-primary)' }}>New Fixed Expense Type</h2>
          <form onSubmit={handleAddFixedExpense} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="form-input" 
              style={{ marginBottom: 0, flex: 1 }}
              value={newExpenseName} 
              onChange={(e) => setNewExpenseName(e.target.value)} 
              required 
              placeholder="E.g. Electric Bill, Internet" 
            />
            <button type="submit" className="btn" style={{ padding: 0, width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0 }} disabled={isSubmitting || !newExpenseName.trim()}>
              <Plus size={24} />
            </button>
          </form>
        </div>

        {/* List of Fixed Expenses */}
        <div className="animate-in delay-2">
          {fixedExpenses.length === 0 ? (
             <p className="text-muted mt-4" style={{ textAlign: 'center' }}>No fixed expenses set up yet. Add one above!</p>
          ) : (
            fixedExpenses.map((fe) => (
              <div key={fe.id} className="card mb-4" style={{ padding: '16px 20px' }}>
                <div className="flex justify-between align-center mb-3">
                  <h3 className="serif" style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.2rem' }}>{fe.name}</h3>
                  <button onClick={() => handleDeleteFixedExpense(fe.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* Monthly Entries List */}
                <div style={{ marginBottom: '16px' }}>
                  {fe.entries.length === 0 ? (
                    <p className="text-muted" style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>No monthly entries recorded yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {fe.entries.map((entry: any) => (
                        <div key={entry.id} className="flex justify-between align-center" style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                          <div className="flex align-center gap-2">
                            <Calendar size={16} className="text-muted" />
                            <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{entry.month}</span>
                          </div>
                          <div className="flex align-center gap-3">
                            <span style={{ color: 'var(--danger)', fontWeight: '600' }}>
                              -{currencySymbol}{entry.amount.toFixed(2)}
                            </span>
                            <button onClick={() => setEditModalData({ type: "FIXED_ENTRY", data: entry })} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDeleteEntry(entry.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Entry Form for this Fixed Expense */}
                {activeExpenseId === fe.id ? (
                  <form onSubmit={(e) => handleAddEntry(e, fe.id)} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
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
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button type="button" onClick={() => setActiveExpenseId(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: '8px 12px', cursor: 'pointer' }}>
                        Cancel
                      </button>
                      <button type="submit" className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }} disabled={isSubmitting}>
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => { setActiveExpenseId(fe.id); setEntryMonth(""); setEntryAmount(""); }} style={{ background: 'transparent', border: '1px dashed var(--glass-border)', color: 'var(--text-primary)', width: '100%', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <Plus size={16} /> Add Monthly Entry
                  </button>
                )}
              </div>
            ))
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
