"use server";

import { prisma } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/encryption";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getUserId() {
  const session = await getServerSession(authOptions);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id;
  if (!userId) throw new Error("No user found");
  return userId;
}
// --- Bank Accounts ---

export async function getBankAccounts() {
  const userId = await getUserId();
  const accounts = await prisma.bankAccount.findMany({ where: { userId } });
  return accounts.map((acc) => ({
    ...acc,
    details: decrypt(acc.encryptedDetails),
  }));
}

export async function addBankAccount(data: { nickname: string; details: string; balance: number }) {
  const userId = await getUserId();
  await prisma.bankAccount.create({
    data: {
      userId,
      nickname: data.nickname,
      encryptedDetails: encrypt(data.details),
      balance: data.balance,
    },
  });
  revalidatePath("/bank-accounts");
}

export async function updateBankAccount(id: string, data: { nickname: string; details: string; balance: number }) {
  const userId = await getUserId();
  await prisma.bankAccount.update({
    where: { id, userId },
    data: {
      nickname: data.nickname,
      encryptedDetails: encrypt(data.details),
      balance: data.balance,
    },
  });
  revalidatePath("/bank-accounts");
}

export async function deleteBankAccount(id: string) {
  const userId = await getUserId();
  await prisma.bankAccount.delete({ where: { id, userId } });
  revalidatePath("/bank-accounts");
}

// --- Categories ---

export async function getCategories() {
  return await prisma.category.findMany();
}

export async function getCategoryById(id: string) {
  return await prisma.category.findUnique({ where: { id } });
}

export async function getExpensesByCategory(categoryId: string) {
  const userId = await getUserId();
  return await prisma.expense.findMany({
    where: { userId, categoryId },
    orderBy: { createdAt: 'desc' }
  });
}

// --- Expenses ---

export async function getExpenses() {
  const userId = await getUserId();
  return await prisma.expense.findMany({
    where: { userId },
    include: { category: true },
  });
}

export async function addExpense(data: { title: string; categoryId: string; monthlyCost: number }) {
  const userId = await getUserId();
  await prisma.expense.create({
    data: {
      userId,
      title: data.title,
      categoryId: data.categoryId,
      monthlyCost: data.monthlyCost,
    },
  });
  revalidatePath("/expenses");
  revalidatePath("/");
}

export async function updateExpense(id: string, data: { title: string; categoryId: string; monthlyCost: number }) {
  const userId = await getUserId();
  await prisma.expense.update({
    where: { id, userId },
    data: {
      title: data.title,
      categoryId: data.categoryId,
      monthlyCost: data.monthlyCost,
    },
  });
  revalidatePath("/expenses");
  revalidatePath("/");
}

export async function deleteExpense(id: string) {
  const userId = await getUserId();
  await prisma.expense.delete({ where: { id, userId } });
  revalidatePath("/expenses");
  revalidatePath("/");
}

// --- Incomes ---

