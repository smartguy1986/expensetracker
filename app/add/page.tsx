import ClientAddPage from "./ClientAddPage";
import { getExpenses, getIncomes } from "@/app/actions";

export default async function AddPage() {
  const expenses = await getExpenses();
  const incomes = await getIncomes();
  
  const recentTransactions = [
    ...expenses.map(e => ({ id: `exp-${e.id}`, title: e.title, amount: -e.monthlyCost, date: e.createdAt, type: 'expense' })),
    ...incomes.map(i => ({ id: `inc-${i.id}`, title: i.title, amount: i.amount, date: i.createdAt, type: 'income' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  
  return <ClientAddPage recentTransactions={recentTransactions} />;
}
