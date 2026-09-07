"use client";

import { useRouter } from "next/navigation";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, Maximize2, Wallet, Receipt, Upload, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export default function ClientAddPage({ recentExpenses }: { recentExpenses: any[] }) {
  const router = useRouter();
  const { currencySymbol } = useCurrency();

  return (
    <div style={{ padding: '24px', paddingBottom: '120px' }}>
      {/* Header */}
      <div className="top-bar-centered animate-in" style={{ padding: '0 0 24px 0' }}>
        <div style={{ width: '40px', textAlign: 'left' }}>
          <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0 }}>
            <ChevronLeft size={28} />
          </button>
        </div>
        <div className="page-title">Add</div>
        <div style={{ width: '40px', textAlign: 'right', cursor: 'pointer', opacity: 0.8, color: 'var(--text-primary)' }}>
          <Maximize2 size={20} />
        </div>
      </div>

      {/* Add Buttons */}
      <div className="animate-in delay-1" style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => alert("Income tracking coming soon!")}
          style={{ 
            flex: 1, 
            background: 'var(--glass-bg)', 
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px', 
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px', color: '#8b5cf6' }}><ArrowUpCircle /></div>
          <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Add Income</div>
        </button>
        
        <button 
          onClick={() => router.push("/expenses")}
          style={{ 
            flex: 1, 
            background: 'var(--glass-bg)', 
            border: '1px solid rgba(249, 115, 22, 0.3)',
            borderRadius: '16px', 
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px', color: '#f97316' }}><ArrowDownCircle /></div>
          <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Add Expense</div>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="animate-in delay-2">
        <h2 className="serif mb-4" style={{ fontSize: '1.4rem' }}>Quick Actions</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div className="card flex flex-col align-center" style={{ margin: 0, padding: '24px 16px', cursor: 'pointer' }}>
            <div className="tx-icon" style={{ margin: '0 0 16px 0', borderColor: 'var(--text-muted)' }}><Upload size={24} color="var(--text-primary)" /></div>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Import CSV</span>
          </div>
          
          <div className="card flex flex-col align-center" style={{ margin: 0, padding: '24px 16px', cursor: 'pointer' }}>
            <div className="tx-icon" style={{ margin: '0 0 16px 0', borderColor: 'var(--text-muted)' }}><Receipt size={24} color="var(--text-primary)" /></div>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Scan Receipt</span>
          </div>
        </div>
      </div>

      {/* Last Added */}
      <div className="animate-in delay-3">
        <h2 className="serif" style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Last Added</h2>
        
        <div className="tx-list">
          {recentExpenses.length === 0 && (
            <div style={{ opacity: 0.5, fontStyle: 'italic' }}>No recent transactions.</div>
          )}
          {recentExpenses.map((exp: any) => (
            <div key={exp.id} className="flex justify-between align-center" style={{ marginBottom: '20px' }}>
              <div className="flex align-center">
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'var(--glass-bg)', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginRight: '16px'
                }}>
                  {/* Pseudo icon based on title */}
                  {exp.title.toLowerCase().includes('food') ? '🍔' : exp.title.toLowerCase().includes('bill') ? '🧾' : '🛒'}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '4px' }}>{exp.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(exp.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: '600', color: 'var(--danger)', fontSize: '1.1rem' }}>
                -{currencySymbol}{exp.monthlyCost.toLocaleString()}
              </div>
            </div>
          ))}
          
          {/* Mock Incomes to match screenshot vibe */}
          {recentExpenses.length > 0 && (
            <>
              <div className="flex justify-between align-center" style={{ marginBottom: '20px' }}>
                <div className="flex align-center">
                  <div style={{ width: '48px', height: '48px', background: 'var(--glass-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginRight: '16px' }}>💵</div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '4px' }}>Salary</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>30 Apr 2026</div>
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: 'var(--success)', fontSize: '1.1rem' }}>+{currencySymbol}1500</div>
              </div>
              
              <div className="flex justify-between align-center" style={{ marginBottom: '20px' }}>
                <div className="flex align-center">
                  <div style={{ width: '48px', height: '48px', background: 'var(--glass-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginRight: '16px' }}>📱</div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '4px' }}>Paypal</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>28 Apr 2026</div>
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: 'var(--success)', fontSize: '1.1rem' }}>+{currencySymbol}350</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
