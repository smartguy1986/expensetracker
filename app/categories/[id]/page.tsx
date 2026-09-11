import { getCategoryById, getExpensesByCategory, getFixedExpenses, getVariableExpenses, getLoans, getCreditCards, getRetirementInvestments, getInvestments } from "@/app/actions";
import ClientCategoryDetail from "./ClientCategoryDetail";
import ClientFixedCategoryDetail from "./ClientFixedCategoryDetail";
import ClientVariableCategoryDetail from "./ClientVariableCategoryDetail";
import ClientLoanCategoryDetail from "./ClientLoanCategoryDetail";
import ClientCreditCardCategoryDetail from "./ClientCreditCardCategoryDetail";
import ClientRetirementCategoryDetail from "./ClientRetirementCategoryDetail";
import ClientInvestmentCategoryDetail from "./ClientInvestmentCategoryDetail";
import { notFound } from "next/navigation";

export default async function CategoryDetailPage({ params }: { params: { id: string } }) {
  const [category, expenses] = await Promise.all([
    getCategoryById(params.id),
    getExpensesByCategory(params.id)
  ]);

  if (!category) return notFound();

  if (category.name.toLowerCase() === "fixed") {
    const fixedExpenses = await getFixedExpenses();
    return <ClientFixedCategoryDetail fixedExpenses={fixedExpenses} />;
  }

  if (category.name.toLowerCase() === "variable") {
    const variableExpenses = await getVariableExpenses();
    return <ClientVariableCategoryDetail variableExpenses={variableExpenses} />;
  }

  if (category.name.toLowerCase() === "loans") {
    const loans = await getLoans();
    return <ClientLoanCategoryDetail loans={loans} />;
  }

  if (category.name.toLowerCase() === "credit cards") {
    const creditCards = await getCreditCards();
    return <ClientCreditCardCategoryDetail creditCards={creditCards} />;
  }

  if (category.name.toLowerCase() === "investments retirement") {
    const investments = await getRetirementInvestments();
    return <ClientRetirementCategoryDetail investments={investments} />;
  }

  if (category.name.toLowerCase() === "investments") {
    const investments = await getInvestments();
    return <ClientInvestmentCategoryDetail investments={investments} />;
  }

  return <ClientCategoryDetail category={category} initialExpenses={expenses} />;
}
