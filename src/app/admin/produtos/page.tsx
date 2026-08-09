import { prisma } from "@/lib/prisma";
import { criarProduto, alterarDisponibilidade, excluirProduto } from "@/app/actions/produtos";

export const dynamic = 'force-dynamic';

export default async function ProdutosAdminPage() {
  const produtos = await prisma.produto.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão do Cardápio</h1>
          <p className="text-gray-500 mt-1">Adicione, edite ou remova produtos da vitrine.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Formulário de Criação (Coluna Lateral) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Novo Produto</h2>
            <form action={criarProduto} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                <input required type="text" name="nome" placeholder="Ex: Hambúrguer Duplo" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea required name="descricao" rows={3} placeholder="Ingredientes e detalhes..." className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                  <input required type="number" step="0.01" name="preco" placeholder="29.90" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select required name="categoria" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="Prato Do Dia">Prato do Dia</option>
                    <option value="Lanches">Lanches</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Açaí c/ Acompanhamento">Açaí</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                <input required type="url" name="imagemUrl" placeholder="https://..." className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition shadow-sm">
                Cadastrar Produto
              </button>
            </form>
          </div>
        </div>

        {/* Tabela de Produtos (Conteúdo Principal) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                  <th className="p-4 font-medium">Nome</th>
                  <th className="p-4 font-medium">Preço</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {produtos.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">Nenhum produto cadastrado.</td>
                  </tr>
                )}
                {produtos.map((produto) => (
                  <tr key={produto.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">{produto.nome}</p>
                      <p className="text-xs text-gray-500">{produto.categoria}</p>
                    </td>
                    <td className="p-4 font-medium text-gray-900">R$ {produto.preco.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${produto.disponivel ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}>
                        {produto.disponivel ? "Disponível" : "Esgotado"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {/* Botão de Status (Server Action) */}
                      <form action={alterarDisponibilidade.bind(null, produto.id, !produto.disponivel)} className="inline">
                        <button type="submit" className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition">
                          {produto.disponivel ? "Pausar" : "Ativar"}
                        </button>
                      </form>

                      {/* Botão de Excluir (Server Action) */}
                      <form action={excluirProduto.bind(null, produto.id)} className="inline">
                        <button type="submit" className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition">
                          Excluir
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}