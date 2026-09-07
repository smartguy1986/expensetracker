import ClientCardDetails from "./ClientCardDetails";
import { getCreditCards } from "@/app/actions";
import { redirect } from "next/navigation";

export default async function CardDetailsPage({ params }: { params: { id: string } }) {
  const cards = await getCreditCards();
  const card = cards.find(c => c.id === params.id);
  
  if (!card) {
    redirect("/credit-cards");
  }

  const index = cards.findIndex(c => c.id === params.id);

  return <ClientCardDetails card={card} index={index} />;
}
