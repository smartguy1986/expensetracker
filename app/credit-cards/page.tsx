import { getCreditCards, getEmis } from "@/app/actions";
import ClientCreditCardsList from "./ClientCreditCardsList";

export default async function CreditCardsPage() {
  const creditCards = await getCreditCards();
  const emis = await getEmis();

  return (
    <div>
      <ClientCreditCardsList initialCards={creditCards} initialEmis={emis} />
    </div>
  );
}
