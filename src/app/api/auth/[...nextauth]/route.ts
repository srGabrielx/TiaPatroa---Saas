import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

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

export const authOptions: NextAuthOptions = {
  // Mantemos o PrismaAdapter aqui apenas para caso você use o Google Login para clientes depois
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        console.log("👀 Verificando login pelo .env...");

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Verifica se as variáveis de ambiente existem
        if (!adminEmail || !adminPassword) {
          console.log("❌ ERRO: Variáveis ADMIN_EMAIL ou ADMIN_PASSWORD não configuradas.");
          throw new Error("Erro de configuração no servidor.");
        }

        // Bate o que foi digitado com o que está no .env
        if (credentials?.email === adminEmail && credentials?.password === adminPassword) {
          console.log("✅ TUDO CERTO! Admin validado via Variável de Ambiente.");

          // Retorna um usuário "fantasma" perfeito para o NextAuth
          return {
            id: "admin-master-id",
            name: "Administrador",
            email: adminEmail,
            role: "admin",
          };
        }

        console.log("❌ ERRO: E-mail ou senha não batem com o .env");
        throw new Error("Credenciais inválidas.");
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };