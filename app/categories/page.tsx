import { getCategories, getExpenses, getFixedExpenses, getVariableExpenses, getLoans, getCreditCards, getRetirementInvestments, getInvestments } from "@/app/actions";
import ClientCategoryHub from "./ClientCategoryHub";

export default async function CategoriesHubPage() {
  const [categories, expenses, fixedExpenses, variableExpenses, loans, creditCards, retirementInvestments, investments] = await Promise.all([
    getCategories(),
    getExpenses(),
    getFixedExpenses(),
    getVariableExpenses(),
    getLoans(),
    getCreditCards(),
    getRetirementInvestments(),
    getInvestments()
  ]);

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

  const currentMonthExpenses = expenses.filter(e => {
    const t = new Date(e.createdAt).getTime();
    return t >= startOfMonth && t <= endOfMonth;
  });

  // Precompute totals so we can display how much has been spent per category
  const categoryTotals: Record<string, number> = {};
  currentMonthExpenses.forEach((exp: any) => {
    categoryTotals[exp.categoryId] = (categoryTotals[exp.categoryId] || 0) + exp.monthlyCost;
  });

  const currentMonthFixedExpensesSum = fixedExpenses.reduce((acc, fe) => {
    const entry = fe.entries.find((e: any) => e.month === currentMonthStr);
    return acc + (entry ? entry.amount : 0);
  }, 0);

  const currentMonthVariableExpensesSum = variableExpenses.reduce((acc, ve) => {
    const entry = ve.entries.find((e: any) => e.month === currentMonthStr);
    return acc + (entry ? entry.amount : 0);
  }, 0);

  const enrichedCategories = categories.map((cat: any) => {
    let totalSpent = categoryTotals[cat.id] || 0;
    
    if (cat.name.toLowerCase() === "fixed") {
      totalSpent += currentMonthFixedExpensesSum;
    }
    
    if (cat.name.toLowerCase() === "variable") {
      totalSpent += currentMonthVariableExpensesSum;
    }
    
    if (cat.name.toLowerCase() === "loans") {
      totalSpent += loans.reduce((acc: number, loan: any) => acc + loan.totalAmount, 0);
    }
    
    if (cat.name.toLowerCase() === "credit cards") {
      let ccTotal = 0;
      creditCards.forEach((card: any) => {
        card.transactions.forEach((tx: any) => {
          if (tx.isEmi) {
            let paidMonths: number[] = [];
            try { paidMonths = JSON.parse(tx.paidMonths); } catch (e) {}
            const txDate = new Date(tx.date);
            const index = (now.getFullYear() - txDate.getFullYear()) * 12 + (now.getMonth() - txDate.getMonth());
            if (index >= 0 && index < (tx.tenure || 0) && paidMonths.includes(index)) {
              ccTotal += (tx.monthlyEmi || 0);
            }
          } else {
            const t = new Date(tx.date).getTime();
            if (t >= startOfMonth && t <= endOfMonth) {
              ccTotal += tx.amount;
            }
          }
        });
      });
      totalSpent += ccTotal;
    }

    if (cat.name.toLowerCase() === "investments retirement") {
      totalSpent += retirementInvestments.reduce((acc: number, inv: any) => acc + (inv.currentValue || 0), 0);
    }

    if (cat.name.toLowerCase() === "investments") {
      let invTotal = 0;
      investments.forEach((inv: any) => {
        inv.transactions.forEach((tx: any) => {
          const t = new Date(tx.date).getTime();
          if (t >= startOfMonth && t <= endOfMonth) {
            if (tx.type === "DEPOSIT") invTotal += tx.amount;
            else if (tx.type === "WITHDRAWAL") invTotal -= tx.amount;
          }
        });
      });
      totalSpent += invTotal;
    }

    return { ...cat, totalSpent };
  });

  const visibleCategories = enrichedCategories.filter((cat: any) => cat.name.toLowerCase() !== "emis");

  return <ClientCategoryHub categories={visibleCategories} />;
}
