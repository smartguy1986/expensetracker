import { getBankAccounts, getExpenses, getIncomes, getUserProfile } from "@/app/actions";
import Link from "next/link";
import { Bell, ArrowUpRight, ArrowDownRight, CreditCard, DollarSign } from "lucide-react";

export default async function Dashboard() {
  const [expenses, incomes, bankAccounts, profile] = await Promise.all([
    getExpenses(),
    getIncomes(),
    getBankAccounts(),
    getUserProfile()
  ]);

  // Sort and merge recent transactions
  const allTransactions = [
    ...expenses.map(e => ({ id: `exp-${e.id}`, title: e.title, amount: -e.monthlyCost, date: e.createdAt, type: 'expense' })),
    ...incomes.map(i => ({ id: `inc-${i.id}`, title: i.title, amount: i.amount, date: i.createdAt, type: 'income' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const totalSpent = expenses.reduce((acc, exp) => acc + exp.monthlyCost, 0);
  const totalBalance = bankAccounts.reduce((acc, account) => acc + account.balance, 0);


  const currencyCode = profile?.currency || "USD";
  const currencySymbol = currencyCode === "EUR" ? "€" : currencyCode === "GBP" ? "£" : currencyCode === "INR" ? "₹" : currencyCode === "JPY" ? "¥" : "$";

  return (
    <div>
      {/* Top Bar */}
      <div className="top-bar animate-in" style={{ padding: '32px 24px 16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: '2.2rem', fontWeight: '300', marginRight: '8px', color: 'var(--text-muted)' }}>Hello</div>
          <div className="top-bar-avatar" style={{ marginRight: '12px' }}>
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="serif" style={{ fontSize: '2.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>Sophie</div>
        </div>
        <div className="top-bar-icon" style={{ color: 'var(--text-primary)', cursor: 'pointer' }}>
          <Bell size={24} />
        </div>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="animate-in delay-1" style={{ padding: '0 24px', marginBottom: '40px' }}>
        <h2 className="serif" style={{ fontSize: '1.3rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Overview</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          
          {/* Main Balance Box */}
          <div className="card" style={{ flex: 1, margin: 0, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Main Balance</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '600' }}>{currencySymbol}{totalBalance.toLocaleString()}</div>
          </div>
          
          {/* Total Spent Box */}
          <div className="card" style={{ flex: 1, margin: 0, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Total Spent</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '600' }}>{currencySymbol}{totalSpent.toLocaleString()}</div>
          </div>

        </div>
      </div>

      {/* Recent Transactions */}
      <div className="animate-in delay-3" style={{ padding: '0 24px' }}>
        <div className="flex justify-between align-center mb-4">
          <h2 className="serif" style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>Recent Activity</h2>
          <div className="flex gap-3">
            <Link href="/categories" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Categories</Link>
            <Link href="/statistics" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>See stats</Link>
          </div>
        </div>

        <div className="tx-list">
          {allTransactions.length === 0 && <div className="text-muted text-center py-4">No recent activity.</div>}
          {allTransactions.map(tx => (
            <div key={tx.id} className="tx-item" style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <div className="flex align-center">
                <div className="tx-icon" style={{ borderColor: 'var(--glass-border)', color: tx.type === 'income' ? 'var(--success)' : 'var(--text-primary)' }}>
                  {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '500', marginBottom: '2px', color: 'var(--text-primary)' }}>{tx.title}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: tx.type === 'income' ? 'var(--success)' : 'var(--text-primary)', fontWeight: '500', fontSize: '1.1rem', marginBottom: '2px' }}>
                  {tx.type === 'income' ? '+' : ''}{currencySymbol}{Math.abs(tx.amount).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
