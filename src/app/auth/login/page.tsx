import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-primary mb-2">MealMind</h1>
          </Link>
          <p className="text-gray-600">Welcome back</p>
        </div>

        <Card>
          <LoginForm />

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
