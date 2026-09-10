"use client";

import { useState } from "react";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { ChevronLeft, MoreHorizontal, Receipt, ShoppingBag, CreditCard, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ClientStatistics({ initialExpenses, initialIncomes, fixedExpenses, variableExpenses, creditCards, categories, profile, totalBalance }: any) {
  const { currencySymbol } = useCurrency();
  const [filter, setFilter] = useState("Weekly");
  const [activeTab, setActiveTab] = useState("Spent");

  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();
  let dateRangeText = "";

  if (filter === "Weekly") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    dateRangeText = `${startDate.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}`;
  } else if (filter === "Monthly") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    dateRangeText = startDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  } else if (filter === "Yearly") {
    startDate = new Date(now.getFullYear(), 0, 1);
    endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    dateRangeText = startDate.getFullYear().toString();
  }

  const filteredExpenses = initialExpenses?.filter((exp: any) => {
    const d = new Date(exp.createdAt).getTime();
    return d >= startDate.getTime() && d <= endDate.getTime();
  }) || [];

  const filteredIncomes = initialIncomes?.filter((inc: any) => {
    const d = new Date(inc.createdAt).getTime();
    return d >= startDate.getTime() && d <= endDate.getTime();
  }) || [];

  const flatFixedExpenses: any[] = [];
  if (fixedExpenses) {
    fixedExpenses.forEach((fe: any) => {
      fe.entries?.forEach((entry: any) => {
        const [year, month] = entry.month.split('-');
        const entryDate = new Date(parseInt(year), parseInt(month) - 1, 1).getTime();
        if (entryDate >= startDate.getTime() && entryDate <= endDate.getTime()) {
           const fixedCat = categories?.find((c: any) => c.name.toLowerCase() === 'fixed');
           if (fixedCat) {
             flatFixedExpenses.push({
               categoryId: fixedCat.id,
               monthlyCost: entry.amount,
               date: new Date(entryDate)
             });
           }
        }
      });
    });
  }

  const flatVariableExpenses: any[] = [];
  if (variableExpenses) {
    variableExpenses.forEach((ve: any) => {
      ve.entries?.forEach((entry: any) => {
        const [year, month] = entry.month.split('-');
        const entryDate = new Date(parseInt(year), parseInt(month) - 1, 1).getTime();
        if (entryDate >= startDate.getTime() && entryDate <= endDate.getTime()) {
           const variableCat = categories?.find((c: any) => c.name.toLowerCase() === 'variable');
           if (variableCat) {
             flatVariableExpenses.push({
               categoryId: variableCat.id,
               monthlyCost: entry.amount,
               date: new Date(entryDate)
             });
           }
        }
      });
    });
  }

  const flatCreditCardExpenses: any[] = [];
  if (creditCards) {
    const ccCat = categories?.find((c: any) => c.name.toLowerCase() === 'credit cards');
    creditCards.forEach((card: any) => {
      card.transactions?.forEach((tx: any) => {
        if (tx.isEmi) {
          let paidMonths: number[] = [];
          try { paidMonths = JSON.parse(tx.paidMonths); } catch(e) {}
          const txDate = new Date(tx.date);
          
          paidMonths.forEach((mIndex: number) => {
             const emiDate = new Date(txDate.getFullYear(), txDate.getMonth() + mIndex, 1);
             if (emiDate.getTime() >= startDate.getTime() && emiDate.getTime() <= endDate.getTime() && ccCat) {
               flatCreditCardExpenses.push({
                 categoryId: ccCat.id,
                 monthlyCost: tx.monthlyEmi,
                 date: emiDate
               });
             }
          });
        } else {
          const tDate = new Date(tx.date);
          if (tDate.getTime() >= startDate.getTime() && tDate.getTime() <= endDate.getTime() && ccCat) {
             flatCreditCardExpenses.push({
               categoryId: ccCat.id,
               monthlyCost: tx.amount,
               date: tDate
             });
          }
        }
      });
    });
  }

  const allFilteredExpenses = [...filteredExpenses, ...flatFixedExpenses, ...flatVariableExpenses, ...flatCreditCardExpenses];

  // Chart Data Grouping
  const getChartData = () => {
    const sourceData = activeTab === "Spent" ? allFilteredExpenses : filteredIncomes;
    const valueKey = activeTab === "Spent" ? 'monthlyCost' : 'amount';
    
    // First, standardize dates
    const normalizedData = sourceData.map((item: any) => ({
      value: item[valueKey],
      date: new Date(item.createdAt || item.date)
    }));

    const dataPoints: { label: string, value: number }[] = [];

    if (filter === "Weekly") {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        dataPoints.push({ label: days[d.getDay()], value: 0 });
      }
      normalizedData.forEach((item: any) => {
        const itemDay = days[item.date.getDay()];
        const point = dataPoints.find(p => p.label === itemDay);
        if (point) point.value += item.value;
      });
    } else if (filter === "Monthly") {
      // Group by weeks
      dataPoints.push({ label: 'Week 1', value: 0 }, { label: 'Week 2', value: 0 }, { label: 'Week 3', value: 0 }, { label: 'Week 4', value: 0 });
      normalizedData.forEach((item: any) => {
        const date = item.date.getDate();
        if (date <= 7) dataPoints[0].value += item.value;
        else if (date <= 14) dataPoints[1].value += item.value;
        else if (date <= 21) dataPoints[2].value += item.value;
        else dataPoints[3].value += item.value;
      });
    } else if (filter === "Yearly") {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      months.forEach(m => dataPoints.push({ label: m, value: 0 }));
      normalizedData.forEach((item: any) => {
        const m = months[item.date.getMonth()];
        const point = dataPoints.find(p => p.label === m);
        if (point) point.value += item.value;
      });
    }

    return dataPoints;
  };

  const chartData = getChartData();
  const maxChartValue = Math.max(...chartData.map(d => d.value), 1);

  // Group expenses by category
  const categoryTotals: Record<string, number> = {};
  allFilteredExpenses.forEach((exp: any) => {
    categoryTotals[exp.categoryId] = (categoryTotals[exp.categoryId] || 0) + exp.monthlyCost;
  });

  // Group incomes by title for visualization
  const incomeTotals: Record<string, number> = {};
  filteredIncomes.forEach((inc: any) => {
    incomeTotals[inc.title] = (incomeTotals[inc.title] || 0) + inc.amount;
  });

  // Sort categories by highest spend
  const sortedExpenseCategories = categories
    ?.map((cat: any) => ({
      ...cat,
      total: categoryTotals[cat.id] || 0
    }))
    .filter((cat: any) => cat.total > 0)
    .sort((a: any, b: any) => b.total - a.total) || [];

  const sortedIncomeSources = Object.keys(incomeTotals)
    .map((title) => ({
      id: title,
      name: title,
      total: incomeTotals[title]
    }))
    .sort((a: any, b: any) => b.total - a.total);

  const currentList = activeTab === "Spent" ? sortedExpenseCategories : sortedIncomeSources;

  const totalFilteredSpent = allFilteredExpenses.reduce((sum: number, exp: any) => sum + exp.monthlyCost, 0);
  const totalFilteredIncome = filteredIncomes.reduce((sum: number, inc: any) => sum + inc.amount, 0);
  const displayBalance = totalFilteredIncome - totalFilteredSpent;

  // Mock icons/colors for categories
  const getCategoryTheme = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('bill') || n.includes('fixed')) return { icon: <Receipt size={20} />, bg: 'rgba(0, 0, 0, 0.05)', color: '#000000' };
    if (n.includes('shop') || n.includes('variable')) return { icon: <ShoppingBag size={20} />, bg: 'rgba(0, 0, 0, 0.05)', color: '#000000' };
    if (n.includes('loan') || n.includes('emi') || n.includes('credit')) return { icon: <CreditCard size={20} />, bg: 'rgba(0, 0, 0, 0.05)', color: '#000000' };
    if (n.includes('invest')) return { icon: <TrendingUp size={20} />, bg: 'rgba(0, 0, 0, 0.05)', color: '#000000' };
    return { icon: <Sparkles size={20} />, bg: 'rgba(0, 0, 0, 0.05)', color: '#000000' };
  };

  return (
    <div style={{ paddingBottom: '120px' }}>
      {/* Header */}
      <div className="top-bar-centered animate-in" style={{ padding: '24px 24px 16px 24px' }}>
        <div style={{ width: '40px', textAlign: 'left' }}></div>
        <div className="page-title">Statistics</div>
        <div style={{ width: '40px', textAlign: 'right', cursor: 'pointer', opacity: 0.8, color: 'var(--text-primary)' }}>
          <MoreHorizontal size={24} />
        </div>
      </div>

      {/* Balance & Filter */}
      <div className="flex justify-between align-center animate-in delay-1" style={{ padding: '0 24px', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px', letterSpacing: '-0.5px' }}>
            {currencySymbol}{displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Net Balance</div>
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
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{dateRangeText}</div>
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
          
          {/* Combination Line Path */}
          <path 
            d={chartData.map((point, index) => {
              const xSpacing = 100 / (chartData.length + 1);
              const xPos = xSpacing * (index + 1);
              const barHeight = (point.value / maxChartValue) * 40;
              const yPos = 50 - barHeight;
              return `${index === 0 ? 'M' : 'L'} ${xPos} ${yPos}`;
            }).join(' ')}
            fill="none" 
            stroke="var(--text-primary)" 
            strokeWidth="0.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.3"
          />

          {chartData.map((point, index) => {
            const xSpacing = 100 / (chartData.length + 1);
            const xPos = xSpacing * (index + 1);
            const barHeight = (point.value / maxChartValue) * 40; // Max height 40
            const yPos = 50 - barHeight;

            return (
              <g key={index}>
                <line x1={xPos} y1="10" x2={xPos} y2="50" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
                
                {barHeight > 0 && (
                  <rect 
                    x={xPos - (filter === 'Yearly' ? 2 : 3)} 
                    y={yPos} 
                    width={filter === 'Yearly' ? 4 : 6} 
                    height={barHeight} 
                    fill="var(--static-highlight)" 
                    rx="1"
                  />
                )}

                {/* Point on the line */}
                {barHeight > 0 && (
                  <circle cx={xPos} cy={yPos} r="1" fill="var(--text-primary)" opacity="0.6" />
                )}
                
                <text x={xPos} y="55" fill="var(--text-muted)" fontSize={filter === 'Yearly' ? "3" : "3.5"} textAnchor="middle">{point.label}</text>

                {point.value > 0 && (
                  <text x={xPos} y={yPos - 3} fill="var(--text-primary)" fontSize={filter === 'Yearly' ? "2" : "2.5"} textAnchor="middle" fontWeight="600">
                    {point.value > 1000 ? (point.value/1000).toFixed(1)+'k' : point.value}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Category Cards */}
      <div style={{ padding: '0 24px' }}>
        <h2 className="serif" style={{ fontSize: '1.6rem', marginBottom: '20px' }}>{activeTab === "Spent" ? "Total Spent" : "Total Income"}</h2>
        
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', margin: '0 -24px', paddingLeft: '24px', paddingRight: '24px' }}>
          {currentList.map((item: any) => {
            const theme = getCategoryTheme(item.name);
            const cardContent = (
              <div 
                style={{ 
                  background: theme.bg, 
                  minWidth: '120px', 
                  padding: '20px 16px', 
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: `1px solid ${theme.color}40`,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  cursor: activeTab === 'Spent' ? 'pointer' : 'default',
                  height: '100%'
                }}
              >
                <div style={{ marginBottom: '12px', color: theme.color, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.5)' }}>
                  {theme.icon}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px', textAlign: 'center', textTransform: 'capitalize' }}>
                  {item.name}
                </div>
                <div style={{ color: theme.color, fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {currencySymbol}{item.total.toLocaleString()}
                </div>
              </div>
            );

            if (activeTab === "Spent") {
              return (
                <Link key={item.id} href={`/categories/${item.id}`} style={{ textDecoration: 'none' }}>
                  {cardContent}
                </Link>
              );
            }

            return (
              <div key={item.id}>
                {cardContent}
              </div>
            );
          })}
          
          {currentList.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No data found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
