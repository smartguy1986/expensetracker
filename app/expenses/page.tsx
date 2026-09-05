import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getExpenses, getCategories } from "@/app/actions";
import ClientExpenseList from "./ClientExpenseList";

export default async function ExpensesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  const expenses = await getExpenses();
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-4">Expenses</h1>
      <ClientExpenseList initialExpenses={expenses} categories={categories} />
    </div>
  );
}
