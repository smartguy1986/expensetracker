import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.category.updateMany({
    where: { name: 'Investments Fixed' },
    data: { name: 'Investments' }
  });
  
  await prisma.category.deleteMany({
    where: { name: 'Investments Retirement' }
  });
  
  await prisma.category.deleteMany({
    where: { name: 'EMIs' }
  });
  console.log("Updated!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
