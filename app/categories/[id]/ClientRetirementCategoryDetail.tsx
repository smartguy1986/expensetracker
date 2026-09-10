"use client";

import { useState } from "react";
import { addRetirementInvestment, deleteRetirementInvestment, updateRetirementPaidTerms, updateRetirementInvestment, updateRetirementWithdrawn } from "@/app/actions";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, ChevronDown, ChevronUp, Trash2, Edit2, TrendingUp, Calendar, CheckCircle2, Circle, AlertCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import GlobalEditModal, { EntityType } from "../../components/GlobalEditModal";

export default function ClientRetirementCategoryDetail({ investments }: { investments: any[] }) {
  const router = useRouter();
  const { currencySymbol } = useCurrency();
  
  const [name, setName] = useState("");
  const [type, setType] = useState("Mutual Fund");
  const [fundName, setFundName] = useState("");
  const [provider, setProvider] = useState("");
  const [startDate, setStartDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Monthly");
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editModalData, setEditModalData] = useState<{ type: EntityType, data: any } | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !provider.trim() || !startDate || !installmentAmount) return;
    
    setIsSubmitting(true);
    await addRetirementInvestment({
      name,
      type,
      fundName: type === "Mutual Fund" ? fundName : null,
      provider,
      startDate,
      paymentTerms,
      installmentAmount: parseFloat(installmentAmount),
      currentValue: 0
    });
    
    setName("");
    setFundName("");
    setProvider("");
    setStartDate("");
    setInstallmentAmount("");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this investment?")) {
      await deleteRetirementInvestment(id);
    }
  };

  const handleUpdateCurrentValue = async (id: string, currentValue: string) => {
    const val = parseFloat(currentValue);
    if (!isNaN(val)) {
      await updateRetirementInvestment(id, { currentValue: val });
    }
  };

  const getTermMonths = (term: string) => {
    switch (term) {
      case "Monthly": return 1;
      case "Quarterly": return 3;
      case "Half Yearly": return 6;
      case "Yearly": return 12;
      default: return 1;
    }
  };

  return (
    <div style={{ paddingBottom: '120px' }}>
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 16px 24px' }}>
        <button onClick={() => router.back()} style={{ width: '40px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
          <ChevronLeft size={28} />
        </button>
        <div className="page-title">Retirement Investments</div>
        <div style={{ width: '40px' }}></div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {/* New Investment Form */}
        <div className="card animate-in delay-1">
          <h2 className="mb-3" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>Add Investment</h2>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" className="form-input" style={{ marginBottom: 0 }} value={name} onChange={(e) => setName(e.target.value)} required placeholder="Investment Name (e.g. My Pension)" />
            
            <select className="form-input" style={{ marginBottom: 0 }} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Mutual Fund">Mutual Fund</option>
              <option value="PPF">PPF</option>
              <option value="NPS">NPS</option>
              <option value="LIC">LIC</option>
              <option value="Other">Other</option>
            </select>
            
            {type === "Mutual Fund" && (
              <input type="text" className="form-input" style={{ marginBottom: 0 }} value={fundName} onChange={(e) => setFundName(e.target.value)} placeholder="Fund Name (e.g. Axis Bluechip)" />
            )}
            
            <input type="text" className="form-input" style={{ marginBottom: 0 }} value={provider} onChange={(e) => setProvider(e.target.value)} required placeholder="Provider (e.g. SBI, Zerodha)" />
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <input type="date" className="form-input" style={{ marginBottom: 0, flex: 1 }} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              <select className="form-input" style={{ marginBottom: 0, flex: 1 }} value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half Yearly">Half Yearly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            
            <input type="number" step="0.01" className="form-input" style={{ marginBottom: 0 }} value={installmentAmount} onChange={(e) => setInstallmentAmount(e.target.value)} required placeholder={`Installment Amount (${currencySymbol})`} />

            <button type="submit" className="btn w-100" disabled={isSubmitting} style={{ marginTop: '8px' }}>
              {isSubmitting ? "Adding..." : "Add Investment"}
            </button>
          </form>
        </div>

        {/* Existing Investments List */}
        <div className="animate-in delay-3" style={{ marginTop: '32px' }}>
          <h2 className="serif" style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Your Investments</h2>
          {investments.length === 0 && (
            <div style={{ opacity: 0.5, fontStyle: 'italic', textAlign: 'center', padding: '24px' }}>
              No retirement investments found.
            </div>
          )}
          
          {investments.map((inv: any) => (
            <InvestmentCard 
              key={inv.id} 
              inv={inv} 
              currencySymbol={currencySymbol} 
              setEditModalData={setEditModalData} 
              handleDelete={handleDelete} 
              handleUpdateCurrentValue={handleUpdateCurrentValue}
              getTermMonths={getTermMonths}
            />
          ))}
        </div>
      </div>

      {editModalData && (
        <GlobalEditModal 
          onClose={() => setEditModalData(null)} 
          entityType={editModalData.type} 
          entityData={editModalData.data} 
        />
      )}
    </div>
  );
}

function InvestmentCard({ inv, currencySymbol, setEditModalData, handleDelete, handleUpdateCurrentValue, getTermMonths }: any) {
  const [paidTerms, setPaidTerms] = useState<Record<number, number>>(() => {
    try { 
      const parsed = JSON.parse(inv.paidTerms);
      if (Array.isArray(parsed)) {
        const dict: Record<number, number> = {};
        parsed.forEach(p => dict[p] = inv.installmentAmount);
        return dict;
      }
      return parsed || {}; 
    } catch(e) { return {}; }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const totalInvested = Object.values(paidTerms).reduce((sum: number, val: number) => sum + val, 0);
  const totalWithdrawn = inv.totalWithdrawn || 0;
  const currentReturns = inv.currentValue > 0 ? ((inv.currentValue + totalWithdrawn) - totalInvested) : 0;
  const returnPercent = totalInvested > 0 ? ((currentReturns / totalInvested) * 100).toFixed(2) : "0.00";

  // Generate terms since inception
  const sDate = new Date(inv.startDate);
  const now = new Date();
  const monthsPassed = (now.getFullYear() - sDate.getFullYear()) * 12 + (now.getMonth() - sDate.getMonth());
  const termInterval = getTermMonths(inv.paymentTerms);
  
  const termsToDisplay = [];
  for (let i = 0; i <= Math.max(monthsPassed, 0); i += termInterval) {
    termsToDisplay.push(i);
  }

  const handleToggle = (mIndex: number) => {
    const newTerms = { ...paidTerms };
    if (newTerms[mIndex] !== undefined) {
      delete newTerms[mIndex];
    } else {
      newTerms[mIndex] = inv.installmentAmount;
    }
    setPaidTerms(newTerms);
  };

  const handleAmountChange = (mIndex: number, amount: string) => {
    const newTerms = { ...paidTerms };
    if (amount === "") {
        newTerms[mIndex] = 0;
    } else {
        newTerms[mIndex] = parseFloat(amount) || 0;
    }
    setPaidTerms(newTerms);
  };

  const handleSaveTracking = async () => {
    setIsSaving(true);
    await updateRetirementPaidTerms(inv.id, paidTerms);
    setIsSaving(false);
  };

  return (
    <div className="card" style={{ marginBottom: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex justify-between align-center mb-3">
          <div className="flex align-center gap-3">
            <div style={{ width: '40px', height: '40px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{inv.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inv.type} • {inv.provider}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditModalData({ type: "RETIREMENT_INVESTMENT", data: inv })} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', opacity: 0.6 }}>
              <Edit2 size={18} />
            </button>
            <button onClick={() => handleDelete(inv.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.8 }}>
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        {inv.fundName && (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Fund: {inv.fundName}
          </div>
        )}
        
        <div className="flex justify-between" style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Start Date</div>
            <div style={{ fontWeight: '500' }}>{new Date(inv.startDate).toLocaleDateString()}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)' }}>Withdrawn</div>
            <div style={{ fontWeight: '500' }}>{currencySymbol}{totalWithdrawn.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'var(--text-muted)' }}>Installment</div>
            <div style={{ fontWeight: '500' }}>{currencySymbol}{inv.installmentAmount.toLocaleString()}</div>
          </div>
        </div>

        <div style={{ background: 'var(--glass-bg)', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Invested</div>
            <div style={{ fontWeight: '600' }}>{currencySymbol}{totalInvested.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Returns</div>
            <div style={{ fontWeight: '600', color: currentReturns >= 0 ? '#10b981' : '#ef4444' }}>
              {currentReturns >= 0 ? '+' : ''}{currencySymbol}{currentReturns.toLocaleString()} ({returnPercent}%)
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Update Current Value</div>
            <input 
              type="number" 
              className="form-input" 
              style={{ marginBottom: 0, width: '100%' }} 
              placeholder={inv.currentValue.toString()}
              id={`val-${inv.id}`}
            />
          </div>
          
          <button 
            className="btn" 
            style={{ 
              width: '42px', height: '42px', borderRadius: '50%', padding: 0, 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}
            onClick={async () => {
              const elVal = document.getElementById(`val-${inv.id}`) as HTMLInputElement;
              const elWithdrawn = document.getElementById(`withdrawn-${inv.id}`) as HTMLInputElement;
              let isUpdated = false;
              
              if (elVal && elVal.value) {
                await handleUpdateCurrentValue(inv.id, elVal.value);
                isUpdated = true;
              }
              if (elWithdrawn && elWithdrawn.value) {
                await updateRetirementWithdrawn(inv.id, parseFloat(elWithdrawn.value));
                isUpdated = true;
              }
              
              if (isUpdated) {
                if (elVal) elVal.value = "";
                if (elWithdrawn) elWithdrawn.value = "";
              }
            }}
          >
            <Save size={18} />
          </button>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Update Withdrawn</div>
            <input 
              type="number" 
              className="form-input" 
              style={{ marginBottom: 0, width: '100%' }} 
              placeholder={totalWithdrawn.toString()}
              id={`withdrawn-${inv.id}`}
            />
          </div>
        </div>
      </div>

      {/* Term tracking */}
      <div style={{ padding: '20px', background: 'rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Payment Tracking</div>
            {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
          </div>
          {isExpanded && (
            <button 
              className="btn" 
              style={{ padding: '6px 16px', fontSize: '0.8rem', borderRadius: '20px', width: 'auto', marginLeft: 'auto' }} 
              onClick={handleSaveTracking} 
              disabled={isSaving}
            >
              {isSaving ? "Updating..." : "Update"}
            </button>
          )}
        </div>
        
        {isExpanded && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px', marginTop: '16px' }}>
            {termsToDisplay.map((mIndex) => {
               const tDate = new Date(sDate.getFullYear(), sDate.getMonth() + mIndex, 1);
               const isPaid = paidTerms[mIndex] !== undefined;
               
               return (
                 <div 
                   key={mIndex}
                   style={{ 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: '6px', 
                     padding: '8px', 
                     background: isPaid ? 'rgba(16, 185, 129, 0.1)' : 'var(--glass-bg)',
                     border: `1px solid ${isPaid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(0,0,0,0.1)'}`,
                     borderRadius: '8px',
                     fontSize: '0.8rem'
                   }}
                 >
                   <div onClick={() => handleToggle(mIndex)} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                     {isPaid ? <CheckCircle2 size={16} color="#10b981" /> : <Circle size={16} color="var(--text-muted)" />}
                     <span>{tDate.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}</span>
                   </div>
                   {isPaid && (
                     <input 
                       type="number" 
                       value={paidTerms[mIndex] === 0 ? "" : paidTerms[mIndex]} 
                       onChange={(e) => handleAmountChange(mIndex, e.target.value)} 
                       style={{ width: '60px', padding: '2px 4px', fontSize: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'transparent', marginLeft: 'auto', color: 'var(--text-primary)' }} 
                     />
                   )}
                 </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
