import { prisma } from "@/lib/prisma";
import { atualizarStatusPedido } from "@/app/actions/pedidos";

export const dynamic = 'force-dynamic';

export default async function AdminPedidosPage() {
    const pedidos = await prisma.pedido.findMany({
        include: { itens: true },
        orderBy: { createdAt: "desc" },
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'RECEBIDO': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'PREPARANDO': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'SAIU_PARA_ENTREGA': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'FINALIZADO': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'CANCELADO': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Central de Pedidos</h1>
                    <p className="text-gray-500 mt-1">Gerencie, aceite e altere o status dos pedidos em tempo real.</p>
                </div>
                <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                    Total de pedidos: <span className="font-bold text-gray-900">{pedidos.length}</span>
                </div>
            </div>

            {/* Lista de Pedidos em Cards Detalhados */}
            {pedidos.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center text-gray-500">
                    Nenhum pedido recebido até o momento.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {pedidos.map((pedido) => (
                        <div key={pedido.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">

                            {/* Topo do Card */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-100 gap-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl font-bold text-gray-900">
                                            Pedido #{pedido.id.slice(-6).toUpperCase()}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(pedido.status)}`}>
                                            {pedido.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Realizado em: {new Date(pedido.createdAt).toLocaleString('pt-BR')}
                                    </p>
                                </div>

                                {/* Botões de Ação Rápida */}
                                <div className="flex items-center gap-2">
                                    {pedido.status === "RECEBIDO" && (
                                        <form action={atualizarStatusPedido.bind(null, pedido.id, "PREPARANDO")}>
                                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition shadow-sm">
                                                ✅ Aceitar & Preparar
                                            </button>
                                        </form>
                                    )}

                                    {pedido.status === "PREPARANDO" && (
                                        <form action={atualizarStatusPedido.bind(null, pedido.id, "SAIU_PARA_ENTREGA")}>
                                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
                                                🛵 Enviar para Entrega
                                            </button>
                                        </form>
                                    )}

                                    {pedido.status === "SAIU_PARA_ENTREGA" && (
                                        <form action={atualizarStatusPedido.bind(null, pedido.id, "FINALIZADO")}>
                                            <button type="submit" className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 transition shadow-sm">
                                                🎉 Marcar como Concluído
                                            </button>
                                        </form>
                                    )}

                                    {pedido.status !== "FINALIZADO" && pedido.status !== "CANCELADO" && (
                                        <form action={atualizarStatusPedido.bind(null, pedido.id, "CANCELADO")}>
                                            <button type="submit" className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition">
                                                Cancelar
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Informações do Cliente & Entrega */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-gray-50/50 p-4 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold uppercase">Cliente</p>
                                    <p className="font-semibold text-gray-800">{pedido.clienteNome}</p>
                                    <p className="text-gray-500 text-xs">{pedido.clienteTelefone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold uppercase">Endereço de Entrega</p>
                                    <p className="text-gray-700">{pedido.endereco}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold uppercase">Pagamento</p>
                                    <p className="font-semibold text-gray-800">{pedido.formaPagamento}</p>
                                    {pedido.observacoes && (
                                        <p className="text-xs text-orange-600 mt-1">Obs: {pedido.observacoes}</p>
                                    )}
                                </div>
                            </div>

                            {/* Itens do Pedido */}
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Itens Solicitados</p>
                                <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                                    {pedido.itens.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center p-3 text-sm bg-white">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md text-xs">
                                                    {item.quantidade}x
                                                </span>
                                                <span className="text-gray-800 font-medium">{item.produtoNome}</span>
                                            </div>
                                            <span className="text-gray-600 font-semibold">
                                                R$ {(item.precoUnit * item.quantidade).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rodapé com Valor Total */}
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-sm font-medium text-gray-500">Valor Total do Pedido</span>
                                <span className="text-xl font-bold text-emerald-600">R$ {pedido.total.toFixed(2)}</span>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}