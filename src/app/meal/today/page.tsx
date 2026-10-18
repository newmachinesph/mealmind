import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import TodayMealClient from "@/components/meal/TodayMealClient";

export default async function TodayMealPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-app py-8">
        <div className="max-w-4xl mx-auto">
          <TodayMealClient />
        </div>
      </main>
    </div>
  );
}
