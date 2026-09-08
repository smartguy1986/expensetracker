import { getIncomes } from "@/app/actions";
import ClientIncomeList from "./ClientIncomeList";

export default async function IncomesPage() {
  const incomes = await getIncomes();

  return (
    <div>
      <h1 className="page-title">Incomes</h1>
      <ClientIncomeList initialIncomes={incomes} />
    </div>
  );
}
