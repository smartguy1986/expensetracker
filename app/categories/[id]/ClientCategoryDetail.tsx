"use client";

import { useState } from "react";
import { addExpense, deleteExpense } from "@/app/actions";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, Trash2, Filter, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import GlobalEditModal, { EntityType } from "../../components/GlobalEditModal";

export default function ClientCategoryDetail({ category, initialExpenses }: { category: any, initialExpenses: any[] }) {
  const router = useRouter();
  const { currencySymbol } = useCurrency();
  const [title, setTitle] = useState("");
  const [monthlyCost, setMonthlyCost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit state
  const [editModalData, setEditModalData] = useState<{ type: EntityType, data: any } | null>(null);

  // Filtering state
  const [filterType, setFilterType] = useState("All"); // All, Month, Year
  const [filterValue, setFilterValue] = useState(""); // e.g. "2026-04" for Month, "2026" for Year

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addExpense({ title, categoryId: category.id, monthlyCost: parseFloat(monthlyCost) || 0 });
    setTitle("");
    setMonthlyCost("");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      await deleteExpense(id);
    }
  };

  // Apply filtering
  let filteredExpenses = [...initialExpenses];
  if (filterType === "Month" && filterValue) {
    filteredExpenses = filteredExpenses.filter(e => {
      const d = new Date(e.createdAt);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return monthStr === filterValue;
    });
  } else if (filterType === "Year" && filterValue) {
    filteredExpenses = filteredExpenses.filter(e => {
      const d = new Date(e.createdAt);
      return String(d.getFullYear()) === filterValue;
    });
  }

  // By default (or "All" filter), slice to last 10 if not filtering specifically
  const displayExpenses = filterType === "All" ? filteredExpenses.slice(0, 10) : filteredExpenses;

  // Generate options for filters based on existing data
  const availableMonths = Array.from(new Set(initialExpenses.map(e => {
    const d = new Date(e.createdAt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }))).sort().reverse();
  
  const availableYears = Array.from(new Set(initialExpenses.map(e => String(new Date(e.createdAt).getFullYear())))).sort().reverse();

  return (
    <div style={{ paddingBottom: '120px' }}>
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 16px 24px' }}>
        <button onClick={() => router.back()} style={{ width: '40px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
          <ChevronLeft size={28} />
        </button>
        <div className="page-title">{category.name}</div>
        <div style={{ width: '40px', textAlign: 'right', color: 'var(--text-primary)' }}><Filter size={20} /></div>
      </div>

      <div style={{ padding: '0 24px' }}>
        <div className="card animate-in delay-1">
          <h2 className="mb-3" style={{ color: 'var(--text-primary)' }}>New Expense</h2>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder={`E.g. ${category.name} bill`} />
            </div>
            <div className="form-group">
              <label className="form-label">Cost ({currencySymbol})</label>
              <input type="number" step="0.01" className="form-input" value={monthlyCost} onChange={(e) => setMonthlyCost(e.target.value)} required />
            </div>
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Expense"}
            </button>
          </form>
        </div>

        <div className="card animate-in delay-2">
          <div className="flex justify-between align-center mb-4">
            <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>History</h2>
            <div className="flex gap-2">
              <select 
                value={filterType} 
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setFilterValue("");
                }}
                style={{ background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '4px 8px', fontSize: '0.85rem' }}
              >
                <option value="All">Last 10</option>
                <option value="Month">By Month</option>
                <option value="Year">By Year</option>
              </select>
              
              {filterType === "Month" && (
                <select 
                  value={filterValue} 
                  onChange={(e) => setFilterValue(e.target.value)}
                  style={{ background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '4px 8px', fontSize: '0.85rem' }}
                >
                  <option value="">Select...</option>
                  {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              )}
              
              {filterType === "Year" && (
                <select 
                  value={filterValue} 
                  onChange={(e) => setFilterValue(e.target.value)}
                  style={{ background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '4px 8px', fontSize: '0.85rem' }}
                >
                  <option value="">Select...</option>
                  {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              )}
            </div>
          </div>

          {displayExpenses.length === 0 && <p className="text-muted mt-4">No expenses found.</p>}
          {displayExpenses.map((expense) => (
            <div key={expense.id} className="tx-item" style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>
              <div className="flex align-center">
                <div>
                  <div className="font-semibold" style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{expense.title}</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>{new Date(expense.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex align-center gap-3" style={{ gap: '16px' }}>
                <div style={{ color: 'var(--danger)', fontWeight: '500', fontSize: '1.1rem' }}>
                  -{currencySymbol}{expense.monthlyCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <button 
                  onClick={() => setEditModalData({ type: "EXPENSE", data: expense })}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(expense.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {filterType === "All" && initialExpenses.length > 10 && (
             <p className="text-muted" style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem' }}>Showing last 10 expenses. Use filters to see older records.</p>
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
