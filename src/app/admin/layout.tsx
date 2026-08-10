"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu, X, LayoutDashboard, ShoppingBag,
    UtensilsCrossed, LogOut, ChevronLeft, ChevronRight
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
    const pathname = usePathname();

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
        { name: "Pedidos", icon: ShoppingBag, href: "/admin/pedidos" },
        { name: "Cardápio", icon: UtensilsCrossed, href: "/admin/produtos" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden">

            {/* OVERLAY MOBILE (Fundo desfocado quando o menu abre no celular) */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* SIDEBAR (Desktop & Mobile) - Estilo HUD Dark Premium */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800/50 shadow-2xl transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
          ${isDesktopCollapsed ? "md:w-20" : "md:w-72"}
        `}
            >
                {/* Logo / Header da Sidebar */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/50 bg-slate-950">
                    {!isDesktopCollapsed && (
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent truncate">
                            Tia Patroa Admin
                        </span>
                    )}
                    {isDesktopCollapsed && (
                        <span className="text-xl font-bold text-indigo-400 mx-auto">TP</span>
                    )}

                    {/* Botão Fechar no Mobile */}
                    <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Links de Navegação */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)}>
                                <div className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.15)]"
                                        : "hover:bg-slate-800/50 hover:text-slate-100"
                                    }
                  ${isDesktopCollapsed ? "justify-center px-0" : ""}
                `}>
                                    <item.icon size={22} className={isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"} />
                                    {!isDesktopCollapsed && <span className="font-medium tracking-wide">{item.name}</span>}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Botão de Logout & Collapse */}
                <div className="p-4 border-t border-slate-800/50 space-y-2 bg-slate-900/20">
                    <button
                        onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all ${isDesktopCollapsed ? "justify-center px-0" : ""}`}
                    >
                        <LogOut size={22} />
                        {!isDesktopCollapsed && <span className="font-medium tracking-wide">Sair do Sistema</span>}
                    </button>

                    {/* Botão de Encolher Sidebar (Só Desktop) */}
                    <button
                        onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                        className="hidden md:flex items-center justify-center w-full py-2 mt-2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        {isDesktopCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
            </aside>

            {/* ÁREA DE CONTEÚDO PRINCIPAL */}
            <main className="flex-1 flex flex-col w-full max-w-full overflow-hidden h-screen">

                {/* HEADER MOBILE (Aparece só no celular) */}
                <header className="md:hidden h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center px-6 shrink-0 shadow-sm z-30 relative">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="p-2 -ml-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 font-bold text-slate-800 text-lg">Painel Admin</span>
                </header>

                {/* CONTEÚDO DA PÁGINA (Renderiza o page.tsx aqui dentro) */}
                <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
                    {children}
                </div>
            </main>

        </div>
    );
}