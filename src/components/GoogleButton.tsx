"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { LogOut, User } from "lucide-react";

interface GoogleButtonProps {

  variant?: "header" | "hero" | "card";
  className?: string;
}

export default function GoogleButton({ variant = "header", className = "" }: GoogleButtonProps) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Erro ao iniciar login com Google:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="h-9 px-3 flex items-center gap-2 rounded-lg bg-gray-100 text-gray-400 text-xs font-medium animate-pulse">
        Carregando...
      </div>
    );
  }

  // Se o usuário estiver autenticado (via Google ou Credentials)
  if (session?.user) {
    const isGoogle = session.user.image || session.user.email?.includes("@");
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-full py-1 px-3 shadow-xs">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "Usuário"}
              className="w-6 h-6 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
              {session.user.name ? session.user.name.charAt(0).toUpperCase() : <User size={14} />}
            </div>
          )}
          <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate hidden md:inline">
            {session.user.name || session.user.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Sair da conta"
            className="text-slate-400 hover:text-red-600 transition p-1 hover:bg-red-50 rounded-full"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Estilo Hero / Banner
  if (variant === "hero") {
    return (
      <button
        id="btn-google-hero"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={`flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-white text-slate-700 font-bold text-sm shadow-md hover:bg-slate-50 active:scale-95 transition-all border border-slate-200 disabled:opacity-50 cursor-pointer ${className}`}
      >
        <GoogleIcon />
        <span>{loading ? "Conectando..." : "Entrar com Google"}</span>
      </button>
    );
  }

  // Estilo Card / Formulário de login
  if (variant === "card") {
    return (
      <button
        id="btn-google-card"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 active:scale-[0.99] transition shadow-xs disabled:opacity-50 cursor-pointer ${className}`}
      >
        <GoogleIcon />
        <span>{loading ? "Conectando ao Google..." : "Continuar com o Google"}</span>
      </button>
    );
  }

  // Estilo Header (Padrão)
  return (
    <button
      id="btn-google-header"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className={`flex items-center gap-2 py-1.5 px-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 transition text-xs font-bold text-slate-700 shadow-xs disabled:opacity-50 cursor-pointer ${className}`}
    >
      <GoogleIcon size={16} />
      <span className="hidden sm:inline">{loading ? "Entrando..." : "Entrar com Google"}</span>
      <span className="sm:hidden">{loading ? "..." : "Google"}</span>
    </button>
  );
}

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}
