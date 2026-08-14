import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminRole } from "@/lib/roles";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // PROTEÇÃO DE ROTAS ADMINISTRATIVAS (/admin e sub-rotas)
  if (path.startsWith("/admin")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production"
    });

    const isAdmin = isAdminRole(token?.role);

    // Regra da Tela de Login
    if (path === "/admin/login") {
      if (token && isAdmin) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }

    // Bloqueio de Acesso Ilegal
    if (!token || !isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

// Escopo Estrito: Protege APENAS o painel de controle. Libera o restante do site e banco de dados.
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
