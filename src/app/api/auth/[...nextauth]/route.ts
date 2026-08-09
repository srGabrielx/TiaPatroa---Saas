import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
const authOptions: NextAuthOptions = {
  // ATENÇÃO: NÃO inclua 'adapter' aqui quando estiver usando Credentials com .env.
  // O PrismaAdapter tenta buscar o ID do usuário no banco PostgreSQL e causa o erro 401 ao não encontrar.
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // Pega as variáveis de ambiente e limpa espaços extras
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD?.trim();

        const inputEmail = credentials?.email?.trim().toLowerCase();
        const inputPassword = credentials?.password?.trim();

        console.log("👀 Tentando login Admin via .env...");

        if (!adminEmail || !adminPassword) {
          console.error("❌ ERRO: ADMIN_EMAIL ou ADMIN_PASSWORD não configurados no servidor.");
          throw new Error("Erro de configuração do servidor.");
        }

        if (inputEmail === adminEmail && inputPassword === adminPassword) {
          console.log("✅ Autenticação realizada com sucesso!");
          return {
            id: "admin-master",
            name: "Administrador",
            email: adminEmail,
            role: "admin",
          };
        }

        console.log("❌ E-mail ou senha incorretos.");
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
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
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };