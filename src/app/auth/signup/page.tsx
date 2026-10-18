import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";
import Card from "@/components/ui/Card";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-primary mb-2">MealMind</h1>
          </Link>
          <p className="text-gray-600">Create your account</p>
        </div>

        <Card>
          <SignupForm />

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
