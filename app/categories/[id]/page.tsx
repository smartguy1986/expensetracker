import { getCategoryById, getExpensesByCategory } from "@/app/actions";
import ClientCategoryDetail from "./ClientCategoryDetail";
import { notFound } from "next/navigation";

export default async function CategoryDetailPage({ params }: { params: { id: string } }) {
  const [category, expenses] = await Promise.all([
    getCategoryById(params.id),
    getExpensesByCategory(params.id)
  ]);

  if (!category) return notFound();

  return <ClientCategoryDetail category={category} initialExpenses={expenses} />;
}
