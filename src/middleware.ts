import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Resgata o token de sessão do usuário (funciona para Google e Credentials)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 2. Proteção exclusiva para as rotas administrativas (/admin e sub-rotas)
  if (path.startsWith("/admin")) {
    const isAdmin = token?.role === "admin" || token?.role === "ADMIN";

    // Se a pessoa estiver tentando acessar a tela de LOGIN DO ADMIN
    if (path === "/admin/login") {
      // Se já estiver logada E for admin, joga pro dashboard direto
      if (token && isAdmin) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      // Se não, deixa ela ver a tela de email e senha tranquilamente
      return NextResponse.next();
    }

    // Para qualquer outra tela restrita (ex: /admin, /admin/pedidos)
    // Se não estiver logado ou se for um Cliente (Google), manda pro login DE ADMIN
    if (!token || !isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Se não for rota /admin, deixa seguir o fluxo normal do site (clientes)
  return NextResponse.next();
}

// O Matcher garante que o middleware só vai vigiar as rotas /admin
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};