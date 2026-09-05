import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getExpenses, getBankAccounts, getCreditCards } from "./actions";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  const expenses = await getExpenses();
  const bankAccounts = await getBankAccounts();
  const creditCards = await getCreditCards();

  const totalBankBalance = bankAccounts.reduce((acc, curr) => acc + curr.balance, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.monthlyCost, 0);
  
  const totalCreditLimit = creditCards.reduce((acc, curr) => acc + curr.totalLimit, 0);
  const totalCreditAvailable = creditCards.reduce((acc, curr) => acc + curr.availableBalance, 0);
  const totalCreditUsed = totalCreditLimit - totalCreditAvailable;
  
  const creditUtilization = totalCreditLimit > 0 
    ? ((totalCreditUsed / totalCreditLimit) * 100).toFixed(1) 
    : 0;

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      
      <div className="grid-3 mb-4">
        <div className="card">
          <h3 className="text-muted mb-1">Total Bank Balance</h3>
          <h2>${totalBankBalance.toLocaleString()}</h2>
        </div>
        
        <div className="card">
          <h3 className="text-muted mb-1">Total Monthly Expenses</h3>
          <h2>${totalExpenses.toLocaleString()}</h2>
        </div>

        <div className="card">
          <h3 className="text-muted mb-1">Remaining (Balance - Expenses)</h3>
          <h2 className={totalBankBalance - totalExpenses < 0 ? 'text-danger' : 'text-success'}>
            ${(totalBankBalance - totalExpenses).toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 className="mb-2">Credit Utilization</h2>
          <div className="mb-2">
            <div className="flex justify-between mb-1">
              <span>Limit: ${totalCreditLimit.toLocaleString()}</span>
              <span>Used: ${totalCreditUsed.toLocaleString()}</span>
            </div>
            <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--border-color)', borderRadius: '5px' }}>
              <div style={{ width: `${creditUtilization}%`, height: '100%', backgroundColor: 'var(--accent-color)', borderRadius: '5px' }}></div>
            </div>
          </div>
          <p className="text-muted">{creditUtilization}% utilization</p>
        </div>
        
        <div className="card">
          <h2 className="mb-2">Recent Expenses</h2>
          {expenses.length === 0 ? (
            <p className="text-muted">No expenses added yet.</p>
          ) : (
            <ul>
              {expenses.slice(0, 5).map(exp => (
                <li key={exp.id} className="flex justify-between mb-2 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <span>{exp.title} <small className="text-muted">({exp.category.name})</small></span>
                  <span className="font-bold">${exp.monthlyCost.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
