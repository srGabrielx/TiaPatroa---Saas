"use client";

import { useState, useEffect } from "react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";

interface Produto {
    id: string;
    nome: string;
    descricao: string | null;
    preco: number;
    imagemUrl?: string | null;
    imagem?: string | null;
    categoria: string;
}

interface ProdutoModalProps {
    produto: Produto | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProdutoModal({ produto, isOpen, onClose }: ProdutoModalProps) {
    const [quantidade, setQuantidade] = useState(1);
    const [observacao, setObservacao] = useState("");

    useEffect(() => {
        if (isOpen) {
            setQuantidade(1);
            setObservacao("");
        }
    }, [isOpen]);

    if (!isOpen || !produto) return null;

    const imagemExibicao = produto.imagemUrl || produto.imagem || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

    const adicionarAoCarrinho = () => {
        const STORAGE_KEY = "carrinho_tia_patroa";
        const salvo = localStorage.getItem(STORAGE_KEY);
        let carrinhoAtual = [];

        try {
            const parsed = salvo ? JSON.parse(salvo) : [];
            carrinhoAtual = Array.isArray(parsed) ? parsed : [];
        } catch {
            carrinhoAtual = [];
        }

        carrinhoAtual.push({
            id: produto.id + "_" + Date.now(),
            produtoId: produto.id,
            nome: produto.nome,
            preco: Number(produto.preco),
            imagemUrl: imagemExibicao,
            quantidade: quantidade,
            observacao: observacao
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinhoAtual));
        window.dispatchEvent(new Event("carrinhoAtualizado"));
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
            {/* Fundo Escuro */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Container do Modal Premium (Agora com trava de altura dinâmica 90dvh) */}
            <div className="relative w-full max-w-4xl bg-white rounded-t-[1.5rem] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90dvh] md:max-h-[85vh] animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95 duration-200">

                {/* Botão Fechar Global (Desktop) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-gray-100 backdrop-blur-md text-gray-900 rounded-full transition-colors z-20 hidden md:flex shadow-sm"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Imagem inteira, sem recorte, em qualquer tamanho de tela */}
                <div className="relative w-full md:w-1/2 h-[40dvh] md:h-auto md:min-h-[32rem] bg-gray-100 shrink-0">
                    <img
                        src={imagemExibicao}
                        alt={produto.nome}
                        className="w-full h-full object-contain"
                    />
                    {/* Botão Fechar (Mobile) */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-md md:hidden z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden pointer-events-none" />
                </div>

                {/* Seção de Conteúdo e Ações (Uso de min-h-0 para forçar o scroll e preservar o rodapé) */}
                <div className="w-full md:w-1/2 flex flex-col min-h-0">

                    {/* Textos com Scroll Seguro */}
                    <div className="p-5 md:p-8 flex-1 overflow-y-auto min-h-0">
                        <div className="mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                {produto.nome}
                            </h2>
                            <p className="text-gray-600 mt-2 text-sm md:text-base leading-relaxed">
                                {produto.descricao}
                            </p>
                        </div>

                        {/* Observações */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                Alguma observação?
                                <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">
                                    Opcional
                                </span>
                            </label>
                            <textarea
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                                placeholder="Ex: Tirar cebola, maionese à parte..."
                                rows={3}
                                className="w-full bg-white border border-gray-300 rounded-xl p-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all text-sm resize-none"
                            />
                        </div>
                    </div>

                    {/* Rodapé de Ações (Fixo na base - shrink-0 impede que ele seja esmagado) */}
                    <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-100 flex items-center gap-3 md:gap-4 shrink-0">

                        {/* Controle de Quantidade */}
                        <div className="flex items-center justify-between w-[110px] md:w-[120px] bg-white border border-gray-200 rounded-xl p-1 h-12 md:h-14">
                            <button
                                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                                className="w-10 h-full flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold text-gray-900 w-8 text-center">
                                {quantidade}
                            </span>
                            <button
                                onClick={() => setQuantidade(quantidade + 1)}
                                className="w-10 h-full flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Botão Adicionar - Verde Premium */}
                        <button
                            type="button"
                            onClick={adicionarAoCarrinho}
                            className="flex-1 h-12 md:h-14 bg-emerald-600 text-white font-semibold text-sm md:text-base rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-between px-4 md:px-5"
                        >
                            <span className="flex items-center gap-1.5 md:gap-2">
                                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                                Adicionar
                            </span>
                            <span>
                                R$ {(produto.preco * quantidade).toFixed(2)}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
