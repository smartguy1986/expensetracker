import { getBankAccounts, getCreditCards, getExpenses, getUserProfile } from "@/app/actions";
import Link from "next/link";
import { Bell, ShoppingBag, Car, Shirt, Ticket, Globe, ShoppingCart } from "lucide-react";

export default async function Dashboard() {
  const expenses = await getExpenses();
  const bankAccounts = await getBankAccounts();

  const totalBalance = bankAccounts.reduce((acc, account) => acc + account.balance, 0);

  // Mock transactions
  const transactions = expenses.slice(0, 4).map((exp, i) => ({
    id: exp.id,
    title: exp.title,
    time: "Today",
    amount: exp.monthlyCost,
    icon: i % 2 === 0 ? "🛍️" : "🚗"
  }));

  if (transactions.length < 3) {
    transactions.push({ id: "t1", title: "Nike Super Store", time: "Bank Account", amount: 475, icon: "👟" });
    transactions.push({ id: "t2", title: "Puma Store", time: "Bank Account", amount: 52, icon: "🐆" });
  }

  // Mock Analytics data
  const chartData = [
    { label: "Jan", height: "40%" },
    { label: "Feb", height: "60%" },
    { label: "Mar", height: "100%", active: true },
    { label: "Apr", height: "30%" },
    { label: "May", height: "50%" },
    { label: "Jun", height: "80%" },
  ];

  const profile = await getUserProfile();
  const currencyCode = profile?.currency || "USD";
  const currencySymbol = currencyCode === "EUR" ? "€" : currencyCode === "GBP" ? "£" : currencyCode === "INR" ? "₹" : currencyCode === "JPY" ? "¥" : "$";

  return (
    <div>
      {/* Top Bar */}
      <div className="top-bar animate-in" style={{ padding: '32px 24px 16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: '2.2rem', fontWeight: '300', marginRight: '8px', color: 'rgba(255,255,255,0.7)' }}>Hello</div>
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
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="card" style={{ flex: 1, margin: 0, padding: '20px' }}>
            <div className="flex justify-between align-center mb-4">
              <div style={{ width: '32px', height: '20px', position: 'relative' }}>
                <div style={{ position: 'absolute', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)' }}></div>
                <div style={{ position: 'absolute', right: '0', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }}></div>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px' }}>**** 5300</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Mastercard</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '500' }}>{currencySymbol}1600.32</div>
          </div>
          
          <div className="card" style={{ flex: 1, margin: 0, padding: '20px' }}>
            <div className="flex justify-between align-center mb-4">
              <div style={{ fontSize: '1.2rem', fontWeight: '800', fontStyle: 'italic' }}>VISA</div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px' }}>**** 240</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Visa</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '500' }}>{currencySymbol}32.92</div>
          </div>
        </div>
      </div>

      {/* Analytics (Sleek line chart mockup) */}
      <div className="animate-in delay-2" style={{ padding: '0 24px', marginBottom: '40px' }}>
        <div className="card" style={{ margin: 0, padding: '24px', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Total spent in April</div>
            <div className="flex align-center">
              <div style={{ fontSize: '1.5rem', fontWeight: '500', marginRight: '8px' }}>{currencySymbol}841.90</div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>↓ 13%</div>
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

      {/* Transactions / Expense Dynamics */}
      <div className="animate-in delay-3" style={{ padding: '0 24px' }}>
        <div className="flex justify-between align-center mb-4">
          <h2 className="serif" style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>Expense dynamics</h2>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>See details</span>
        </div>

        <div className="tx-list">
          {[
            { id: 1, title: 'Clothes', amount: `${currencySymbol}45.00`, pct: '4%', icon: <Shirt size={20} /> },
            { id: 2, title: 'Entertainment', amount: `${currencySymbol}280.00`, pct: '24%', icon: <Ticket size={20} /> },
            { id: 3, title: 'Internet', amount: `${currencySymbol}60.00`, pct: '9%', icon: <Globe size={20} /> },
            { id: 4, title: 'Grocery', amount: `${currencySymbol}250.00`, pct: '24%', icon: <ShoppingCart size={20} /> },
          ].map(tx => (
            <div key={tx.id} className="tx-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex align-center">
                <div className="tx-icon" style={{ borderColor: 'var(--text-muted)' }}>{tx.icon}</div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '500', marginBottom: '2px', color: 'var(--text-primary)' }}>{tx.title}</h3>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '1.1rem', marginBottom: '2px' }}>{tx.amount}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{tx.pct}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
