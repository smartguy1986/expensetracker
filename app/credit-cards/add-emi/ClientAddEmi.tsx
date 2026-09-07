"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addEmi } from "@/app/actions";
import { useCurrency } from "@/app/components/CurrencyProvider";

export default function ClientAddEmi({ cards }: { cards: any[] }) {
  const router = useRouter();
  const { currencySymbol } = useCurrency();

  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || "");
  const [emiTitle, setEmiTitle] = useState("");
  const [emiTotal, setEmiTotal] = useState("");
  const [emiPaid, setEmiPaid] = useState("");
  const [emiAmount, setEmiAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await addEmi({
      creditCardId: selectedCardId,
      title: emiTitle,
      totalEmis: parseInt(emiTotal),
      paidEmis: parseInt(emiPaid),
      amount: parseFloat(emiAmount)
    });
    
    setIsSubmitting(false);
    router.push("/credit-cards");
  };

  return (
    <div style={{ padding: '24px', paddingBottom: '120px' }}>
      {/* Header */}
      <div className="flex align-center justify-between mb-4">
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.4rem', cursor: 'pointer' }}>
          &lt;
        </button>
        <h1 className="serif" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Add EMI</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '24px' }}>
        <h2 className="serif" style={{ fontSize: '1.4rem', marginBottom: '24px', color: 'var(--static-highlight)' }}>Add EMI</h2>
        
        <div className="form-group mb-4">
          <label className="form-label">Credit Card</label>
          <select 
            className="form-input" 
            value={selectedCardId} 
            onChange={(e) => setSelectedCardId(e.target.value)} 
            required
            style={{ WebkitAppearance: 'none', appearance: 'none' }}
          >
            {cards.length === 0 && <option value="">No cards available</option>}
            {cards.map(c => (
              <option key={c.id} value={c.id}>{c.details}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group mb-4">
          <label className="form-label">Title</label>
          <input type="text" className="form-input" value={emiTitle} onChange={(e) => setEmiTitle(e.target.value)} required />
        </div>
        
        <div className="form-group mb-4">
          <label className="form-label">Total EMIs</label>
          <input type="number" className="form-input" value={emiTotal} onChange={(e) => setEmiTotal(e.target.value)} required />
        </div>
        
        <div className="form-group mb-4">
          <label className="form-label">Paid EMIs</label>
          <input type="number" className="form-input" value={emiPaid} onChange={(e) => setEmiPaid(e.target.value)} required />
        </div>
        
        <div className="form-group mb-4">
          <label className="form-label">Amount per EMI ({currencySymbol})</label>
          <input type="number" step="0.01" className="form-input" value={emiAmount} onChange={(e) => setEmiAmount(e.target.value)} required />
        </div>
        
        <button type="submit" className="btn" style={{ width: '100%', background: 'transparent', color: 'var(--static-highlight)', border: '1px solid var(--static-highlight)' }} disabled={isSubmitting || cards.length === 0}>
          {isSubmitting ? "Adding..." : "Add EMI"}
        </button>
      </form>
    </div>
  );
}
