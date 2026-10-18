import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/meal/today");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="container-app py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">MealMind</h1>
          <Link
            href="/auth/login"
            className="text-gray-700 hover:text-primary font-medium"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container-app py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Stop Deciding.
            <br />
            <span className="text-primary">Start Eating.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            One AI-powered meal recommendation per day. Zero decision fatigue.
            Perfectly tailored to your taste, goals, and lifestyle.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block btn btn-primary text-lg px-8 py-4"
          >
            Get Your First Meal
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="card text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Zero Decisions</h3>
            <p className="text-gray-600">
              One meal. Take it or leave it. No browsing, no choosing, no
              stress.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">AI Personalization</h3>
            <p className="text-gray-600">
              Learns your preferences, dietary needs, and cooking skills to
              serve perfect meals.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Lightning Fast</h3>
            <p className="text-gray-600">
              Open the app, see your meal, start cooking. That's it.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How It Works
          </h3>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 text-gray-900">
                  Complete Your Profile
                </h4>
                <p className="text-gray-600">
                  Tell us about your dietary needs, cooking skills, and taste
                  preferences.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 text-gray-900">Get Your Daily Meal</h4>
                <p className="text-gray-600">
                  Every day, receive one perfectly curated meal recommendation
                  with recipe and instructions.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 text-gray-900">
                  Give Feedback, Get Better
                </h4>
                <p className="text-gray-600">
                  Rate your meals and the AI learns what you love, improving
                  every day.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">
            Ready to eliminate food decisions?
          </h3>
          <Link
            href="/auth/signup"
            className="inline-block btn btn-primary text-lg px-8 py-4"
          >
            Start Free Today
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container-app py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2026 MealMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
