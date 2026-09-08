import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Ensure a User exists
  let user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found. Creating a default user...");
    user = await prisma.user.create({
      data: {
        username: "testuser",
        password: "hashedpassword123", // In a real app, this should be a bcrypt hash
        themePreference: "light",
        currency: "USD"
      }
    });
  }
  const userId = user.id;
  console.log(`Using user ID: ${userId}`);

  // 2. Ensure Categories Exist
  const categoryNames = [
    "Fixed",
    "Variable",
    "Loans",
    "Credit Cards",
    "EMIs",
    "Investments Fixed",
    "Investments Retirement",
  ];

  const categories = [];
  for (const name of categoryNames) {
    let cat = await prisma.category.findUnique({ where: { name } });
    if (!cat) {
      cat = await prisma.category.create({ data: { name } });
    }
    categories.push(cat);
  }
  console.log("Categories ensured.");

  const fixedCat = categories.find((c) => c.name === "Fixed")!;
  const variableCat = categories.find((c) => c.name === "Variable")!;

  // 3. Clear existing expenses/incomes for this user for a clean slate
  await prisma.expense.deleteMany({ where: { userId } });
  await prisma.income.deleteMany({ where: { userId } });
  await prisma.bankAccount.deleteMany({ where: { userId } });
  
  // Create a default Bank Account
  await prisma.bankAccount.create({
    data: {
      userId,
      nickname: "Main Checking",
      encryptedDetails: "e2830f3...mock_encrypted_details", // mock encrypted string
      balance: 4500.00
    }
  });

  // 4. Generate ~40 expenses over the last 30 days
  const now = new Date();
  
  const sampleExpenses = [
    { title: "Starbucks", categoryId: variableCat.id, costRange: [4, 12] },
    { title: "Groceries", categoryId: variableCat.id, costRange: [40, 150] },
    { title: "Uber", categoryId: variableCat.id, costRange: [15, 45] },
    { title: "Netflix", categoryId: fixedCat.id, costRange: [15, 15] },
    { title: "Rent", categoryId: fixedCat.id, costRange: [1200, 1200] },
    { title: "Electricity Bill", categoryId: fixedCat.id, costRange: [60, 100] },
    { title: "Internet", categoryId: fixedCat.id, costRange: [50, 70] },
    { title: "Gym Membership", categoryId: fixedCat.id, costRange: [30, 60] },
    { title: "Amazon Purchase", categoryId: variableCat.id, costRange: [20, 200] },
    { title: "Restaurant", categoryId: variableCat.id, costRange: [30, 120] },
  ];

  console.log("Generating expenses...");
  for (let i = 0; i < 40; i++) {
    const template = sampleExpenses[Math.floor(Math.random() * sampleExpenses.length)];
    const [min, max] = template.costRange;
    const cost = Math.floor(Math.random() * (max - min + 1)) + min;

    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));

    await prisma.expense.create({
      data: {
        userId,
        title: template.title,
        categoryId: template.categoryId,
        monthlyCost: cost,
        createdAt: date,
      },
    });
  }

  // 5. Generate some mock Incomes
  console.log("Generating incomes...");
  const sampleIncomes = [
    { title: "Salary", amountRange: [2500, 2500] },
    { title: "Freelance Client", amountRange: [300, 800] },
    { title: "PayPal Transfer", amountRange: [50, 200] },
  ];
  
  for (let i = 0; i < 5; i++) {
    const template = sampleIncomes[Math.floor(Math.random() * sampleIncomes.length)];
    const [min, max] = template.amountRange;
    const amount = Math.floor(Math.random() * (max - min + 1)) + min;

    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    await prisma.income.create({
      data: {
        userId,
        title: template.title,
        amount: amount,
        createdAt: date
      }
    });
  }

  console.log("Successfully generated seed data for the last month!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
