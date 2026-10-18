import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      onboardingComplete?: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    onboardingComplete?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    onboardingComplete?: boolean;
  }
}
