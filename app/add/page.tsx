import ClientAddPage from "./ClientAddPage";
import { getExpenses, getUserProfile } from "@/app/actions";

export default async function AddPage() {
  const expenses = await getExpenses();
  const profile = await getUserProfile();
  
  // Sort to get latest expenses
  const recentExpenses = expenses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
  
  return <ClientAddPage recentExpenses={recentExpenses} />;
}
