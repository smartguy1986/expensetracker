import ClientStatistics from "./ClientStatistics";
import { getExpenses, getIncomes, getCategories, getUserProfile, getBankAccounts } from "@/app/actions";

export default async function StatisticsPage() {
  const [expenses, incomes, categories, profile, bankAccounts] = await Promise.all([
    getExpenses(),
    getIncomes(),
    getCategories(),
    getUserProfile(),
    getBankAccounts()
  ]);
  
  const totalBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <ClientStatistics 
      initialExpenses={expenses} 
      initialIncomes={incomes}
      categories={categories} 
      profile={profile} 
      totalBalance={totalBalance} 
    />
  );
}
