import { prisma } from "@/lib/prisma";
import { criarProduto, alterarDisponibilidade, excluirProduto } from "@/app/actions/produtos";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = 'force-dynamic';

export default async function ProdutosAdminPage() {
  await requireAdmin();
  const produtos = await prisma.produto.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Gestão do Cardápio</h1>
          <p className="text-slate-500 mt-1">Adicione, edite ou remova produtos da sua vitrine.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Formulário de Criação (Coluna Sticky no PC) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 lg:sticky lg:top-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Adicionar Novo Produto
          </h2>
          <form action={criarProduto} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Nome do Produto
              </label>
              <input
                type="text"
                name="nome"
                required
                placeholder="Ex: X-Salada Especial"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium placeholder-slate-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="preco"
                  required
                  placeholder="25.90"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Categoria
                </label>
                <select
                  name="categoria"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
                >
                  <option value="Lanches">Lanches</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Sobremesas">Sobremesas</option>
                  <option value="Porções">Porções</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                URL da Imagem
              </label>
              <input
                type="url"
                name="imagemUrl"
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Descrição
              </label>
              <textarea
                name="descricao"
                rows={3}
                placeholder="Ingredientes e detalhes do produto..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-200 mt-2"
            >
              Cadastrar Produto
            </button>
          </form>
        </div>

        {/* Lista de Produtos (Cards no Mobile First / Tabela no PC) */}
        <div className="lg:col-span-2 lg:bg-white lg:rounded-2xl lg:border border-slate-100 lg:shadow-xl lg:shadow-slate-200/40 overflow-hidden">

          <div className="p-1 lg:p-6 mb-2 lg:mb-0 lg:border-b border-slate-100 lg:bg-slate-50/50">
            <h2 className="text-xl lg:text-lg font-extrabold lg:font-bold text-slate-800">
              Produtos Cadastrados ({produtos.length})
            </h2>
          </div>

          {produtos.length === 0 ? (
            <div className="p-8 lg:p-12 text-center text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 lg:border-none shadow-sm lg:shadow-none">
              Nenhum produto cadastrado no cardápio.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse whitespace-nowrap">

              <thead className="hidden lg:table-header-group">
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produto</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoria</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Preço</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>

              <tbody className="block lg:table-row-group space-y-4 lg:space-y-0">
                {produtos.map((produto) => (
                  <tr
                    key={produto.id}
                    className="block lg:table-row bg-white lg:bg-transparent border border-slate-100 lg:border-b lg:border-x-0 lg:border-t-0 rounded-2xl lg:rounded-none p-5 lg:p-0 shadow-sm lg:shadow-none hover:bg-slate-50/50 transition-colors"
                  >

                    {/* Foto + Nome + Descrição */}
                    <td className="block lg:table-cell lg:p-4 mb-3 lg:mb-0">
                      <div className="flex items-center gap-3">
                        {produto.imagemUrl ? (
                          <img
                            src={produto.imagemUrl}
                            alt={produto.nome}
                            className="w-14 h-14 lg:w-12 lg:h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 lg:w-12 lg:h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                            Sem Foto
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="font-bold text-slate-800 text-base lg:text-sm">{produto.nome}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[220px] lg:max-w-[200px] mt-0.5">
                            {produto.descricao || "Sem descrição"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Categoria + Preço (No mobile vira faixa de destaque) */}
                    <td className="flex justify-between items-center lg:table-cell lg:p-4 mb-3 lg:mb-0 bg-slate-50 lg:bg-transparent -mx-5 px-5 py-2.5 lg:mx-0 border-y border-slate-100 lg:border-none">
                      <span className="text-xs font-semibold text-slate-500 lg:text-slate-600 uppercase tracking-wider lg:normal-case lg:font-medium lg:bg-slate-100 lg:px-2.5 lg:py-1 lg:rounded-md">
                        {produto.categoria}
                      </span>
                      <span className="lg:hidden font-extrabold text-emerald-600 text-base">
                        R$ {produto.preco.toFixed(2)}
                      </span>
                    </td>

                    {/* Preço (Desktop) */}
                    <td className="hidden lg:table-cell p-4 font-bold text-slate-800">
                      R$ {produto.preco.toFixed(2)}
                    </td>

                    {/* Status Badge */}
                    <td className="flex justify-between items-center lg:table-cell lg:p-4 lg:text-center mb-4 lg:mb-0">
                      <span className="lg:hidden text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Disponibilidade:
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${produto.disponivel
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-200"
                          : "bg-red-500/10 text-red-600 border border-red-200"
                        }`}>
                        {produto.disponivel ? "Disponível" : "Esgotado"}
                      </span>
                    </td>

                    {/* Ações (Botões Lado a Lado no Mobile) */}
                    <td className="block lg:table-cell lg:p-4 lg:text-right pt-2 lg:pt-0 border-t border-slate-100 lg:border-none">
                      <div className="flex items-center gap-2 lg:justify-end">
                        <form action={alterarDisponibilidade.bind(null, produto.id, !produto.disponivel)} className="flex-1 lg:flex-initial">
                          <button
                            type="submit"
                            className={`w-full lg:w-auto px-4 py-2.5 lg:py-1.5 rounded-xl lg:rounded-lg text-xs font-bold transition ${produto.disponivel
                                ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                              }`}
                          >
                            {produto.disponivel ? "Pausar" : "Ativar"}
                          </button>
                        </form>

                        <form action={excluirProduto.bind(null, produto.id)} className="flex-1 lg:flex-initial">
                          <button
                            type="submit"
                            className="w-full lg:w-auto px-4 py-2.5 lg:py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl lg:rounded-lg text-xs font-bold transition"
                          >
                            Excluir
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
