import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    'Fixed',
    'Variable',
    'Loans',
    'Credit Cards',
    'EMIs',
    'Investments Fixed',
    'Investments Retirement',
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Categories seeded successfully.');

  // Create test user if it doesn't exist
  const username = 'admin';
  const existingUser = await prisma.user.findUnique({ where: { username } });
  
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        themePreference: 'dark',
        accentColor: '#3b82f6',
      },
    });
    console.log('Test user created: admin / password123');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
