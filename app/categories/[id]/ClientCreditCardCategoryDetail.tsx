"use client";

import { useState } from "react";
import { addCreditCard, deleteCreditCard, addCreditCardTransaction, deleteCreditCardTransaction, toggleEmiMonthPaid } from "@/app/actions";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, Trash2, CreditCard as CreditCardIcon, Plus, Calendar, CheckCircle2, Circle, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import GlobalEditModal, { EntityType } from "../../components/GlobalEditModal";

export default function ClientCreditCardCategoryDetail({ creditCards }: { creditCards: any[] }) {
  const router = useRouter();
  const { currencySymbol } = useCurrency();
  
  const [activeCardId, setActiveCardId] = useState<string>(creditCards[0]?.id || "");
  const [isAddingCard, setIsAddingCard] = useState(creditCards.length === 0);

  // New Card State
  const [bankName, setBankName] = useState("");
  const [last4, setLast4] = useState("");
  const [expiry, setExpiry] = useState("");

  // Edit state
  const [editModalData, setEditModalData] = useState<{ type: EntityType, data: any } | null>(null);

  // New Transaction State
  const [isEmi, setIsEmi] = useState(true);
  const [txTitle, setTxTitle] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [txDate, setTxDate] = useState("");
  const [txInterestRate, setTxInterestRate] = useState("");
  const [txTenure, setTxTenure] = useState("");
  const [txMonthlyEmi, setTxMonthlyEmi] = useState("");
  
  const [expandedEmiId, setExpandedEmiId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !last4 || !expiry) return;
    setIsSubmitting(true);
    const card = await addCreditCard(bankName, last4, expiry);
    setActiveCardId(card.id);
    setBankName(""); setLast4(""); setExpiry("");
    setIsAddingCard(false);
    setIsSubmitting(false);
  };

  const handleDeleteCard = async (id: string) => {
    if (confirm("Delete this credit card and all its transactions?")) {
      await deleteCreditCard(id);
      if (activeCardId === id) setActiveCardId("");
    }
  };

  // Auto calculate monthly EMI helper
  const handleCalculateEmi = () => {
    const p = parseFloat(txAmount) || 0;
    const rAnnual = parseFloat(txInterestRate) || 0;
    const n = parseInt(txTenure) || 0;
    
    if (p > 0 && n > 0) {
      if (rAnnual > 0) {
        const r = rAnnual / 12 / 100;
        const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        setTxMonthlyEmi(emi.toFixed(2));
      } else {
        setTxMonthlyEmi((p / n).toFixed(2));
      }
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCardId || !txTitle || !txAmount || !txDate) return;
    setIsSubmitting(true);

    await addCreditCardTransaction(
      activeCardId,
      isEmi,
      txTitle,
      parseFloat(txAmount),
      txDate,
      isEmi && txInterestRate ? parseFloat(txInterestRate) : undefined,
      isEmi && txTenure ? parseInt(txTenure) : undefined,
      isEmi && txMonthlyEmi ? parseFloat(txMonthlyEmi) : undefined
    );

    setTxTitle(""); setTxAmount(""); setTxDate("");
    setTxInterestRate(""); setTxTenure(""); setTxMonthlyEmi("");
    setIsSubmitting(false);
  };

  const handleToggleEmi = async (txId: string, monthIndex: number) => {
    await toggleEmiMonthPaid(txId, monthIndex);
  };

  const handleDeleteTx = async (txId: string) => {
    if (confirm("Delete this transaction?")) {
      await deleteCreditCardTransaction(txId);
    }
  };

  const activeCard = creditCards.find(c => c.id === activeCardId);

  return (
    <div style={{ paddingBottom: '120px' }}>
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 16px 24px' }}>
        <button onClick={() => router.back()} style={{ width: '40px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
          <ChevronLeft size={28} />
        </button>
        <div className="page-title">Credit Cards</div>
        <div style={{ width: '40px' }}></div>
      </div>

      <div style={{ padding: '0 24px' }}>
        
        {/* Card Selector & Add Card */}
        <div className="animate-in delay-1" style={{ marginBottom: '24px' }}>
          {creditCards.length > 0 && !isAddingCard ? (
            <div className="flex justify-between align-center mb-3">
              <select 
                className="form-input" 
                style={{ width: 'auto', flex: 1, marginRight: '12px', padding: '12px', fontSize: '1.1rem', fontWeight: '600', backgroundColor: 'var(--glass-bg)' }}
                value={activeCardId}
                onChange={(e) => setActiveCardId(e.target.value)}
              >
                {creditCards.map(c => (
                  <option key={c.id} value={c.id}>{c.bankName} (...{c.last4})</option>
                ))}
              </select>
              <button className="btn" style={{ width: 'auto', padding: '12px', borderRadius: '12px' }} onClick={() => setIsAddingCard(true)}>
                <Plus size={20} />
              </button>
            </div>
          ) : null}

          {isAddingCard && (
            <div className="card" style={{ padding: '20px' }}>
              <div className="flex justify-between align-center mb-3">
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Add Credit Card</h3>
                {creditCards.length > 0 && (
                  <button onClick={() => setIsAddingCard(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>Cancel</button>
                )}
              </div>
              <form onSubmit={handleAddCard} className="flex flex-col gap-2">
                <input type="text" className="form-input" placeholder="Bank Name (e.g. HDFC)" value={bankName} onChange={e => setBankName(e.target.value)} required />
                <div className="flex gap-2">
                  <input type="text" className="form-input" placeholder="Last 4 Digits" maxLength={4} value={last4} onChange={e => setLast4(e.target.value)} required />
                  <input type="text" className="form-input" placeholder="MM/YY" maxLength={5} value={expiry} onChange={e => setExpiry(e.target.value)} required />
                </div>
                <button type="submit" className="btn mt-2" disabled={isSubmitting}>Add Card</button>
              </form>
            </div>
          )}
        </div>

        {/* Transactions for Active Card */}
        {activeCard && !isAddingCard && (
          <div className="animate-in delay-2">
            
            <div className="flex justify-between align-center mb-3">
              <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>New Expense / EMI</h2>
              <button onClick={() => handleDeleteCard(activeCard.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.85rem' }}>Delete Card</button>
            </div>

            {/* Add Transaction Form */}
            <div className="card" style={{ padding: '20px', marginBottom: '32px' }}>
              <div className="flex gap-2 mb-4" style={{ background: 'var(--glass-bg)', padding: '4px', borderRadius: '12px' }}>
                <button 
                  onClick={() => setIsEmi(false)}
                  style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: !isEmi ? 'var(--static-highlight)' : 'transparent', color: !isEmi ? '#000' : 'var(--text-muted)', fontWeight: !isEmi ? '600' : '400' }}
                >Regular Expense</button>
                <button 
                  onClick={() => setIsEmi(true)}
                  style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: isEmi ? 'var(--static-highlight)' : 'transparent', color: isEmi ? '#000' : 'var(--text-muted)', fontWeight: isEmi ? '600' : '400' }}
                >EMI</button>
              </div>

              <form onSubmit={handleAddTransaction} className="flex flex-col gap-2">
                <input type="text" className="form-input" placeholder={isEmi ? "EMI Title (e.g. iPhone)" : "Expense Title"} value={txTitle} onChange={e => setTxTitle(e.target.value)} required />
                
                <div className="flex gap-2">
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{currencySymbol}</span>
                    <input type="number" step="0.01" className="form-input" style={{ paddingLeft: '28px' }} placeholder={isEmi ? "Total Loan Amount" : "Amount"} value={txAmount} onChange={e => setTxAmount(e.target.value)} required />
                  </div>
                  <input type="date" className="form-input" style={{ flex: 1 }} value={txDate} onChange={e => setTxDate(e.target.value)} required />
                </div>

                {isEmi && (
                  <>
                    <div className="flex gap-2">
                      <input type="number" step="0.01" className="form-input" placeholder="Interest Rate % (Opt)" value={txInterestRate} onChange={e => setTxInterestRate(e.target.value)} />
                      <input type="number" className="form-input" placeholder="Tenure (Months)" value={txTenure} onChange={e => setTxTenure(e.target.value)} required />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{currencySymbol}</span>
                        <input type="number" step="0.01" className="form-input" style={{ paddingLeft: '28px' }} placeholder="Monthly EMI" value={txMonthlyEmi} onChange={e => setTxMonthlyEmi(e.target.value)} required />
                      </div>
                      <button type="button" onClick={handleCalculateEmi} style={{ padding: '0 16px', height: '52px', borderRadius: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>Auto Calc</button>
                    </div>
                  </>
                )}

                <button type="submit" className="btn mt-2" disabled={isSubmitting}>Add {isEmi ? 'EMI' : 'Expense'}</button>
              </form>
            </div>

            {/* List Transactions */}
            <h2 className="mb-3" style={{ fontSize: '1.2rem', fontWeight: '600' }}>History</h2>
            {activeCard.transactions.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', fontSize: '0.9rem', fontStyle: 'italic', padding: '16px 0' }}>No history found.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {activeCard.transactions.map((tx: any) => {
                  let paidMonths: number[] = [];
                  try { paidMonths = JSON.parse(tx.paidMonths); } catch (e) {}
                  
                  return (
                    <div key={tx.id} style={{ padding: '16px', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                      <div className="flex justify-between align-center mb-2">
                        <div>
                          <div className="flex align-center gap-2">
                            <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '2px 8px', borderRadius: '8px', background: tx.isEmi ? 'rgba(139, 92, 246, 0.15)' : 'rgba(249, 115, 22, 0.15)', color: tx.isEmi ? '#8b5cf6' : '#f97316' }}>
                              {tx.isEmi ? 'EMI' : 'EXPENSE'}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                          </div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '4px' }}>{tx.title}</h3>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button onClick={() => setEditModalData({ type: "CREDIT_CARD_TX", data: tx })} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteTx(tx.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', opacity: 0.5 }}>
                            <Trash2 size={16} />
                          </button>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '4px' }}>
                            {currencySymbol}{tx.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {tx.isEmi && tx.tenure && (
                        <div style={{ marginTop: '12px', borderTop: '1px dashed var(--glass-border)', paddingTop: '12px' }}>
                          <div className="flex justify-between align-center" style={{ fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Progress: {paidMonths.length} / {tx.tenure} Paid</span>
                            <span style={{ fontWeight: '600' }}>EMI: {currencySymbol}{tx.monthlyEmi?.toLocaleString()}</span>
                          </div>

                          <button 
                            onClick={() => setExpandedEmiId(expandedEmiId === tx.id ? null : tx.id)}
                            style={{ width: '100%', marginTop: '12px', padding: '8px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--glass-border)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500' }}
                          >
                            {expandedEmiId === tx.id ? 'Hide Calendar' : 'View EMI Calendar'}
                          </button>

                          {expandedEmiId === tx.id && (
                            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {Array.from({ length: tx.tenure }).map((_, i) => {
                                const emiDate = new Date(tx.date);
                                emiDate.setMonth(emiDate.getMonth() + i);
                                const isPaid = paidMonths.includes(i);

                                return (
                                  <div key={i} onClick={() => handleToggleEmi(tx.id, i)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: isPaid ? 'rgba(16, 185, 129, 0.1)' : 'var(--glass-bg)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    <div className="flex align-center gap-3">
                                      {isPaid ? <CheckCircle2 size={20} color="var(--success)" /> : <Circle size={20} color="var(--text-muted)" />}
                                      <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '500', color: isPaid ? 'var(--text-primary)' : 'var(--text-muted)', textDecoration: isPaid ? 'line-through' : 'none' }}>
                                          Month {i + 1}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                          {emiDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                      </div>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: isPaid ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isPaid ? 'line-through' : 'none' }}>
                                      {currencySymbol}{tx.monthlyEmi?.toLocaleString()}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

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
