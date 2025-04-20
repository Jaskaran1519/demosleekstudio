/**
 * @deprecated This file is deprecated. Use lib/auth-options.ts instead.
 * The configuration in this file has been moved to lib/auth-options.ts
 * to support both credential and Google authentication with multi-domain support.
 */

import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

const prisma = new PrismaClient();

// Parse the allowed redirect URLs
const redirectUrls = process.env.NEXTAUTH_REDIRECT_URLS
  ? process.env.NEXTAUTH_REDIRECT_URLS.split(",")
  : [];

// Parse additional authorized domains
const authorizedDomains = process.env.AUTHORIZED_DOMAINS
  ? process.env.AUTHORIZED_DOMAINS.split(",").map(domain => domain.trim())
  : [];

// Combine the app URL and additional domains for OAuth provider config
const allAuthorizedDomains = [
  process.env.NEXTAUTH_URL,
  ...authorizedDomains
].filter(Boolean) as string[];

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user.hashedPassword) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return user;
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, account }) {
      // Always allow credential provider sign in
      if (account?.provider === 'credentials') {
        return true;
      }

      // For Google provider, store the user if they don't exist
      if (account?.provider === 'google' && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          });

          if (!existingUser) {
            console.log("Creating new user from Google auth:", user.email);
            // Create the user in the database
            await prisma.user.create({
              data: {
                name: user.name,
                email: user.email,
                image: user.image,
                // Default role is USER
                role: "USER",
                // Let MongoDB generate a proper ObjectId
              }
            });
          } else {
            console.log("Found existing user for Google auth:", user.email);
          }
          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Store role in token
        token.role = user.role;
        
        // For Google auth, don't use the id directly - we'll lookup by email
        if (user.email) {
          // If no id or if id is too long (Google ID), we'll prioritize lookup by email
          if (!user.id || (typeof user.id === 'string' && user.id.length > 24)) {
            // Don't store the potentially invalid id
            token.googleId = user.id; // Keep Google ID separately if needed
            // We'll look up the user by email in session callback
          } else {
            // For normal MongoDB IDs, store normally
            token.id = user.id;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Set the user role from token
        session.user.role = (token.role as "ADMIN" | "USER") || "USER";
        
        // If we have an id in the token, use it
        if (token.id) {
          session.user.id = token.id as string;
        } 
        // We'll use email for Google-authenticated users
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allow redirects to the base URL paths
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      
      // Check if the redirect URL is one of our allowed domains
      const allowedDomains = [baseUrl, ...redirectUrls, ...authorizedDomains];
      
      // Check if the URL starts with any of the allowed domains
      for (const domain of allowedDomains) {
        if (domain && url.startsWith(domain)) {
          return url;
        }
      }
      
      // Default fallback to base URL
      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV !== "production",
};

export default authConfig; 