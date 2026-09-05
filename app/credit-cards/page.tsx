import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCreditCards, getEmis } from "@/app/actions";
import ClientCreditCardsList from "./ClientCreditCardsList";

export default async function CreditCardsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  const creditCards = await getCreditCards();
  const emis = await getEmis();

  return (
    <div>
      <h1 className="mb-4">Credit Cards & EMIs</h1>
      <ClientCreditCardsList initialCards={creditCards} initialEmis={emis} />
    </div>
  );
}
