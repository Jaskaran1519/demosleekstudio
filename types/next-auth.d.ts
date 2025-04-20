import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role (ADMIN or USER) */
      role: "ADMIN" | "USER";
      /** The user's database ID */
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "ADMIN" | "USER";
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's role */
    role?: "ADMIN" | "USER";
  }
} 