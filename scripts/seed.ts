import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Get the first user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found! Please register a user first.");
    return;
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

  // 3. Delete existing expenses for a clean slate? 
  // User said "We can clean it later", meaning maybe don't delete everything, just add a month's worth.
  // Actually, generating 30 days of data is safe.

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
    // Pick a random template
    const template = sampleExpenses[Math.floor(Math.random() * sampleExpenses.length)];
    
    // Pick a random cost
    const [min, max] = template.costRange;
    const cost = Math.floor(Math.random() * (max - min + 1)) + min;

    // Pick a random date in the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    // Randomize time slightly
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

  console.log("Successfully generated 40 random expenses for the last month!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
