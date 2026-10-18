import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import ProfileClient from "@/components/profile/ProfileClient";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-app py-8">
        <div className="max-w-4xl mx-auto">
          <ProfileClient />
        </div>
      </main>
    </div>
  );
}
