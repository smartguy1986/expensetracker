import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/app/actions";
import ClientProfile from "./ClientProfile";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  const profile = await getUserProfile();

  if (!profile) return <div>Profile not found</div>;

  return (
    <div>
      <h1 className="mb-4">User Profile</h1>
      <ClientProfile initialProfile={profile} />
    </div>
  );
}
