"use server";

import { prisma } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/encryption";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getUserId() {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No user found");
  return user.id;
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

// --- Credit Cards ---

export async function getCreditCards() {
  const userId = await getUserId();
  const cards = await prisma.creditCard.findMany({ where: { userId } });
  return cards.map((c) => ({
    ...c,
    details: decrypt(c.encryptedDetails),
  }));
}

export async function addCreditCard(data: { details: string; totalLimit: number; availableBalance: number }) {
  const userId = await getUserId();
  await prisma.creditCard.create({
    data: {
      userId,
      encryptedDetails: encrypt(data.details),
      totalLimit: data.totalLimit,
      availableBalance: data.availableBalance,
    },
  });
  revalidatePath("/credit-cards");
}

export async function updateCreditCard(id: string, data: { details: string; totalLimit: number; availableBalance: number }) {
  const userId = await getUserId();
  await prisma.creditCard.update({
    where: { id, userId },
    data: {
      encryptedDetails: encrypt(data.details),
      totalLimit: data.totalLimit,
      availableBalance: data.availableBalance,
    },
  });
  revalidatePath("/credit-cards");
}

export async function deleteCreditCard(id: string) {
  const userId = await getUserId();
  await prisma.creditCard.delete({ where: { id, userId } });
  revalidatePath("/credit-cards");
}

// --- EMIs ---

export async function getEmis() {
  const userId = await getUserId();
  return await prisma.eMI.findMany({
    where: { userId },
    include: { creditCard: true },
  });
}

export async function addEmi(data: { creditCardId: string; title: string; totalEmis: number; paidEmis: number; amount: number }) {
  const userId = await getUserId();
  await prisma.eMI.create({
    data: {
      userId,
      creditCardId: data.creditCardId,
      title: data.title,
      totalEmis: data.totalEmis,
      paidEmis: data.paidEmis,
      amount: data.amount,
    },
  });
  revalidatePath("/credit-cards");
}

export async function updateEmi(id: string, data: { title: string; totalEmis: number; paidEmis: number; amount: number }) {
  const userId = await getUserId();
  await prisma.eMI.update({
    where: { id, userId },
    data: {
      title: data.title,
      totalEmis: data.totalEmis,
      paidEmis: data.paidEmis,
      amount: data.amount,
    },
  });
  revalidatePath("/credit-cards");
}

export async function deleteEmi(id: string) {
  const userId = await getUserId();
  await prisma.eMI.delete({ where: { id, userId } });
  revalidatePath("/credit-cards");
}

// --- User Profile ---

export async function getUserProfile() {
  const userId = await getUserId();
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, themePreference: true, accentColor: true, currency: true },
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
