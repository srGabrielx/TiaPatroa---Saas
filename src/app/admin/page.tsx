import { prisma } from "@/lib/prisma";
import { atualizarStatusPedido } from "@/app/actions/pedidos";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const pedidos = await prisma.pedido.findMany({
    include: { itens: true },
    orderBy: { createdAt: "desc" },
  });

  const hoje = new Date();
  const pedidosHoje = pedidos.filter(
    (p) => new Date(p.createdAt).toDateString() === hoje.toDateString()
  );
  const faturamentoHoje = pedidosHoje.reduce((acc, pedido) => acc + pedido.total, 0);
  const pedidosPendentes = pedidos.filter(
    (p) => p.status === "RECEBIDO" || p.status === "PREPARANDO" || p.status === "SAIU_PARA_ENTREGA"
  );

  // Função auxiliar para definir a cor da badge de status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RECEBIDO': return 'bg-orange-100 text-orange-800';
      case 'PREPARANDO': return 'bg-blue-100 text-blue-800';
      case 'SAIU_PARA_ENTREGA': return 'bg-yellow-100 text-yellow-800';
      case 'FINALIZADO': return 'bg-green-100 text-green-800';
      case 'CANCELADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visão Geral</h1>
          <p className="text-gray-500 mt-1">Acompanhe os resultados da Cantina Tia Patroa.</p>
        </div>
        <a
          href="/api/pedidos/exportar"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
        >
          <span>⬇️</span> Exportar Planilha (CSV)
        </a>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-full text-2xl">💰</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Faturamento Hoje</p>
            <p className="text-2xl font-bold text-gray-900">R$ {faturamentoHoje.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full text-2xl">🛒</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pedidos Hoje</p>
            <p className="text-2xl font-bold text-gray-900">{pedidosHoje.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-full text-2xl">⏳</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pedidos Pendentes</p>
            <p className="text-2xl font-bold text-gray-900">{pedidosPendentes.length}</p>
          </div>
        </div>
      </div>

      {/* Tabela de Pedidos Ativos */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">Gestão de Pedidos (Tempo Real)</h2>
        </div>

        {pedidos.length === 0 ? (
          <div className="p-6 text-gray-500 text-center">Nenhum pedido registrado ainda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                  <th className="p-4 font-medium">ID / Data</th>
                  <th className="p-4 font-medium">Itens</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Status Atual</th>
                  <th className="p-4 font-medium text-right">Ação Rápida (Aprovar)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-gray-900 block">#{pedido.id.slice(-4).toUpperCase()}</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(pedido.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{pedido.itens.length} item(ns)</td>
                    <td className="p-4 font-semibold text-gray-900">R$ {pedido.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getStatusBadge(pedido.status)}`}>
                        {pedido.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {/* Lógica de Botões baseada no Status do Pedido usando Server Actions */}
                      {pedido.status === "RECEBIDO" && (
                        <form action={atualizarStatusPedido.bind(null, pedido.id, "PREPARANDO")}>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition shadow-sm">
                            Aprovar & Preparar
                          </button>
                        </form>
                      )}
                      {pedido.status === "PREPARANDO" && (
                        <form action={atualizarStatusPedido.bind(null, pedido.id, "SAIU_PARA_ENTREGA")}>
                          <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-xs font-semibold hover:bg-yellow-600 transition shadow-sm">
                            Despachar Entrega
                          </button>
                        </form>
                      )}
                      {pedido.status === "SAIU_PARA_ENTREGA" && (
                        <form action={atualizarStatusPedido.bind(null, pedido.id, "FINALIZADO")}>
                          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition shadow-sm">
                            Marcar como Entregue
                          </button>
                        </form>
                      )}
                      {pedido.status === "FINALIZADO" && (
                        <span className="text-gray-400 text-xs font-medium">Concluído ✅</span>
                      )}
                      {pedido.status === "CANCELADO" && (
                        <span className="text-red-400 text-xs font-medium">Cancelado ❌</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}