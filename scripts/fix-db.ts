import { PrismaClient } from "@prisma/client";
import { encrypt } from "../lib/encryption";

const prisma = new PrismaClient();

async function main() {
  const accounts = await prisma.bankAccount.findMany();
  for (const account of accounts) {
    if (account.encryptedDetails === "e2830f3...mock_encrypted_details" || !account.encryptedDetails.includes(":")) {
      await prisma.bankAccount.update({
        where: { id: account.id },
        data: {
          encryptedDetails: encrypt("Mock Account Details - 1234")
        }
      });
      console.log(`Fixed account: ${account.id}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
