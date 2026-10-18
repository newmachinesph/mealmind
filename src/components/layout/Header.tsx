"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container-app py-4">
        <div className="flex justify-between items-center">
          <Link href="/meal/today">
            <h1 className="text-2xl font-bold text-primary">MealMind</h1>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/meal/today"
              className={`font-medium ${
                pathname === "/meal/today"
                  ? "text-primary"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              Today's Meal
            </Link>
            <Link
              href="/feedback"
              className={`font-medium ${
                pathname === "/feedback"
                  ? "text-primary"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              Feedback
            </Link>
            <Link
              href="/profile"
              className={`font-medium ${
                pathname === "/profile"
                  ? "text-primary"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              Profile
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-600 hover:text-primary font-medium"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
