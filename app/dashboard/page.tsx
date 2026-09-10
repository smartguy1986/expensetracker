import { getBankAccounts, getExpenses, getIncomes, getUserProfile, getFixedExpenses, getVariableExpenses, getCreditCards } from "@/app/actions";
import Link from "next/link";
import { Bell } from "lucide-react";
import ClientRecentActivity from "./ClientRecentActivity";

export default async function Dashboard() {
  const [expenses, incomes, bankAccounts, profile, fixedExpenses, variableExpenses, creditCards] = await Promise.all([
    getExpenses(),
    getIncomes(),
    getBankAccounts(),
    getUserProfile(),
    getFixedExpenses(),
    getVariableExpenses(),
    getCreditCards()
  ]);

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

  const currentMonthExpenses = expenses.filter(e => {
    const t = new Date(e.createdAt).getTime();
    return t >= startOfMonth && t <= endOfMonth;
  });

  const currentMonthIncomes = incomes.filter(i => {
    const t = new Date(i.createdAt).getTime();
    return t >= startOfMonth && t <= endOfMonth;
  });

  const currentMonthFixedExpensesSum = fixedExpenses.reduce((acc, fe) => {
    const entry = fe.entries.find((e: any) => e.month === currentMonthStr);
    return acc + (entry ? entry.amount : 0);
  }, 0);

  const currentMonthVariableExpensesSum = variableExpenses.reduce((acc, ve) => {
    const entry = ve.entries.find((e: any) => e.month === currentMonthStr);
    return acc + (entry ? entry.amount : 0);
  }, 0);

  // Compile current month transactions
  const currentMonthTransactions = [
    ...currentMonthExpenses.map(e => ({ id: `exp-${e.id}`, title: e.title, amount: e.monthlyCost, date: e.createdAt, type: 'expense' })),
    ...currentMonthIncomes.map(i => ({ id: `inc-${i.id}`, title: i.title, amount: i.amount, date: i.createdAt, type: 'income' }))
  ];

  fixedExpenses.forEach(fe => {
    const entry = fe.entries.find((e: any) => e.month === currentMonthStr);
    if (entry) {
      currentMonthTransactions.push({ id: `fe-${entry.id}`, title: fe.name, amount: entry.amount, date: entry.createdAt, type: 'expense' });
    }
  });

  variableExpenses.forEach(ve => {
    const entry = ve.entries.find((e: any) => e.month === currentMonthStr);
    if (entry) {
      currentMonthTransactions.push({ id: `ve-${entry.id}`, title: ve.name, amount: entry.amount, date: entry.createdAt, type: 'expense' });
    }
  });

  creditCards.forEach(card => {
    card.transactions.forEach((tx: any) => {
      if (tx.isEmi) {
        let paidMonths: number[] = [];
        try { paidMonths = JSON.parse(tx.paidMonths); } catch (e) {}
        
        const txDate = new Date(tx.date);
        const index = (now.getFullYear() - txDate.getFullYear()) * 12 + (now.getMonth() - txDate.getMonth());
        
        if (index >= 0 && index < (tx.tenure || 0)) {
          if (paidMonths.includes(index)) {
            currentMonthTransactions.push({
              id: `cc-emi-${tx.id}-${index}`,
              title: `${tx.title} (EMI)`,
              amount: tx.monthlyEmi || 0,
              date: new Date(now.getFullYear(), now.getMonth(), txDate.getDate()),
              type: 'expense'
            });
          }
        }
      } else {
        const t = new Date(tx.date).getTime();
        if (t >= startOfMonth && t <= endOfMonth) {
          currentMonthTransactions.push({
            id: `cc-exp-${tx.id}`,
            title: `${tx.title} (CC)`,
            amount: tx.amount,
            date: tx.date,
            type: 'expense'
          });
        }
      }
    });
  });

  currentMonthTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalSpent = currentMonthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalBalance = totalIncome - totalSpent;

  const currencyCode = profile?.currency || "USD";
  const currencySymbol = currencyCode === "EUR" ? "€" : currencyCode === "GBP" ? "£" : currencyCode === "INR" ? "₹" : currencyCode === "JPY" ? "¥" : "$";

  return (
    <div>
      {/* Top Bar */}
      <div className="top-bar animate-in" style={{ padding: '32px 24px 16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="top-bar-avatar" style={{ overflow: 'hidden' }}>
            {profile?.image ? (
              <img src={profile.image} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--primary-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {profile?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: '300', color: 'var(--text-muted)' }}>Hello,</div>
            <div className="serif" style={{ fontSize: '2.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              {profile?.username ? profile.username.split(' ')[0] : 'User'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="top-bar-icon" style={{ color: 'var(--text-primary)', cursor: 'pointer' }}>
            <Bell size={24} />
          </div>
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

      {/* Recent Activity */}
      <div className="animate-in delay-3" style={{ padding: '0 24px', paddingBottom: '120px' }}>
        <div className="flex justify-between align-center mb-4">
          <h2 className="serif" style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>Recent Activity</h2>
          <div className="flex gap-3">
            <Link href="/categories" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Categories</Link>
            <Link href="/statistics" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>See stats</Link>
          </div>
        </div>

        <ClientRecentActivity transactions={currentMonthTransactions} currencySymbol={currencySymbol} />
      </div>
    </div>
  );
}
