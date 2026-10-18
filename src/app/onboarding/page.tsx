import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // If user has already completed onboarding, redirect to meal page
  if (session.user.onboardingComplete) {
    redirect("/meal/today");
  }

  return <OnboardingFlow />;
}
