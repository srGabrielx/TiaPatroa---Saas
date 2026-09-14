import { timingSafeEqual } from "crypto";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { isAdminRole } from "@/lib/roles";

declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

const secureCompare = (first: string, second: string) => {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);

  return firstBuffer.length === secondBuffer.length && timingSafeEqual(firstBuffer, secondBuffer);
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "google-client-id-cantina",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-client-secret-cantina",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
          const adminPassword = process.env.ADMIN_PASSWORD?.trim();
          const inputEmail = credentials?.email?.trim().toLowerCase() || "";
          const inputPassword = credentials?.password || "";

          if (!adminEmail || !adminPassword || !inputEmail || !inputPassword) return null;

          if (!secureCompare(inputEmail, adminEmail) || !secureCompare(inputPassword, adminPassword)) {
            return null;
          }

          return {
            id: "admin-master",
            name: "Administrador",
            email: adminEmail,
            role: "admin",
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60,
    updateAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || "cantina-tia-patroa-secret-key-prod-2025",
  useSecureCookies: false,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || (user.email === process.env.ADMIN_EMAIL ? "admin" : "client");
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string) || "client";
      }
      return session;
    },
  },
};

