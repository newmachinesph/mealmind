import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import FeedbackHistory from "@/components/feedback/FeedbackHistory";

export default async function FeedbackPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (!session.user.onboardingComplete) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container-app py-8">
        <div className="max-w-4xl mx-auto">
          <FeedbackHistory />
        </div>
      </main>
    </div>
  );
}
