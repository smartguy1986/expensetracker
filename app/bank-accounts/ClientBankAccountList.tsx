"use client";

import { useState } from "react";
import { addBankAccount, deleteBankAccount } from "@/app/actions";
import { useCurrency } from "@/app/components/CurrencyProvider";

export default function ClientBankAccountList({ initialAccounts }: { initialAccounts: any[] }) {
  const { currencySymbol } = useCurrency();
  const [nickname, setNickname] = useState("");
  const [details, setDetails] = useState("");
  const [balance, setBalance] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addBankAccount({ nickname, details, balance: parseFloat(balance) || 0 });
    setNickname("");
    setDetails("");
    setBalance("");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteBankAccount(id);
    }
  };

  return (
    <div className="grid-2">
      <div className="card">
        <h2 className="mb-3">Add Account</h2>
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label className="form-label">Nickname</label>
            <input type="text" className="form-input" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Account Details (Encrypted securely)</label>
            <input type="text" className="form-input" value={details} onChange={(e) => setDetails(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Balance ({currencySymbol})</label>
            <input type="number" step="0.01" className="form-input" value={balance} onChange={(e) => setBalance(e.target.value)} required />
          </div>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Account"}
          </button>
        </form>
      </div>

      <div>
        {initialAccounts.length === 0 ? (
          <p className="text-muted" style={{ padding: '0 24px' }}>No accounts added yet.</p>
        ) : (
          initialAccounts.map((acc) => (
            <div key={acc.id} className="card">
              <div className="flex justify-between align-center mb-2">
                <h3 style={{ fontSize: '1.15rem' }}>{acc.nickname}</h3>
                <div className="flex align-center">
                  <h3 className="text-success" style={{ marginRight: '16px', fontSize: '1.15rem' }}>{currencySymbol}{acc.balance.toLocaleString()}</h3>
                  <button onClick={() => handleDelete(acc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7 }} title="Delete">🗑️</button>
                </div>
              </div>
              <p className="text-muted mb-0" style={{ wordBreak: "break-all" }}>Details: {acc.details}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
