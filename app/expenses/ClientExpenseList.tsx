"use client";

import { useState } from "react";
import { addExpense, deleteExpense } from "@/app/actions";

export default function ClientExpenseList({ initialExpenses, categories }: { initialExpenses: any[]; categories: any[] }) {
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
      <div className="card">
        <h2 className="mb-3">Add Expense</h2>
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
            <label className="form-label">Monthly Cost ($)</label>
            <input type="number" step="0.01" className="form-input" value={monthlyCost} onChange={(e) => setMonthlyCost(e.target.value)} required />
          </div>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>

      <div>
        {initialExpenses.length === 0 ? (
          <p className="text-muted">No expenses added yet.</p>
        ) : (
          initialExpenses.map((exp) => (
            <div key={exp.id} className="card">
              <div className="flex justify-between align-center mb-2">
                <h3>{exp.title}</h3>
                <h3 className="text-danger">${exp.monthlyCost.toLocaleString()}</h3>
              </div>
              <p className="text-muted mb-3">Category: {exp.category.name}</p>
              <button className="btn btn-danger" onClick={() => handleDelete(exp.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
