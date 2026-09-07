import ClientAddCreditCard from "./ClientAddCreditCard";
import { getUserProfile } from "@/app/actions";

export default async function AddCreditCardPage() {
  const profile = await getUserProfile();
  return <ClientAddCreditCard profile={profile} />;
}
