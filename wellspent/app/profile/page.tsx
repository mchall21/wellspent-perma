import { getUserProfile, requireAuth } from "@/lib/auth";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
  await requireAuth();
  const profile = await getUserProfile();

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        <div className="bg-card rounded-lg border p-6">
          {profile ? (
            <ProfileForm profile={profile} />
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </div>
    </div>
  );
} 