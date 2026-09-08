"use client";

import { useRouter } from "next/navigation";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, ArrowRightLeft, Smartphone, Car, ShoppingBag, Landmark } from "lucide-react";

export default function ClientCardDetails({ card, index }: { card: any, index: number }) {
  const router = useRouter();
  const { currencySymbol } = useCurrency();

  const gradients = [
    'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
    'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 100%)',
    'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 100%)',
  ];
  const gradient = gradients[index % gradients.length];

  // Mocked income and expenses to match screenshot vibe since we don't have true transaction linking
  const income = card.availableBalance * 0.72;
  const expenses = card.totalLimit - card.availableBalance;

  const mockTransactions = [
    { id: 1, name: "Money Transfer", time: "12:35 PM", amount: -450, icon: <ArrowRightLeft />, bg: "transparent" },
    { id: 2, name: "Paypal", time: "10:20 AM", amount: 1200, icon: <Smartphone />, bg: "transparent" },
    { id: 3, name: "Uber", time: "08:40 AM", amount: -150, icon: <Car />, bg: "transparent" },
    { id: 4, name: "Bata Store", time: "Yesterday", amount: -200, icon: <ShoppingBag />, bg: "transparent" },
    { id: 5, name: "Bank Transfer", time: "Yesterday", amount: -600, icon: <Landmark />, bg: "transparent" },
  ];

  return (
    <div style={{ paddingBottom: '120px' }}>
      {/* Header */}
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 16px 24px' }}>
        <div style={{ width: '40px', textAlign: 'left' }}>
          <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0 }}>
            <ChevronLeft size={28} />
          </button>
        </div>
        <div className="page-title">Card Details</div>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Top Gradient Card Box */}
      <div className="animate-in delay-1" style={{ padding: '0 24px', marginBottom: '32px' }}>
        <div style={{ 
          background: gradient,
          borderRadius: '32px',
          padding: '32px',
          color: 'var(--text-primary)',
          boxShadow: 'var(--glass-shadow)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(24px)'
        }}>
          <div className="flex justify-between align-center mb-2">
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Total Balance ⌄</div>
            <div style={{ letterSpacing: '2px', cursor: 'pointer' }}>•••</div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '32px' }}>
            {currencySymbol}{card.availableBalance.toLocaleString()}
          </div>

          <div className="flex justify-between">
            <div>
              <div className="flex align-center mb-1" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', fontSize: '0.7rem' }}>↓</span> 
                Income
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{currencySymbol}{income.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
            <div>
              <div className="flex align-center mb-1" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', fontSize: '0.7rem' }}>↑</span> 
                Expenses
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{currencySymbol}{expenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="animate-in delay-2" style={{ padding: '0 24px' }}>
        <div className="flex justify-between align-center mb-4">
          <h2 className="serif" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Transactions</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}>See All</div>
        </div>
        
        <div className="tx-list">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="flex justify-between align-center" style={{ marginBottom: '24px' }}>
              <div className="flex align-center">
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: tx.bg, 
                  border: '1px solid var(--static-highlight)',
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                  marginRight: '16px'
                }}>
                  {tx.icon}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '4px' }}>{tx.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tx.time}</div>
                </div>
              </div>
              <div style={{ fontWeight: '600', color: tx.amount < 0 ? 'var(--danger)' : 'var(--success)', fontSize: '1.1rem' }}>
                {tx.amount > 0 ? '+' : ''}{currencySymbol}{Math.abs(tx.amount).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
