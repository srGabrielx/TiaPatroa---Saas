"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Se for a página de login, não exibe a sidebar
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar (Menu Lateral) */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">Tia Patroa</h2>
                    <p className="text-xs text-gray-400 mt-1">Painel Administrativo</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/admin" ? "bg-red-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                    >
                        <span className="text-lg">📊</span>
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/produtos"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/admin/produtos" ? "bg-red-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                    >
                        <span className="text-lg">🍽️</span>
                        Cardápio
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:bg-gray-800 hover:text-red-400 rounded-lg transition-colors"
                    >
                        <span className="text-lg">🔓</span>
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Área Principal de Conteúdo */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}