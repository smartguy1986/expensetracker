import { getCategories, getExpenses } from "@/app/actions";
import ClientCategoryHub from "./ClientCategoryHub";

export default async function CategoriesHubPage() {
  const [categories, expenses] = await Promise.all([
    getCategories(),
    getExpenses()
  ]);

  // Precompute totals so we can display how much has been spent per category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((exp: any) => {
    categoryTotals[exp.categoryId] = (categoryTotals[exp.categoryId] || 0) + exp.monthlyCost;
  });

  const enrichedCategories = categories.map((cat: any) => ({
    ...cat,
    totalSpent: categoryTotals[cat.id] || 0
  }));

  return <ClientCategoryHub categories={enrichedCategories} />;
}
