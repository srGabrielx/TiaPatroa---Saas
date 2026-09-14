"use client";

import { useState } from "react";
import { Plus, X, UtensilsCrossed, Check } from "lucide-react";
import { cadastrarProdutoViaIndex } from "@/app/actions/produtos";
import { useRouter } from "next/navigation";


export default function CadastrarProdutoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    categoria: "Prato Do Dia",
    preco: "",
    descricao: "",
    imagemUrl: "",
  });

  const sugestoesImagens = [
    { label: "Prato Caseiro", url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500" },
    { label: "Hambúrguer", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
    { label: "Porção Batata", url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500" },
    { label: "Sobremesa", url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500" },
    { label: "Bebida Gelada", url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const data = new FormData();
    data.append("nome", formData.nome);
    data.append("categoria", formData.categoria);
    data.append("preco", formData.preco);
    data.append("descricao", formData.descricao);
    data.append("imagemUrl", formData.imagemUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500");

    try {
      const res = await cadastrarProdutoViaIndex(data);
      if (res.success) {
        setMensagemSucesso(true);
        setFormData({
          nome: "",
          categoria: "Prato Do Dia",
          preco: "",
          descricao: "",
          imagemUrl: "",
        });
        setTimeout(() => {
          setMensagemSucesso(false);
          setIsOpen(false);
          router.refresh();
        }, 1200);
      } else {
        setErro(res.error || "Erro ao cadastrar");
      }
    } catch (err: any) {
      setErro(err?.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        id="btn-abrir-cadastro-index"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-bold backdrop-blur-xs border border-white/30 transition-all active:scale-95 shadow-sm cursor-pointer"
      >
        <Plus size={18} />
        <span>+ Cadastrar Produto</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Header do Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
                  <UtensilsCrossed size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Cadastrar Novo Produto</h3>
                  <p className="text-xs text-slate-500">Adicione novos itens e pratos ao cardápio</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>
            </div>


            {/* Corpo do Formulário */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {mensagemSucesso && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2">
                  <Check size={18} className="text-emerald-600 shrink-0" />
                  Produto cadastrado com sucesso no cardápio!
                </div>
              )}

              {erro && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                  {erro}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nome do Prato / Produto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Marmitex Executivo Especial"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-slate-800 font-medium"
                  >
                    <option value="Prato Do Dia">Prato Do Dia</option>
                    <option value="Lanches">Lanches</option>
                    <option value="Porções">Porções</option>
                    <option value="Sobremesas">Sobremesas</option>
                    <option value="Bebidas">Bebidas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="24.90"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Descrição / Ingredientes
                </label>
                <textarea
                  rows={2}
                  placeholder="Arroz, feijão tropeiro, carne assada e salada verde..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.imagemUrl}
                  onChange={(e) => setFormData({ ...formData, imagemUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-slate-800 font-medium"
                />

                {/* Sugestões Rápidas de Imagens */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <UtensilsCrossed size={12} /> Sugestões:
                  </span>
                  {sugestoesImagens.map((sug) => (

                    <button
                      key={sug.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, imagemUrl: sug.url })}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition"
                    >
                      {sug.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md shadow-red-200 transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Cadastrando..." : "Cadastrar no Cardápio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
