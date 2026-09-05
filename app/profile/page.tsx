import { getUserProfile } from "@/app/actions";
import ClientProfile from "./ClientProfile";

export default async function ProfilePage() {
  const profile = await getUserProfile();

  if (!profile) return <div>Profile not found</div>;

  return (
    <div>
      <h1 className="mb-4">User Profile</h1>
      <ClientProfile initialProfile={profile} />
    </div>
  );
}
