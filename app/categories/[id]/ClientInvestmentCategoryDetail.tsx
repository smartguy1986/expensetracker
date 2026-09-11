"use client";

import { useState } from "react";
import { addInvestment, deleteInvestment, addInvestmentTransaction, deleteInvestmentTransaction, updateInvestment } from "@/app/actions";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, Trash2, Edit2, TrendingUp, Calendar, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import GlobalEditModal, { EntityType } from "../../components/GlobalEditModal";

export default function ClientInvestmentCategoryDetail({ investments }: { investments: any[] }) {
  const router = useRouter();
  const { currencySymbol } = useCurrency();
  
  const [name, setName] = useState("");
  const [type, setType] = useState("Mutual Fund");
  const [provider, setProvider] = useState("");
  const [startDate, setStartDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editModalData, setEditModalData] = useState<{ type: EntityType, data: any } | null>(null);
  
  // Collapse state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Transaction Modal State
  const [txModalInvestmentId, setTxModalInvestmentId] = useState<string | null>(null);
  const [txModalType, setTxModalType] = useState<"DEPOSIT" | "WITHDRAWAL">("DEPOSIT");
  const [txAmount, setTxAmount] = useState("");
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [isTxSubmitting, setIsTxSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !provider.trim() || !startDate) return;
    
    setIsSubmitting(true);
    await addInvestment({
      name,
      type,
      provider,
      startDate,
      currentValue: 0
    });
    
    setName("");
    setProvider("");
    setStartDate("");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this investment portfolio? This will delete all its transactions too.")) {
      await deleteInvestment(id);
    }
  };

  const handleUpdateCurrentValue = async (id: string, currentValue: string) => {
    const val = parseFloat(currentValue);
    if (!isNaN(val)) {
      await updateInvestment(id, { currentValue: val });
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txModalInvestmentId || !txAmount || !txDate) return;

    setIsTxSubmitting(true);
    await addInvestmentTransaction(txModalInvestmentId, txModalType, parseFloat(txAmount), txDate);
    
    setTxModalInvestmentId(null);
    setTxAmount("");
    setIsTxSubmitting(false);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm("Delete this transaction?")) {
      await deleteInvestmentTransaction(id);
    }
  };

  return (
    <div style={{ paddingBottom: '120px' }}>
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 16px 24px' }}>
        <button onClick={() => router.back()} style={{ width: '40px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
          <ChevronLeft size={28} />
        </button>
        <div className="page-title">Investments</div>
        <div style={{ width: '40px' }}></div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {/* New Investment Form */}
        <div className="card animate-in delay-1">
          <h2 className="mb-3" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>New Portfolio</h2>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" className="form-input" style={{ marginBottom: 0 }} value={name} onChange={(e) => setName(e.target.value)} required placeholder="Portfolio Name (e.g. Zerodha Stocks)" />
            
            <select className="form-input" style={{ marginBottom: 0 }} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Mutual Fund">Mutual Fund</option>
              <option value="Stocks">Stocks</option>
              <option value="Fixed Deposit">Fixed Deposit</option>
              <option value="Crypto">Crypto</option>
              <option value="Other">Other</option>
            </select>
            
            <input type="text" className="form-input" style={{ marginBottom: 0 }} value={provider} onChange={(e) => setProvider(e.target.value)} required placeholder="Provider/Broker (e.g. Groww, HDFC)" />
            
            <input type="date" className="form-input" style={{ marginBottom: 0, padding: '14px' }} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />

            <button type="submit" className="btn w-100" style={{ marginTop: '8px' }} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Portfolio"}
            </button>
          </form>
        </div>

        {/* Active Investments */}
        <div className="card mt-4 animate-in delay-2" style={{ marginTop: '24px' }}>
          <h2 className="mb-3" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>Active Portfolios</h2>
          {investments.length === 0 ? (
             <p className="text-muted" style={{ textAlign: 'center', fontSize: '0.9rem', fontStyle: 'italic', padding: '16px 0' }}>No investments recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {investments.map((inv: any) => {
                const totalInvested = inv.transactions
                  .filter((t: any) => t.type === "DEPOSIT")
                  .reduce((sum: number, t: any) => sum + t.amount, 0);
                  
                const totalWithdrawn = inv.transactions
                  .filter((t: any) => t.type === "WITHDRAWAL")
                  .reduce((sum: number, t: any) => sum + t.amount, 0);

                const netInvested = totalInvested - totalWithdrawn;
                const profit = inv.currentValue - netInvested;
                const profitPercent = netInvested > 0 ? (profit / netInvested) * 100 : 0;
                
                return (
                  <div key={inv.id} style={{ padding: '16px', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div className="flex justify-between align-center mb-3">
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>{inv.name}</h3>
                        <div className="flex align-center gap-1 text-muted" style={{ fontSize: '0.85rem' }}>
                          <span style={{ background: 'var(--glass-bg)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.75rem' }}>{inv.type}</span>
                          <span style={{ marginLeft: '4px' }}>{inv.provider}</span>
                        </div>
                      </div>
                      <div className="flex align-center gap-2">
                        <button onClick={() => setEditModalData({ type: "INVESTMENT" as any, data: inv })} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(inv.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px', opacity: 0.7 }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '0.85rem' }}>
                      <div style={{ background: 'var(--bg-color)', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Net Invested</div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{currencySymbol}{netInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </div>
                      <div style={{ background: 'var(--bg-color)', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Current Value</span>
                          <Edit2 size={12} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => {
                            const val = prompt("Update Current Value:", inv.currentValue.toString());
                            if (val !== null) handleUpdateCurrentValue(inv.id, val);
                          }} />
                        </div>
                        <div style={{ fontWeight: '700', color: inv.currentValue > netInvested ? 'var(--brand)' : 'var(--text-primary)', fontSize: '1.1rem' }}>
                          {currencySymbol}{inv.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        {netInvested > 0 && inv.currentValue > 0 && (
                          <div style={{ fontSize: '0.75rem', color: profit >= 0 ? 'var(--brand)' : 'var(--danger)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <TrendingUp size={10} style={{ transform: profit < 0 ? 'rotate(180deg)' : 'none' }} />
                            {profit >= 0 ? '+' : ''}{currencySymbol}{profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({profitPercent.toFixed(1)}%)
                          </div>
                        )}
                      </div>
                    </div>

                    <div 
                      style={{ padding: '12px 0 0 0', display: 'flex', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
                      onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
                    >
                      {expandedId === inv.id ? (
                        <div className="flex align-center gap-1" style={{ fontSize: '0.85rem' }}><ChevronUp size={16} /> Hide Details</div>
                      ) : (
                        <div className="flex align-center gap-1" style={{ fontSize: '0.85rem' }}><ChevronDown size={16} /> Manage & Transactions</div>
                      )}
                    </div>

                    {expandedId === inv.id && (
                      <div className="animate-in" style={{ marginTop: '16px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                          <button 
                            className="btn flex-1" 
                            style={{ padding: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                            onClick={() => { setTxModalInvestmentId(inv.id); setTxModalType("DEPOSIT"); }}
                          >
                            <Plus size={16} /> Deposit
                          </button>
                          <button 
                            className="btn btn-outline flex-1" 
                            style={{ padding: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', borderColor: 'var(--glass-border)' }}
                            onClick={() => { setTxModalInvestmentId(inv.id); setTxModalType("WITHDRAWAL"); }}
                          >
                            <Minus size={16} /> Withdraw
                          </button>
                        </div>

                        {inv.transactions.length > 0 && (
                          <div style={{ borderTop: '1px dashed var(--glass-border)', paddingTop: '12px' }}>
                            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Recent Transactions</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {inv.transactions.slice(0, 5).map((tx: any) => (
                                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '8px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ 
                                      width: '24px', height: '24px', borderRadius: '50%', 
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      background: tx.type === "DEPOSIT" ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                                      color: tx.type === "DEPOSIT" ? 'var(--brand)' : 'var(--danger)'
                                    }}>
                                      {tx.type === "DEPOSIT" ? <Plus size={12} /> : <Minus size={12} />}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{tx.type === "DEPOSIT" ? "Deposit" : "Withdrawal"}</div>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontWeight: '600', color: tx.type === "DEPOSIT" ? 'var(--text-primary)' : 'var(--text-primary)' }}>
                                      {tx.type === "DEPOSIT" ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    <Trash2 size={14} style={{ color: 'var(--danger)', opacity: 0.5, cursor: 'pointer' }} onClick={() => handleDeleteTransaction(tx.id)} />
                                  </div>
                                </div>
                              ))}
                            </div>
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
      </div>

      {/* Transaction Modal */}
      {txModalInvestmentId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '24px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
            <h2 className="mb-3" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>
              Record {txModalType === "DEPOSIT" ? "Deposit" : "Withdrawal"}
            </h2>
            <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{currencySymbol}</span>
                <input 
                  type="number" step="0.01" className="form-input" 
                  style={{ marginBottom: 0, paddingLeft: '32px' }} 
                  placeholder="Amount" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} required 
                />
              </div>
              <input type="date" className="form-input" style={{ marginBottom: 0 }} value={txDate} onChange={(e) => setTxDate(e.target.value)} required />
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="submit" className="btn flex-1" disabled={isTxSubmitting}>
                  {isTxSubmitting ? "Saving..." : "Save"}
                </button>
                <button type="button" className="btn btn-outline flex-1" onClick={() => setTxModalInvestmentId(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModalData && (
        <GlobalEditModal
          entityType={editModalData.type as any}
          entityData={editModalData.data}
          onClose={() => setEditModalData(null)}
        />
      )}
    </div>
  );
}
