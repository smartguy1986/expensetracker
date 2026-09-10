import ClientStatistics from "./ClientStatistics";
import { getExpenses, getIncomes, getCategories, getUserProfile, getBankAccounts, getFixedExpenses, getVariableExpenses, getCreditCards } from "@/app/actions";

export default async function StatisticsPage() {
  const [expenses, incomes, categories, profile, bankAccounts, fixedExpenses, variableExpenses, creditCards] = await Promise.all([
    getExpenses(),
    getIncomes(),
    getCategories(),
    getUserProfile(),
    getBankAccounts(),
    getFixedExpenses(),
    getVariableExpenses(),
    getCreditCards()
  ]);
  
  const totalIncome = incomes.reduce((acc, inc) => acc + inc.amount, 0);
  const totalSpent = expenses.reduce((acc, exp) => acc + exp.monthlyCost, 0) + fixedExpenses.reduce((acc, fe) => {
    return acc + fe.entries.reduce((sum: number, entry: any) => sum + entry.amount, 0);
  }, 0) + variableExpenses.reduce((acc, ve) => {
    return acc + ve.entries.reduce((sum: number, entry: any) => sum + entry.amount, 0);
  }, 0) + creditCards.reduce((acc, card) => {
    return acc + card.transactions.reduce((sum: number, tx: any) => {
      if (tx.isEmi) {
        let paidMonths: number[] = [];
        try { paidMonths = JSON.parse(tx.paidMonths); } catch(e) {}
        return sum + (paidMonths.length * (tx.monthlyEmi || 0));
      } else {
        return sum + tx.amount;
      }
    }, 0);
  }, 0);
  const totalBalance = totalIncome - totalSpent;

  return (
    <ClientStatistics 
      initialExpenses={expenses} 
      initialIncomes={incomes}
      fixedExpenses={fixedExpenses}
      variableExpenses={variableExpenses}
      creditCards={creditCards}
      categories={categories} 
      profile={profile} 
      totalBalance={totalBalance} 
    />
  );
}
