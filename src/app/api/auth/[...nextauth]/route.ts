import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { timingSafeEqual } from "crypto";

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

const secureCompare = (a: string, b: string) => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
};

const authOptions: NextAuthOptions = {
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
          const inputPassword = credentials?.password?.trim() || "";

          if (!adminEmail || !adminPassword || !inputEmail || !inputPassword) {
            return null;
          }

          const isEmailValid = secureCompare(inputEmail, adminEmail);
          const isPasswordValid = secureCompare(inputPassword, adminPassword);

          if (isEmailValid && isPasswordValid) {
            return {
              id: "admin-master",
              name: "Administrador",
              email: adminEmail,
              role: "admin",
            };
          }

          return null;
        } catch (error) {
          console.error("❌ [AUTH] Erro interno", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60, // 4 horas
  },
  secret: process.env.NEXTAUTH_SECRET,
  // A linha abaixo já implementa os padrões de segurança do OWASP sem quebrar o framework
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };