import { getExpenses, getCategories } from "@/app/actions";
import ClientExpenseList from "./ClientExpenseList";

export default async function ExpensesPage() {
  const expenses = await getExpenses();
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-4">Expenses</h1>
      <ClientExpenseList initialExpenses={expenses} categories={categories} />
    </div>
  );
}
