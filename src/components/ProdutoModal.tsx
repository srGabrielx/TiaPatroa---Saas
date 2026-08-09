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
        const STORAGE_KEY = "carrinho_tia_patroa"; // A mesma chave mágica!
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
        window.dispatchEvent(new Event("carrinhoAtualizado")); // Dispara o alerta para o CarrinhoDrawer abrir!
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-xl bg-white sm:rounded-2xl rounded-t-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                <div className="relative h-56 sm:h-72 w-full shrink-0 bg-gray-100">
                    <img
                        src={imagemExibicao}
                        alt={produto.nome}
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md text-gray-900 rounded-full hover:bg-white hover:scale-105 transition-all shadow-md"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 sm:p-8 flex-1 overflow-y-auto flex flex-col gap-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{produto.nome}</h2>
                        <p className="text-gray-500 text-sm leading-relaxed mt-2">{produto.descricao}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Alguma observação?</label>
                        <textarea
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                            placeholder="Ex: Tirar cebola, maionese à parte..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-red-600 focus:bg-white transition text-sm resize-none"
                            rows={3}
                        />
                    </div>
                </div>

                <div className="p-4 sm:p-6 bg-white border-t border-gray-100 shrink-0 flex flex-col sm:flex-row items-center gap-4">

                    <div className="flex items-center justify-between w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-xl p-1.5 h-14 shadow-inner">
                        <button
                            onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                            className="w-12 h-full flex items-center justify-center bg-white text-gray-600 rounded-lg shadow-sm hover:text-red-600 transition font-bold text-xl"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-gray-900 w-8 text-center text-lg">{quantidade}</span>
                        <button
                            onClick={() => setQuantidade(quantidade + 1)}
                            className="w-12 h-full flex items-center justify-center bg-white text-gray-600 rounded-lg shadow-sm hover:text-red-600 transition font-bold text-xl"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={adicionarAoCarrinho}
                        className="w-full sm:flex-1 h-14 bg-red-600 text-white font-bold text-base rounded-xl hover:bg-red-700 hover:scale-[1.02] transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-3"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Adicionar • R$ {(produto.preco * quantidade).toFixed(2)}
                    </button>
                </div>

            </div>
        </div>
    );
}