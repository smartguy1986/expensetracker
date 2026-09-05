import { getBankAccounts } from "@/app/actions";
import ClientBankAccountList from "./ClientBankAccountList";

export default async function BankAccountsPage() {
  const bankAccounts = await getBankAccounts();

  return (
    <div>
      <h1 className="mb-4">Bank Accounts</h1>
      <ClientBankAccountList initialAccounts={bankAccounts} />
    </div>
  );
}