export async function getIncomes() {
  const userId = await getUserId();
  return await prisma.income.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function addIncome(data: { title: string; amount: number }) {
  const userId = await getUserId();
  await prisma.income.create({
    data: {
      userId,
      title: data.title,
      amount: data.amount,
    },
  });
  revalidatePath("/");
  revalidatePath("/statistics");
}

export async function updateIncome(id: string, data: { title: string; amount: number }) {
  const userId = await getUserId();
  await prisma.income.update({
    where: { id, userId },
    data: {
      title: data.title,
      amount: data.amount,
    },
  });
  revalidatePath("/");
  revalidatePath("/statistics");
}

export async function deleteIncome(id: string) {
  const userId = await getUserId();
  await prisma.income.delete({ where: { id, userId } });
  revalidatePath("/");
  revalidatePath("/statistics");
}

// --- Fixed Expenses ---

export async function getFixedExpenses() {
  const userId = await getUserId();
  const fixedExpenses = await prisma.fixedExpense.findMany({
    where: { userId },
    include: {
      entries: {
        orderBy: { month: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return fixedExpenses;
}

export async function addFixedExpense(name: string) {
  const userId = await getUserId();
  await prisma.fixedExpense.create({
    data: {
      userId,
      name,
    },
  });
  revalidatePath("/categories");
}

export async function deleteFixedExpense(id: string) {
  const userId = await getUserId();
  await prisma.fixedExpense.delete({
    where: { id, userId },
  });
  revalidatePath("/categories");
}

export async function addFixedExpenseEntry(fixedExpenseId: string, month: string, amount: number) {
  const userId = await getUserId();
  // Ensure the fixed expense belongs to the user
  const fixedExpense = await prisma.fixedExpense.findUnique({
    where: { id: fixedExpenseId, userId },
  });
  if (!fixedExpense) throw new Error("Fixed expense not found or unauthorized");

  await prisma.fixedExpenseEntry.create({
    data: {
      fixedExpenseId,
      month,
      amount,
    },
  });
  revalidatePath("/categories");
}

export async function deleteFixedExpenseEntry(id: string) {
  await prisma.fixedExpenseEntry.delete({
    where: { id },
  });
  revalidatePath("/categories");
}

export async function getUserProfile() {
  const userId = await getUserId();
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, image: true, themePreference: true, accentColor: true, currency: true },
  });
}

export async function updateUserProfile(data: { themePreference: string; accentColor: string; currency: string }) {
  const userId = await getUserId();
  await prisma.user.update({
    where: { id: userId },
    data: {
      themePreference: data.themePreference,
      accentColor: data.accentColor,
      currency: data.currency,
    },
  });
  revalidatePath("/");
}

// --- Variable Expenses (Month by Month) ---

export async function getVariableExpenses() {
  const userId = await getUserId();
  const expenses = await prisma.variableExpense.findMany({
    where: { userId },
    include: {
      entries: {
        orderBy: { month: 'desc' }
      }
    },
    orderBy: { createdAt: 'asc' }
  });
  return expenses;
}

export async function addVariableExpense(name: string) {
  const userId = await getUserId();
  const ve = await prisma.variableExpense.create({
    data: {
      userId,
      name
    }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  return ve;
}

export async function deleteVariableExpense(id: string) {
  const userId = await getUserId();
  await prisma.variableExpense.delete({ where: { id, userId } });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  return true;
}

export async function addVariableExpenseEntry(variableExpenseId: string, month: string, amount: number) {
  const userId = await getUserId();
  
  const ve = await prisma.variableExpense.findUnique({ where: { id: variableExpenseId, userId } });
  if (!ve) return null;

  const existing = await prisma.variableExpenseEntry.findFirst({
    where: { variableExpenseId, month }
  });

  if (existing) {
    const updated = await prisma.variableExpenseEntry.update({
      where: { id: existing.id },
      data: { amount: existing.amount + amount }
    });
    revalidatePath('/dashboard');
    revalidatePath('/categories');
    return updated;
  }

  const entry = await prisma.variableExpenseEntry.create({
    data: {
      variableExpenseId,
      month,
      amount
    }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  return entry;
}

export async function deleteVariableExpenseEntry(id: string) {
  await getUserId(); // ensure auth
  await prisma.variableExpenseEntry.delete({ where: { id } });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  return true;
}

export async function addSimpleVariableExpense(name: string, month: string, amount: number) {
  const userId = await getUserId();
  
  let ve = await prisma.variableExpense.findFirst({ where: { userId, name } });
  if (!ve) {
    ve = await prisma.variableExpense.create({ data: { userId, name } });
  }

  const existing = await prisma.variableExpenseEntry.findFirst({
    where: { variableExpenseId: ve.id, month }
  });

  if (existing) {
    await prisma.variableExpenseEntry.update({
      where: { id: existing.id },
      data: { amount: existing.amount + amount }
    });
  } else {
    await prisma.variableExpenseEntry.create({
      data: {
        variableExpenseId: ve.id,
        month,
        amount
      }
    });
  }

  revalidatePath('/dashboard');
  revalidatePath('/categories');
  return true;
}

// --- Loans ---

export async function getLoans() {
  const userId = await getUserId();
  return prisma.loan.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function addLoan(
  title: string, 
  provider: string, 
  totalAmount: number, 
  interestRate: number, 
  startDate: string, 
  totalTenureMonths: number
) {
  const userId = await getUserId();
  const loan = await prisma.loan.create({
    data: {
      userId,
      title,
      provider,
      totalAmount,
      interestRate,
      startDate: new Date(startDate),
      totalTenureMonths
    }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  return loan;
}

export async function deleteLoan(id: string) {
  const userId = await getUserId();
  await prisma.loan.delete({ where: { id, userId } });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  return true;
}

// --- Credit Cards ---

export async function getCreditCards() {
  const userId = await getUserId();
  return prisma.creditCardAccount.findMany({
    where: { userId },
    include: { transactions: { orderBy: { createdAt: 'desc' } } },
    orderBy: { createdAt: 'desc' }
  });
}

export async function addCreditCard(bankName: string, last4: string, expiry: string) {
  const userId = await getUserId();
  const card = await prisma.creditCardAccount.create({
    data: { userId, bankName, last4, expiry }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  return card;
}

export async function deleteCreditCard(id: string) {
  const userId = await getUserId();
  await prisma.creditCardAccount.delete({ where: { id, userId } });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  return true;
}

export async function addCreditCardTransaction(
  accountId: string,
  isEmi: boolean,
  title: string,
  amount: number,
  date: string,
  interestRate?: number,
  tenure?: number,
  monthlyEmi?: number
) {
  const userId = await getUserId();
  // Ensure the account belongs to the user
  const account = await prisma.creditCardAccount.findUnique({ where: { id: accountId, userId } });
  if (!account) throw new Error("Account not found");

  const tx = await prisma.creditCardTransaction.create({
    data: {
      accountId,
      isEmi,
      title,
      amount,
      date: new Date(date),
      interestRate,
      tenure,
      monthlyEmi
    }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  return tx;
}

export async function deleteCreditCardTransaction(id: string) {
  await prisma.creditCardTransaction.delete({ where: { id } });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  return true;
}

export async function toggleEmiMonthPaid(transactionId: string, monthIndex: number) {
  const tx = await prisma.creditCardTransaction.findUnique({ where: { id: transactionId } });
  if (!tx) throw new Error("Transaction not found");

  let paidMonths: number[] = [];
  try {
    paidMonths = JSON.parse(tx.paidMonths);
  } catch (e) {}

  if (paidMonths.includes(monthIndex)) {
    paidMonths = paidMonths.filter((m: number) => m !== monthIndex);
  } else {
    paidMonths.push(monthIndex);
  }

  const updatedTx = await prisma.creditCardTransaction.update({
    where: { id: transactionId },
    data: { paidMonths: JSON.stringify(paidMonths) }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  return updatedTx;
}
  
// --- Update Actions for Global Edit ---

export async function updateExpenseFull(id: string, title: string, amount: number, date: string) {
  const userId = await getUserId();
  await prisma.expense.update({
    where: { id, userId },
    data: {
      title,
      monthlyCost: amount,
      createdAt: new Date(date)
    }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  revalidatePath('/add');
}

export async function updateIncomeFull(id: string, title: string, amount: number, date: string) {
  const userId = await getUserId();
  await prisma.income.update({
    where: { id, userId },
    data: {
      title: title,
      amount: amount,
      createdAt: new Date(date)
    }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  revalidatePath('/add');
}

export async function updateFixedExpenseEntry(id: string, amount: number) {
  await getUserId();
  await prisma.fixedExpenseEntry.update({
    where: { id },
    data: { amount }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
}

export async function updateVariableExpenseEntry(id: string, amount: number) {
  await getUserId();
  await prisma.variableExpenseEntry.update({
    where: { id },
    data: { amount }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
}

export async function updateLoan(
  id: string, 
  title: string, 
  provider: string, 
  totalAmount: number, 
  interestRate: number, 
  startDate: string, 
  totalTenureMonths: number
) {
  const userId = await getUserId();
  await prisma.loan.update({
    where: { id, userId },
    data: {
      title,
      provider,
      totalAmount,
      interestRate,
      startDate: new Date(startDate),
      totalTenureMonths
    }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
}

export async function updateCreditCardTransaction(
  id: string,
  title: string,
  amount: number,
  date: string,
  interestRate?: number,
  tenure?: number,
  monthlyEmi?: number
) {
  await prisma.creditCardTransaction.update({
    where: { id },
    data: {
      title,
      amount,
      date: new Date(date),
      interestRate,
      tenure,
      monthlyEmi
    }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
}

// --- Retirement Investments ---

export async function getRetirementInvestments() {
  const userId = await getUserId();
  return await prisma.retirementInvestment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function addRetirementInvestment(data: any) {
  const userId = await getUserId();
  const inv = await prisma.retirementInvestment.create({
    data: {
      userId,
      name: data.name,
      type: data.type,
      startDate: new Date(data.startDate),
      fundName: data.fundName,
      provider: data.provider,
      paymentTerms: data.paymentTerms,
      installmentAmount: data.installmentAmount,
      currentValue: data.currentValue || 0
    }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  revalidatePath('/statistics');
  return inv;
}

export async function updateRetirementInvestment(id: string, data: any) {
  const userId = await getUserId();
  const inv = await prisma.retirementInvestment.update({
    where: { id, userId },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined
    }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  revalidatePath('/statistics');
  return inv;
}

export async function deleteRetirementInvestment(id: string) {
  const userId = await getUserId();
  await prisma.retirementInvestment.delete({
    where: { id, userId }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  revalidatePath('/statistics');
  return true;
}

export async function updateRetirementPaidTerms(id: string, paidTerms: any) {
  const userId = await getUserId();
  const updated = await prisma.retirementInvestment.update({
    where: { id, userId },
    data: { paidTerms: JSON.stringify(paidTerms) }
  });
  
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  revalidatePath('/statistics');
  return updated;
}

export async function updateRetirementWithdrawn(id: string, totalWithdrawn: number) {
  const userId = await getUserId();
  const updated = await prisma.retirementInvestment.update({
    where: { id, userId },
    data: { totalWithdrawn }
  });
  revalidatePath('/dashboard');
  revalidatePath('/categories');
  revalidatePath('/statistics');
  return updated;
}
