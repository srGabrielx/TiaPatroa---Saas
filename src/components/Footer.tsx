import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800 mt-auto">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                {/* Coluna 1: Sobre / Marca */}
                <div className="space-y-4">
                    <Link href="/" className="flex w-fit items-center gap-2 rounded-lg transition hover:opacity-85" aria-label="Ir para a página inicial da Cantina Tia Patroa">
                        <Image src="/logo.png" alt="Logo Cantina Tia Patroa" width={40} height={40} className="rounded-xl object-contain" />
                        <span className="font-bold text-xl text-white tracking-tight">
                            Cantina <span className="text-red-500">Tia Patroa</span>
                        </span>
                    </Link>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        O verdadeiro sabor caseiro! Lanches, salgados e refeições preparadas com ingredientes selecionados e muito carinho.
                    </p>
                </div>

                {/* Coluna 2: Links Rápidos */}
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-500 pl-2">
                        Navegação
                    </h3>
                    <ul className="space-y-2 text-xs">
                        <li>
                            <Link href="/" className="hover:text-red-400 transition">
                                Cardápio Completo
                            </Link>
                        </li>
                        <li>
                            <Link href="/checkout" className="hover:text-red-400 transition">
                                Finalizar Pedido
                            </Link>
                        </li>
                        <li>
                            <Link href="/pedidos" className="hover:text-red-400 transition">
                                Meus Pedidos
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Coluna 3: Horário de Funcionamento */}
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-500 pl-2">
                        Funcionamento
                    </h3>
                    <ul className="space-y-2 text-xs text-gray-400">
                        <li className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-red-500 shrink-0" />
                            <span>Segunda a Sexta: 08:00 - 20:00</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-red-500 shrink-0" />
                            <span>Sábado: 08:00 - 15:00</span>
                        </li>
                        <li className="text-gray-500 text-[11px] pt-1">
                            Domingos e Feriados: Fechado
                        </li>
                    </ul>
                </div>

                {/* Coluna 4: Contato & Endereço */}
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-500 pl-2">
                        Contato
                    </h3>
                    <ul className="space-y-2.5 text-xs text-gray-400">
                        <li className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>Atendimento presencial & Delivery na cidade</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-red-500 shrink-0" />
                            <a href="https://wa.me/5511900000000" target="_blank" rel="noreferrer" className="hover:text-red-400 transition">
                                (11) 90000-0000
                            </a>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Linha Inferior / Direitos Autorais */}
            <div className="max-w-6xl mx-auto px-4 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                <p>© {new Date().getFullYear()} Cantina Tia Patroa. Todos os direitos reservados.</p>
                <p className="flex items-center gap-1">
                    Feito com <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> para os melhores clientes.
                </p>
            </div>
        </footer>
    );
}
