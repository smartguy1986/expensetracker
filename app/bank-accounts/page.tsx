import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBankAccounts } from "@/app/actions";
import ClientBankAccountList from "./ClientBankAccountList";

export default async function BankAccountsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  const bankAccounts = await getBankAccounts();

  return (
    <div>
      <h1 className="mb-4">Bank Accounts</h1>
      <ClientBankAccountList initialAccounts={bankAccounts} />
    </div>
  );
}
