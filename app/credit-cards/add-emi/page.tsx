import ClientAddEmi from "./ClientAddEmi";
import { getCreditCards } from "@/app/actions";

export default async function AddEmiPage() {
  const cards = await getCreditCards();
  return <ClientAddEmi cards={cards} />;
}
