import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function check() {
  const user = await prisma.user.findUnique({ where: { username: 'admin' } });
  if (!user) {
    console.log('User admin not found');
    return;
  }
  console.log('User found:', user.username);
  const match = await bcrypt.compare('password123', user.password);
  console.log('Password match:', match);
}

check().catch(console.error).finally(() => prisma.$disconnect());
