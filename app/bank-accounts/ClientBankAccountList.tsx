"use client";

import { useState } from "react";
import { addBankAccount, deleteBankAccount } from "@/app/actions";

export default function ClientBankAccountList({ initialAccounts }: { initialAccounts: any[] }) {
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
            <label className="form-label">Balance ($)</label>
            <input type="number" step="0.01" className="form-input" value={balance} onChange={(e) => setBalance(e.target.value)} required />
          </div>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Account"}
          </button>
        </form>
      </div>

      <div>
        {initialAccounts.length === 0 ? (
          <p className="text-muted">No accounts added yet.</p>
        ) : (
          initialAccounts.map((acc) => (
            <div key={acc.id} className="card">
              <div className="flex justify-between align-center mb-2">
                <h3>{acc.nickname}</h3>
                <h3 className="text-success">${acc.balance.toLocaleString()}</h3>
              </div>
              <p className="text-muted mb-3" style={{ wordBreak: "break-all" }}>Details: {acc.details}</p>
              <button className="btn btn-danger" onClick={() => handleDelete(acc.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
