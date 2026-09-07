"use client";

import { useState } from "react";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, MoreHorizontal } from "lucide-react";

export default function ClientStatistics({ initialExpenses, categories, profile, totalBalance }: any) {
  const { currencySymbol } = useCurrency();
  const [filter, setFilter] = useState("Weekly");
  const [activeTab, setActiveTab] = useState("Spent");

  // Group expenses by category
  const categoryTotals: Record<string, number> = {};
  initialExpenses.forEach((exp: any) => {
    categoryTotals[exp.categoryId] = (categoryTotals[exp.categoryId] || 0) + exp.monthlyCost;
  });

  // Sort categories by highest spend
  const sortedCategories = categories
    .map((cat: any) => ({
      ...cat,
      total: categoryTotals[cat.id] || 0
    }))
    .filter((cat: any) => cat.total > 0)
    .sort((a: any, b: any) => b.total - a.total);

  // Mock icons/colors for categories
  const getCategoryTheme = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('bill') || n.includes('fixed')) return { icon: '🧾', bg: 'rgba(96, 165, 250, 0.2)', color: '#60a5fa' };
    if (n.includes('shop') || n.includes('variable')) return { icon: '🛍️', bg: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa' };
    if (n.includes('tution') || n.includes('loan') || n.includes('emi')) return { icon: '📘', bg: 'rgba(251, 146, 60, 0.2)', color: '#fb923c' };
    return { icon: '✨', bg: 'rgba(52, 211, 153, 0.2)', color: '#34d399' };
  };

  return (
    <div style={{ paddingBottom: '120px' }}>
      {/* Header */}
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 16px 24px' }}>
        <div style={{ width: '40px', textAlign: 'left' }}>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0 }}>
            <ChevronLeft size={28} />
          </button>
        </div>
        <div className="page-title">Statistics</div>
        <div style={{ width: '40px', textAlign: 'right', cursor: 'pointer', opacity: 0.8, color: 'var(--text-primary)' }}>
          <MoreHorizontal size={24} />
        </div>
      </div>

      {/* Balance & Filter */}
      <div className="flex justify-between align-center animate-in delay-1" style={{ padding: '0 24px', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px', letterSpacing: '-0.5px' }}>
            {currencySymbol}{totalBalance > 0 ? totalBalance.toLocaleString() : '5,044.00'}
          </h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Current Balance</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ 
              background: 'var(--glass-bg)', 
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '6px 12px',
              fontSize: '0.9rem',
              marginBottom: '4px',
              outline: 'none'
            }}
          >
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Jun 06 - 12</div>
        </div>
      </div>

      {/* Toggle */}
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <div style={{ 
          display: 'flex', 
          background: 'var(--glass-bg)', 
          borderRadius: '16px', 
          padding: '4px',
          border: '1px solid var(--glass-border)'
        }}>
          <button 
            onClick={() => setActiveTab("Income")}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              background: activeTab === "Income" ? 'var(--static-highlight)' : 'transparent',
              color: activeTab === "Income" ? '#000' : 'var(--text-primary)',
              border: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Income
          </button>
          <button 
            onClick={() => setActiveTab("Spent")}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              background: activeTab === "Spent" ? 'var(--static-highlight)' : 'transparent',
              color: activeTab === "Spent" ? '#000' : 'var(--text-primary)',
              border: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Spent
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div style={{ position: 'relative', height: '240px', marginBottom: '32px', padding: '0 12px' }}>
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--static-highlight)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--static-highlight)" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Vertical Grid Lines */}
          {[10, 25, 40, 55, 70, 85].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          ))}
          
          {/* Chart fill */}
          <path 
            d="M 0 35 C 10 25, 20 40, 35 25 C 45 15, 55 10, 65 20 C 75 30, 85 30, 100 15 L 100 50 L 0 50 Z" 
            fill="url(#chartGradient)" 
          />
          
          {/* Chart line */}
          <path 
            d="M 0 35 C 10 25, 20 40, 35 25 C 45 15, 55 10, 65 20 C 75 30, 85 30, 100 15" 
            fill="none" 
            stroke="var(--static-highlight)" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Tooltip Point */}
          <circle cx="50" cy="12.5" r="2" fill="var(--static-highlight)" />
          <circle cx="50" cy="12.5" r="4" fill="none" stroke="var(--static-highlight)" strokeWidth="1" />
          
          {/* Tooltip Box */}
          <g transform="translate(50, 4)">
            <rect x="-20" y="-8" width="40" height="12" rx="4" fill="#fbbf24" />
            <text x="0" y="-0.5" fill="#000" fontSize="5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
              {currencySymbol}896.24
            </text>
            <polygon points="-3,4 3,4 0,7" fill="#fbbf24" />
          </g>
          
          {/* X Axis Labels */}
          <g fill="var(--text-muted)" fontSize="4" textAnchor="middle">
            <text x="10" y="55">Mon</text>
            <text x="25" y="55">Tue</text>
            <text x="40" y="55">Wed</text>
            <text x="55" y="55">Thu</text>
            <text x="70" y="55">Fri</text>
            <text x="85" y="55">Sat</text>
            <text x="100" y="55">Sun</text>
          </g>
        </svg>
      </div>

      {/* Category Cards */}
      <div style={{ padding: '0 24px' }}>
        <h2 className="serif" style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Total Spent</h2>
        
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', margin: '0 -24px', paddingLeft: '24px', paddingRight: '24px' }}>
          {sortedCategories.map((cat: any) => {
            const theme = getCategoryTheme(cat.name);
            return (
              <div 
                key={cat.id} 
                style={{ 
                  background: theme.bg, 
                  minWidth: '120px', 
                  padding: '20px 16px', 
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: `1px solid ${theme.color}40`, // 40 hex opacity
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '12px', background: theme.color, width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                  {theme.icon}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px', textAlign: 'center', textTransform: 'capitalize' }}>
                  {cat.name}
                </div>
                <div style={{ color: theme.color, fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {currencySymbol}{cat.total.toLocaleString()}
                </div>
              </div>
            );
          })}
          
          {sortedCategories.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No expenses found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
