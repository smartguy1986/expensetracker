import { getBankAccounts, getExpenses, getIncomes, getUserProfile } from "@/app/actions";
import Link from "next/link";
import { Bell, ArrowUpRight, ArrowDownRight, CreditCard, DollarSign } from "lucide-react";

export default async function Dashboard() {
  const expenses = await getExpenses();
  const incomes = await getIncomes();
  const bankAccounts = await getBankAccounts();

  // Sort and merge recent transactions
  const allTransactions = [
    ...expenses.map(e => ({ id: `exp-${e.id}`, title: e.title, amount: -e.monthlyCost, date: e.createdAt, type: 'expense' })),
    ...incomes.map(i => ({ id: `inc-${i.id}`, title: i.title, amount: i.amount, date: i.createdAt, type: 'income' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const totalSpent = expenses.reduce((acc, exp) => acc + exp.monthlyCost, 0);

  const profile = await getUserProfile();
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

      {/* Wallet Section (Side by side cards) */}
      <div className="animate-in delay-1" style={{ padding: '0 24px', marginBottom: '32px' }}>
        <h2 className="serif" style={{ fontSize: '1.3rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Wallet</h2>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
          {bankAccounts.length === 0 ? (
             <div className="card" style={{ flex: 1, margin: 0, padding: '20px', color: 'var(--text-muted)' }}>No accounts found.</div>
          ) : (
            bankAccounts.map((account, index) => (
              <div key={account.id} className="card" style={{ flex: '0 0 calc(50% - 8px)', margin: 0, padding: '20px' }}>
                <div className="flex justify-between align-center mb-4">
                  <div style={{ fontWeight: '800', fontStyle: 'italic', letterSpacing: '-0.5px' }}>
                    {index === 0 ? "MAIN" : "ALT"}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{account.nickname}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '500' }}>{currencySymbol}{account.balance.toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Analytics (Sleek line chart mockup) */}
      <div className="animate-in delay-2" style={{ padding: '0 24px', marginBottom: '40px' }}>
        <div className="card" style={{ margin: 0, padding: '24px', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)', marginBottom: '4px' }}>Total spent this period</div>
            <div className="flex align-center">
              <div style={{ fontSize: '1.5rem', fontWeight: '500', marginRight: '8px' }}>{currencySymbol}{totalSpent.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ flex: 1, height: '40px', position: 'relative' }}>
            {/* SVG line chart mockup using accent color */}
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0 30 Q10 10, 20 25 T40 20 T60 30 T80 15 T100 5" fill="none" stroke="var(--static-highlight)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
