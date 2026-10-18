import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db/client";
import { verifyPassword } from "@/lib/auth/password";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const result = await db.execute({
            sql: "SELECT * FROM users WHERE email = ?",
            args: [credentials.email as string],
          });

          const user = result.rows[0];

          if (!user) {
            return null;
          }

          const isValidPassword = await verifyPassword(
            credentials.password as string,
            user.password_hash as string
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id as string,
            email: user.email as string,
            onboardingComplete: user.onboarding_complete === 1,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/onboarding",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.onboardingComplete = (user as any).onboardingComplete;
      }

      // Refresh onboarding status from database on each request
      // This ensures the JWT reflects the latest onboarding_complete value
      if (token.id && !user) {
        try {
          const result = await db.execute({
            sql: "SELECT onboarding_complete FROM users WHERE id = ?",
            args: [token.id as string],
          });

          if (result.rows.length > 0) {
            token.onboardingComplete = result.rows[0].onboarding_complete === 1;
          }
        } catch (error) {
          console.error("Error refreshing onboarding status:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).onboardingComplete = token.onboardingComplete;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuthPage = nextUrl.pathname.startsWith("/auth");
      const isOnOnboarding = nextUrl.pathname.startsWith("/onboarding");
      const isOnPublicPage = nextUrl.pathname === "/";

      if (isOnPublicPage) {
        return true;
      }

      if (isOnAuthPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/meal/today", nextUrl));
        }
        return true;
      }

      if (!isLoggedIn) {
        return false;
      }

      const onboardingComplete = (auth.user as any).onboardingComplete;

      if (!onboardingComplete && !isOnOnboarding) {
        return Response.redirect(new URL("/onboarding", nextUrl));
      }

      if (onboardingComplete && isOnOnboarding) {
        return Response.redirect(new URL("/meal/today", nextUrl));
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
