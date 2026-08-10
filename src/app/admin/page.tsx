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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RECEBIDO': return 'bg-orange-500/10 text-orange-600 border border-orange-200';
      case 'PREPARANDO': return 'bg-blue-500/10 text-blue-600 border border-blue-200';
      case 'SAIU_PARA_ENTREGA': return 'bg-yellow-500/10 text-yellow-600 border border-yellow-200';
      case 'FINALIZADO': return 'bg-emerald-500/10 text-emerald-600 border border-emerald-200';
      case 'CANCELADO': return 'bg-red-500/10 text-red-600 border border-red-200';
      default: return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Visão geral do seu negócio hoje.</p>
        </div>
      </div>

      {/* Cards de Resumo - HUD Style Light */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pedidos Hoje</h3>
          <p className="text-4xl font-black text-slate-800 mt-3 relative z-10">{pedidosHoje.length}</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Faturamento Hoje</h3>
          <p className="text-4xl font-black text-emerald-600 mt-3 relative z-10">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(faturamentoHoje)}
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pedidos Pendentes</h3>
          <p className="text-4xl font-black text-orange-500 mt-3 relative z-10">{pedidosPendentes.length}</p>
        </div>
      </div>

      {/* CONTAINER PRINCIPAL DA TABELA/CARDS MOBILE */}
      <div className="md:bg-white md:rounded-2xl md:border border-slate-100 md:shadow-xl md:shadow-slate-200/40 overflow-hidden">

        {/* Título da Seção */}
        <div className="p-1 md:p-6 mb-2 md:mb-0 md:border-b border-slate-100 md:bg-slate-50/50">
          <h2 className="text-xl md:text-lg font-extrabold md:font-bold text-slate-800">Pedidos Recentes</h2>
        </div>

        <div className="w-full">
          {pedidos.length === 0 ? (
            <div className="p-8 md:p-12 text-center text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 md:border-none shadow-sm md:shadow-none">
              Nenhum pedido recebido ainda hoje.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">

              {/* O thead some no mobile e só aparece no Desktop (md:table-header-group) */}
              <thead className="hidden md:table-header-group">
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/4">Cliente</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Itens</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ação</th>
                </tr>
              </thead>

              {/* No mobile o tbody vira um "block" para empilhar os cards */}
              <tbody className="block md:table-row-group space-y-4 md:space-y-0">
                {pedidos.map((pedido) => (
                  <tr
                    key={pedido.id}
                    className="block md:table-row bg-white md:bg-transparent border border-slate-100 md:border-b md:border-x-0 md:border-t-0 rounded-2xl md:rounded-none p-5 md:p-0 shadow-sm md:shadow-none hover:bg-slate-50/50 transition-colors"
                  >

                    {/* Cliente & Badge de Status (O badge aparece junto do nome no mobile) */}
                    <td className="flex justify-between items-start md:table-cell md:p-4 mb-3 md:mb-0">
                      <div>
                        <p className="font-bold text-slate-800 text-lg md:text-base">{pedido.clienteNome}</p>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">{pedido.clienteTelefone}</p>
                      </div>
                      <div className="md:hidden">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${getStatusBadge(pedido.status)}`}>
                          {pedido.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    </td>

                    {/* Lista de Itens */}
                    <td className="block md:table-cell md:p-4 mb-3 md:mb-0 text-sm text-slate-600 md:max-w-[200px] md:truncate">
                      <span className="md:hidden text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Resumo do Pedido:
                      </span>
                      <p className="leading-relaxed line-clamp-2 md:line-clamp-none">
                        {pedido.itens.map(i => `${i.quantidade}x ${i.produtoNome}`).join(", ")}
                      </p>
                    </td>

                    {/* Total (Ganha um fundo cinza no mobile pra dar destaque) */}
                    <td className="flex justify-between items-center md:table-cell font-bold text-slate-700 mb-4 md:mb-0 bg-slate-50 md:bg-transparent -mx-5 px-5 py-3 md:mx-0 md:p-4 border-y border-slate-100 md:border-none">
                      <span className="md:hidden text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Valor Total:
                      </span>
                      <span className="text-lg md:text-base text-emerald-600 md:text-slate-700">
                        R$ {pedido.total.toFixed(2)}
                      </span>
                    </td>

                    {/* Badge de Status (Só aparece no Desktop, pois no mobile já está no topo) */}
                    <td className="hidden md:table-cell p-4 text-center">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm whitespace-nowrap ${getStatusBadge(pedido.status)}`}>
                        {pedido.status.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Ações (Botões ocupam 100% da largura no mobile para facilitar o clique) */}
                    <td className="block md:table-cell md:p-4 mt-4 md:mt-0 md:text-right">
                      {pedido.status === "RECEBIDO" && (
                        <form action={atualizarStatusPedido.bind(null, pedido.id, "PREPARANDO")}>
                          <button type="submit" className="w-full md:w-auto px-4 py-3 md:py-2 bg-indigo-600 text-white rounded-xl md:rounded-lg text-sm md:text-xs font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200">
                            Aceitar & Preparar
                          </button>
                        </form>
                      )}
                      {pedido.status === "PREPARANDO" && (
                        <form action={atualizarStatusPedido.bind(null, pedido.id, "SAIU_PARA_ENTREGA")}>
                          <button type="submit" className="w-full md:w-auto px-4 py-3 md:py-2 bg-blue-500 text-white rounded-xl md:rounded-lg text-sm md:text-xs font-bold hover:bg-blue-600 transition shadow-md shadow-blue-200">
                            Despachar Pedido
                          </button>
                        </form>
                      )}
                      {pedido.status === "SAIU_PARA_ENTREGA" && (
                        <form action={atualizarStatusPedido.bind(null, pedido.id, "FINALIZADO")}>
                          <button type="submit" className="w-full md:w-auto px-4 py-3 md:py-2 bg-emerald-500 text-white rounded-xl md:rounded-lg text-sm md:text-xs font-bold hover:bg-emerald-600 transition shadow-md shadow-emerald-200">
                            Concluir Entrega
                          </button>
                        </form>
                      )}
                      {(pedido.status === "FINALIZADO" || pedido.status === "CANCELADO") && (
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center md:justify-end gap-1 py-2 md:py-0 bg-slate-50 md:bg-transparent rounded-lg md:rounded-none">
                          {pedido.status === "FINALIZADO" ? "✅ Concluído" : "❌ Cancelado"}
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}