import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

// Parse additional authorized domains
const authorizedDomains = process.env.AUTHORIZED_DOMAINS
  ? process.env.AUTHORIZED_DOMAINS.split(",").map(domain => domain.trim())
  : [];

// Combine the app URL and additional domains
const allAuthorizedDomains = [
  process.env.NEXTAUTH_URL,
  ...authorizedDomains
].filter(Boolean) as string[];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Add 'profile' to the allowedScopes
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
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

        const user = await db.user.findUnique({
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
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log("Sign-in attempt:", account?.provider, user.email);
      
      // Always allow credential provider sign in
      if (account?.provider === 'credentials') {
        return true;
      }
      
      // For Google auth, make sure they're in the DB
      if (account?.provider === 'google' && user.email) {
        try {
          // Check if user exists with this email
          const existingUser = await db.user.findUnique({
            where: { email: user.email }
          });
          
          if (!existingUser) {
            // Create new user with default role
            const newUser = await db.user.create({
              data: {
                name: user.name,
                email: user.email,
                image: user.image,
                role: "USER",
              }
            });
            // console.log("Created new user with ID:", newUser.id);
          } else {
            // console.log("Found existing user:", existingUser.email, existingUser.id);
            
            // Link Google account to existing account
            // This prevents "OAuthAccountNotLinked" error
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });
          }
          // Always allow sign in
          return true;
        } catch (error) {
          console.error("Error handling Google sign-in:", error);
          // Don't fail the sign-in if we have errors adding to DB
          // The JWT callback will handle this case
          return true;
        }
      }
      
      return true;
    },
    async session({ session, token }) {
      // console.log("Session callback, token:", token);
      
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as "USER" | "ADMIN";
      } else if (session.user) {
        // Default to USER role if not found
        session.user.role = "USER";
      }

      return session;
    },
    async jwt({ token }) {
      // console.log("JWT callback for token with sub:", token.sub);
      
      // Skip ID lookup if sub is missing or not a valid MongoDB ObjectID
      const isValidObjectId = token.sub && 
        typeof token.sub === 'string' && 
        (token.sub.length === 24 || token.sub.length === 12);
        
      if (!isValidObjectId) {
        console.log("Invalid ObjectID format in token.sub, trying email lookup");
        // Try to look up by email instead
        if (token.email) {
          try {
            const userByEmail = await db.user.findUnique({
              where: { email: token.email as string }
            });
            
            if (userByEmail) {
              console.log("Found user by email:", userByEmail.email);
              token.role = userByEmail.role;
              token.sub = userByEmail.id; // Use the correct MongoDB ID
            } else {
              console.log("No user found by email:", token.email);
              token.role = "USER"; // Default role
            }
          } catch (error) {
            console.error("Error looking up by email:", error);
            token.role = "USER"; // Default role
          }
        }
        return token;
      }

      // Only proceed with ID lookup if it's a valid MongoDB ObjectID
      try {
        const existingUser = await db.user.findUnique({
          where: { id: token.sub },
        });

        if (existingUser) {
          // console.log("Found user for token, role:", existingUser.role);
          token.role = existingUser.role;
        } else {
          console.log("No user found for token sub:", token.sub);
          
          // Try to find by email if ID lookup fails
          if (token.email) {
            const userByEmail = await db.user.findUnique({
              where: { email: token.email as string }
            });
            
            if (userByEmail) {
              console.log("Found user by email, role:", userByEmail.role);
              token.role = userByEmail.role;
              // Use the correct ID
              token.sub = userByEmail.id;
            } else {
              token.role = "USER"; // Default role
            }
          }
        }
      } catch (error) {
        console.error("Error in JWT callback:", error);
        // Set default role as fallback
        token.role = "USER";
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allow redirects to the base URL paths
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      
      // Check if the redirect URL is one of our allowed domains
      const allowedDomains = [baseUrl, ...authorizedDomains];
      
      // Check if the URL starts with any of the allowed domains
      for (const domain of allowedDomains) {
        if (domain && url.startsWith(domain)) {
          return url;
        }
      }
      
      // Default fallback to base URL
      return baseUrl;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
}; 