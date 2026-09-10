import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.category.upsert({
    where: { name: 'Investments Retirement' },
    update: {},
    create: { name: 'Investments Retirement' }
  });
  console.log("Added Investments Retirement back!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
