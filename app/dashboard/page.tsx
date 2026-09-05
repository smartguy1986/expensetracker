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
      {/* Top Bar */}
      <div className="flex justify-between align-center mb-4">
        <div style={{ fontSize: '1.5rem', opacity: 0.7 }}>⊞</div>
        <div className="font-semibold" style={{ fontSize: '1.1rem' }}>Home</div>
        <div style={{ fontSize: '1.5rem', opacity: 0.7 }}>🔔</div>
      </div>

      {/* Gradient Card */}
      <div className="gradient-card">
        <div style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '8px' }}>Total Balance ⌄</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '24px', fontWeight: '700' }}>
          ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h1>
        <div className="flex justify-between">
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '4px' }}>↓ Income</div>
            <div className="font-semibold">${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '4px' }}>↑ Expenses</div>
            <div className="font-semibold">${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="flex justify-between align-center mb-3">
        <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Transactions</h2>
        <Link href="/expenses" style={{ color: 'var(--accent-color)', fontSize: '0.9rem', textDecoration: 'none' }}>See All</Link>
      </div>

      <div>
        {transactions.map(tx => (
          <div key={tx.id} className="tx-item">
            <div className="flex align-center">
              <div className="tx-icon">{tx.icon}</div>
              <div>
                <div className="font-semibold" style={{ fontSize: '1rem', marginBottom: '4px' }}>{tx.title}</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>{tx.time}</div>
              </div>
            </div>
            <div className="font-bold" style={{ color: tx.amount > 0 ? 'var(--success)' : 'var(--danger)', fontSize: '1.1rem' }}>
              {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
