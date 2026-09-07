"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addCreditCard } from "@/app/actions";
import { useCurrency } from "@/app/components/CurrencyProvider";

export default function ClientAddCreditCard({ profile }: { profile: any }) {
  const router = useRouter();
  const { currencySymbol } = useCurrency();

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [totalLimit, setTotalLimit] = useState("");
  const [availableBalance, setAvailableBalance] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Combine for details string
    const last4 = cardNumber.replace(/\s/g, '').slice(-4) || "****";
    const details = `${cardHolder || "Unknown"} - ${last4}`;

    await addCreditCard({
      details,
      totalLimit: parseFloat(totalLimit),
      availableBalance: parseFloat(availableBalance) || parseFloat(totalLimit)
    });
    
    setIsSubmitting(false);
    router.push("/credit-cards");
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic formatting for XXXX XXXX XXXX XXXX
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(formatted);
  };

  return (
    <div style={{ padding: '24px', paddingBottom: '120px' }}>
      {/* Header */}
      <div className="flex align-center justify-between mb-4">
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.4rem', cursor: 'pointer' }}>
          &lt;
        </button>
        <h1 className="serif" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Add New Card</h1>
        <div style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>🖨️</div>
      </div>

      {/* Credit Card Mockup */}
      <div style={{ 
        background: 'linear-gradient(135deg, #4facfe 0%, #a78bfa 100%)',
        borderRadius: '24px',
        padding: '24px',
        color: 'white',
        boxShadow: '0 20px 40px rgba(167, 139, 250, 0.4)',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circle */}
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
        
        <div className="flex justify-between align-center" style={{ marginBottom: '32px', position: 'relative' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', fontStyle: 'italic', letterSpacing: '-1px' }}>VISA</div>
          <div style={{ width: '40px', height: '30px', background: '#fbbf24', borderRadius: '6px', opacity: 0.9, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '5px', left: '0', width: '100%', height: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
            <div style={{ position: 'absolute', bottom: '5px', left: '0', width: '100%', height: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
            <div style={{ position: 'absolute', top: '0', left: '15px', width: '1px', height: '100%', background: 'rgba(0,0,0,0.1)' }}></div>
          </div>
        </div>

        <div style={{ fontSize: '1.4rem', letterSpacing: '2px', marginBottom: '16px', position: 'relative', minHeight: '33px' }}>
          {cardNumber || "---- ---- ---- ----"}
        </div>

        <div className="flex justify-between align-center" style={{ position: 'relative' }}>
          <div style={{ fontSize: '1rem', textTransform: 'uppercase', minHeight: '24px' }}>
            {cardHolder || "CARD HOLDER"}
          </div>
          <div style={{ fontSize: '1rem' }}>
            {expDate || "MM/YY"}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card" style={{ padding: '24px' }}>
        <div className="form-group mb-3">
          <label className="form-label">Card Number</label>
          <input type="text" className="form-input" placeholder="8563 1455 8547" value={cardNumber} onChange={handleCardNumberChange} required />
        </div>
        
        <div className="form-group mb-3">
          <label className="form-label">Card Holder name</label>
          <input type="text" className="form-input" placeholder="Jene Cooper" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} required />
        </div>
        
        <div className="flex" style={{ gap: '16px', marginBottom: '24px' }}>
          <div className="form-group mb-0" style={{ flex: 1 }}>
            <label className="form-label">Exp Date</label>
            <input type="text" className="form-input" placeholder="6/23" value={expDate} onChange={(e) => setExpDate(e.target.value)} required />
          </div>
          <div className="form-group mb-0" style={{ flex: 1 }}>
            <label className="form-label">CVV</label>
            <input type="text" className="form-input" placeholder="255" value={cvv} onChange={(e) => setCvv(e.target.value)} maxLength={4} required />
          </div>
        </div>

        {/* Extra fields for App Functionality */}
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px', marginTop: '24px' }}>
          <h3 className="serif" style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Account Limits</h3>
          <div className="form-group mb-3">
            <label className="form-label">Total Limit ({currencySymbol})</label>
            <input type="number" step="0.01" className="form-input" placeholder="10000.00" value={totalLimit} onChange={(e) => setTotalLimit(e.target.value)} required />
          </div>
          <div className="form-group mb-4">
            <label className="form-label">Available Balance ({currencySymbol})</label>
            <input type="number" step="0.01" className="form-input" placeholder="8500.00" value={availableBalance} onChange={(e) => setAvailableBalance(e.target.value)} required />
          </div>
        </div>

        <button type="submit" className="btn" style={{ width: '100%', background: 'var(--static-highlight)', color: '#000', border: 'none' }} disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Credit Card"}
        </button>
      </form>
    </div>
  );
}
