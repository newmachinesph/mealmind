import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import ProfileEditClient from "@/components/profile/ProfileEditClient";

export default async function ProfileEditPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      <main className="container-app py-8">
        <div className="max-w-2xl mx-auto">
          <ProfileEditClient />
        </div>
      </main>
    </div>
  );
}
