import { getCategoryById, getExpensesByCategory } from "@/app/actions";
import ClientCategoryDetail from "./ClientCategoryDetail";
import { notFound } from "next/navigation";

export default async function CategoryDetailPage({ params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id);
  if (!category) return notFound();

  const expenses = await getExpensesByCategory(params.id);

  return <ClientCategoryDetail category={category} initialExpenses={expenses} />;
}
