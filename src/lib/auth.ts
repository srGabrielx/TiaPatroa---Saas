import { timingSafeEqual } from "crypto";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === "production",
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role as string;
      return session;
    },
  },
};
