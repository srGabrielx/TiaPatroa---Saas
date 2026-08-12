import { ReactNode } from "react";
import CarrinhoDrawer from "@/components/CarrinhoDrawer";
import { WelcomeToast } from "@/components/WelcomeToast";
import Link from "next/link";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import WelcomeDrawer from "@/components/WelcomeDrawer";

// Importando o ícone ShoppingCart atualizado
import { ShoppingBag } from "lucide-react";

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <Providers>
            <div className="min-h-screen bg-gray-50 flex flex-col">

                {/* 👇 O WelcomeDrawer fica aqui, fora do header, solto no layout global */}
                <WelcomeDrawer />

                {/* Cabeçalho Premium Responsivo */}
                <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-red-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md">
                                T
                            </div>
                            <span className="font-bold text-gray-900 text-lg hidden sm:block tracking-tight">
                                Cantina Tia Patroa
                            </span>
                        </Link>

                        {/* Navegação e Ações */}
                        <div className="flex items-center gap-1 sm:gap-4">
                            <Link href="/pedidos" className="p-2 sm:px-4 sm:py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full sm:rounded-lg transition flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                <span className="hidden sm:block text-sm font-semibold">Pedidos</span>
                            </Link>

                            <div className="w-px h-6 bg-gray-200 mx-1 sm:mx-2"></div>

                            <CarrinhoDrawer />
                        </div>
                    </div>
                </header>

                {/* Conteúdo Principal */}
                <main className="flex-1 w-full pb-20 sm:pb-8">
                    <WelcomeToast />
                    {children}
                </main>

                {/* Rodapé do site */}
                <Footer />
            </div>
        </Providers>
    );
}