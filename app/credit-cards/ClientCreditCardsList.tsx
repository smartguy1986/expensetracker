"use client";

import { useState } from "react";
import { addCreditCard, deleteCreditCard, addEmi, deleteEmi } from "@/app/actions";

export default function ClientCreditCardsList({ initialCards, initialEmis }: { initialCards: any[]; initialEmis: any[] }) {
  const [details, setDetails] = useState("");
  const [totalLimit, setTotalLimit] = useState("");
  const [availableBalance, setAvailableBalance] = useState("");
  
  const [emiTitle, setEmiTitle] = useState("");
  const [emiTotal, setEmiTotal] = useState("");
  const [emiPaid, setEmiPaid] = useState("");
  const [emiAmount, setEmiAmount] = useState("");
  const [selectedCardId, setSelectedCardId] = useState(initialCards[0]?.id || "");

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCreditCard({ 
      details, 
      totalLimit: parseFloat(totalLimit) || 0, 
      availableBalance: parseFloat(availableBalance) || 0 
    });
    setDetails("");
    setTotalLimit("");
    setAvailableBalance("");
  };

  const handleAddEmi = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEmi({
      creditCardId: selectedCardId,
      title: emiTitle,
      totalEmis: parseInt(emiTotal) || 0,
      paidEmis: parseInt(emiPaid) || 0,
      amount: parseFloat(emiAmount) || 0,
    });
    setEmiTitle("");
    setEmiTotal("");
    setEmiPaid("");
    setEmiAmount("");
  };

  const handleDeleteCard = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteCreditCard(id);
    }
  };
  
  const handleDeleteEmi = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteEmi(id);
    }
  };

  return (
    <div className="grid-2">
      <div>
        <div className="card">
          <h2 className="mb-3">Add Credit Card</h2>
          <form onSubmit={handleAddCard}>
            <div className="form-group">
              <label className="form-label">Card Details (Encrypted)</label>
              <input type="text" className="form-input" value={details} onChange={(e) => setDetails(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Total Limit ($)</label>
              <input type="number" step="0.01" className="form-input" value={totalLimit} onChange={(e) => setTotalLimit(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Available Balance ($)</label>
              <input type="number" step="0.01" className="form-input" value={availableBalance} onChange={(e) => setAvailableBalance(e.target.value)} required />
            </div>
            <button type="submit" className="btn">Add Card</button>
          </form>
        </div>

        <div className="card">
          <h2 className="mb-3">Add EMI</h2>
          <form onSubmit={handleAddEmi}>
            <div className="form-group">
              <label className="form-label">Credit Card</label>
              <select className="form-input" value={selectedCardId} onChange={(e) => setSelectedCardId(e.target.value)} required>
                {initialCards.map(c => <option key={c.id} value={c.id}>{c.details}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input type="text" className="form-input" value={emiTitle} onChange={(e) => setEmiTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Total EMIs</label>
              <input type="number" className="form-input" value={emiTotal} onChange={(e) => setEmiTotal(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Paid EMIs</label>
              <input type="number" className="form-input" value={emiPaid} onChange={(e) => setEmiPaid(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Amount per EMI ($)</label>
              <input type="number" step="0.01" className="form-input" value={emiAmount} onChange={(e) => setEmiAmount(e.target.value)} required />
            </div>
            <button type="submit" className="btn">Add EMI</button>
          </form>
        </div>
      </div>

      <div>
        <h2 className="mb-3">Your Cards</h2>
        {initialCards.length === 0 ? (
          <p className="text-muted">No cards added yet.</p>
        ) : (
          initialCards.map((card) => {
            const cardEmis = initialEmis.filter(e => e.creditCardId === card.id);
            const utilization = ((card.totalLimit - card.availableBalance) / card.totalLimit * 100).toFixed(1);
            return (
              <div key={card.id} className="card">
                <div className="flex justify-between align-center mb-2">
                  <h3 style={{ wordBreak: "break-all" }}>{card.details}</h3>
                  <button className="btn btn-danger" onClick={() => handleDeleteCard(card.id)}>Delete</button>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Limit: ${card.totalLimit.toLocaleString()}</span>
                  <span>Available: ${card.availableBalance.toLocaleString()}</span>
                </div>
                <div className="mb-3">
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}>
                    <div style={{ width: `${utilization}%`, height: '100%', backgroundColor: 'var(--warning)', borderRadius: '4px' }}></div>
                  </div>
                  <small className="text-muted">{utilization}% Utilized</small>
                </div>
                
                {cardEmis.length > 0 && (
                  <div style={{ backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: '8px' }}>
                    <h4 className="mb-2">Linked EMIs</h4>
                    {cardEmis.map(emi => (
                      <div key={emi.id} className="flex justify-between align-center mb-2" style={{ fontSize: '0.9rem' }}>
                        <div>
                          <strong>{emi.title}</strong>
                          <div className="text-muted">{emi.paidEmis} / {emi.totalEmis} paid</div>
                        </div>
                        <div className="text-right">
                          <div className="text-danger">${emi.amount.toLocaleString()}/mo</div>
                          <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem', marginTop: '4px' }} onClick={() => handleDeleteEmi(emi.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
