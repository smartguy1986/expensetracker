import ClientStatistics from "./ClientStatistics";
import { getExpenses, getIncomes, getCategories, getUserProfile, getBankAccounts } from "@/app/actions";

export default async function StatisticsPage() {
  const expenses = await getExpenses();
  const incomes = await getIncomes();
  const categories = await getCategories();
  const profile = await getUserProfile();
  const bankAccounts = await getBankAccounts();
  
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
