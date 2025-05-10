import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id: string;
      role: "user" | "admin" | "premium";
      isProfileComplete: boolean;
    };
  }

  interface User {
    id: string;
    role: "user" | "admin" | "premium";
    isProfileComplete: boolean;
  }

  interface JWT {
    id: string;
    role: "user" | "admin" | "premium";
    isProfileComplete: boolean;
  }
}
