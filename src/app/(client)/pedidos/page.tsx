"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag, Clock, CircleCheck, Truck, PackageCheck, User } from "lucide-react";

export default function MeusPedidosPage() {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarPedidos = async () => {
            try {
                // 1. Lê os pedidos gravados no navegador do cliente
                const local = localStorage.getItem("meus_pedidos_tia_patroa");
                const listaLocal = local ? JSON.parse(local) : [];

                if (listaLocal.length === 0) {
                    setPedidos([]);
                    setLoading(false);
                    return;
                }

                // 2. Atualiza o status em tempo real via API para cada pedido do cliente
                const pedidosAtualizados = await Promise.all(
                    listaLocal.map(async (p: any) => {
                        try {
                            const res = await fetch(`/api/pedidos/${p.id}`);
                            if (res.ok) {
                                const dadosApi = await res.json();
                                return { ...p, ...dadosApi };
                            }
                        } catch {}
                        return p;
                    })
                );

                setPedidos(pedidosAtualizados);
            } catch (err) {
                console.error("Erro ao carregar histórico", err);
            } finally { // <-- O ERRO FOI CORRIGIDO AQUI!
                setLoading(false);
            }
        };

        carregarPedidos();
    }, []);

    const getStatusBadge = (status: string) => {
        const st = (status || "").toUpperCase().trim().replace(/\s+/g, "_");
        switch (st) {
            case "RECEBIDO":
            case "PENDENTE":
            case "AGUARDANDO":
                return <span className="bg-yellow-50 text-yellow-700 font-bold text-xs px-3 py-1 rounded-full border border-yellow-200 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Recebido</span>;
            case "PREPARANDO":
            case "EM_PREPARO":
                return <span className="bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1"><PackageCheck className="w-3.5 h-3.5" /> Preparando</span>;
            case "SAIU_PARA_ENTREGA":
                return <span className="bg-purple-50 text-purple-700 font-bold text-xs px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Saiu p/ Entrega</span>;
            case "ENTREGUE":
            case "CONCLUIDO":
            case "FINALIZADO":
                return <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1"><CircleCheck className="w-3.5 h-3.5" /> Entregue</span>;
            default:
                return <span className="bg-gray-100 text-gray-700 font-bold text-xs px-3 py-1 rounded-full">Recebido</span>;
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500 font-medium">
                Carregando seus pedidos...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Meus Pedidos</h1>
                <div className="text-sm font-semibold text-red-600 flex items-center gap-1">
                    <User className="w-4 h-4" /> Conta
                </div>
            </div>

            {pedidos.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4 shadow-sm">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
                    <h2 className="text-xl font-bold text-gray-900">Nenhum pedido recente</h2>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                        Seus pedidos realizados aparecerão aqui para você acompanhar a entrega em tempo real.
                    </p>
                    <Link href="/" className="inline-block bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200">
                        Ver Cardápio
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {pedidos.map((pedido) => (
                        <Link 
                            key={pedido.id} 
                            href={`/pedido/${pedido.id}`}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-red-200 hover:shadow-md transition flex items-center justify-between gap-4 group"
                        >
                            <div className="space-y-2 min-w-0 flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="font-bold text-gray-900 text-base">
                                        Pedido #{pedido.id.slice(-6)}
                                    </span>
                                    {getStatusBadge(pedido.status)}
                                </div>
                                <p className="text-xs text-gray-400">
                                    {new Date(pedido.createdAt || pedido.data).toLocaleDateString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>
                                <p className="text-sm font-bold text-red-600">
                                    R$ {Number(pedido.total).toFixed(2)}
                                </p>
                            </div>

                            <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-red-50 flex items-center justify-center transition shrink-0">
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}