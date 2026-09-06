import { getExpenses, getBankAccounts, getCreditCards } from "@/app/actions";
import Link from "next/link";

export default async function Dashboard() {
  const expenses = await getExpenses();
  const bankAccounts = await getBankAccounts();
  const creditCards = await getCreditCards();

  const totalBalance = bankAccounts.reduce((acc, account) => acc + account.balance, 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.monthlyCost, 0);
  const totalIncome = totalBalance + totalExpenses; // Just mocking some income logic

  // Mock transactions based on expenses
  const transactions = expenses.slice(0, 4).map((exp, i) => ({
    id: exp.id,
    title: exp.title,
    time: "Today",
    amount: -exp.monthlyCost,
    icon: i % 2 === 0 ? "🛍️" : "🚗"
  }));

  // Add some fake positive income if we don't have enough
  if (transactions.length < 3) {
    transactions.push({ id: "t1", title: "Paypal", time: "10:20 AM", amount: 1200, icon: "🅿️" });
  }

  return (
    <div>
      {/* Massive Gradient Header */}
      <div className="hero-header">
        <div className="hero-header-content">
          {/* Top Bar */}
          <div className="flex justify-between align-center mb-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }} className="flex align-center justify-center">👤</div>
              <div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Good Morning,</div>
                <div className="font-semibold" style={{ fontSize: '1.1rem' }}>Priscilla</div>
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', padding: '8px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }}>🔔</div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <div style={{ opacity: 0.85, fontSize: '0.9rem', marginBottom: '4px' }}>Current Balance</div>
            <h1 style={{ fontSize: '2.6rem', marginBottom: '12px', fontWeight: '700', letterSpacing: '-0.5px' }}>
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h1>
            <div style={{ fontSize: '0.8rem', opacity: 0.9, backgroundColor: 'rgba(255,255,255,0.15)', display: 'inline-block', padding: '6px 14px', borderRadius: '24px' }}>
              + $784 than last week
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping Content Container */}
      <div className="overlap-container">
        {/* Income / Expense Cards */}
        <div className="flex justify-between" style={{ gap: '16px', marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: 'var(--primary-purple)', backgroundColor: '#f3e8ff' }}>💰</div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Income ⓘ</div>
              <div className="font-bold" style={{ fontSize: '1.1rem' }}>${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: 'var(--danger)', backgroundColor: '#fef2f2' }}>💳</div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Expenses ⓘ</div>
              <div className="font-bold" style={{ fontSize: '1.1rem' }}>${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="card" style={{ padding: '24px 20px' }}>
          <div className="flex justify-between align-center mb-4">
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Transactions</h2>
            <Link href="/expenses" style={{ color: 'var(--primary-purple)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: '600', backgroundColor: '#f3e8ff', padding: '6px 12px', borderRadius: '12px' }}>See All</Link>
          </div>

          <div>
            {transactions.map(tx => (
              <div key={tx.id} className="tx-item" style={{ boxShadow: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: '0', marginBottom: '0' }}>
                <div className="flex align-center">
                  <div className={`tx-icon ${tx.amount < 0 ? 'expense' : ''}`}>{tx.icon}</div>
                  <div>
                    <div className="font-semibold" style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{tx.title}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{tx.time} • Card **4321</div>
                  </div>
                </div>
                <div className="font-bold" style={{ color: tx.amount > 0 ? 'var(--success)' : 'var(--danger)', fontSize: '1.1rem' }}>
                  {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
