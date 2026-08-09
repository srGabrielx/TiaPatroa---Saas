"use client";

import { useState } from "react";
import ProdutoCard from "./ProdutoCard";
import ProdutoModal from "./ProdutoModal";

// Coloquei um = [] para garantir que NUNCA será undefined
export default function CardapioVitrine({ produtos = [] }: { produtos: any[] }) {
    const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
    const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);

    // Agora o .map() nunca vai falhar
    const categorias = ["Todos", ...Array.from(new Set(produtos.map((p) => p.categoria)))];

    const produtosFiltrados = categoriaAtiva === "Todos"
        ? produtos
        : produtos.filter(p => p.categoria === categoriaAtiva);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            {/* Filtro de Categorias - Alinhado à esquerda e deslizável (Padrão iFood) */}
            <div className="flex justify-start gap-3 overflow-x-auto no-scrollbar pb-4 mb-6 snap-x">
                {categorias.map(categoria => (
                    <button
                        key={categoria}
                        onClick={() => setCategoriaAtiva(categoria)}
                        className={`snap-start whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${categoriaAtiva === categoria
                                ? "bg-red-600 text-white shadow-md shadow-red-200"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-red-600 hover:text-red-600"
                            }`}
                    >
                        {categoria}
                    </button>
                ))}
            </div>

            {/* Grelha de Produtos - Compacta e idêntica ao iFood */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {produtosFiltrados.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        Nenhum produto encontrado.
                    </div>
                ) : (
                    produtosFiltrados.map((produto) => (
                        <ProdutoCard
                            key={produto.id}
                            produto={produto}
                            onClick={() => setProdutoSelecionado(produto)}
                        />
                    ))
                )}
            </div>

            {/* Modal de Detalhes e Carrinho */}
            <ProdutoModal
                produto={produtoSelecionado}
                isOpen={!!produtoSelecionado}
                onClose={() => setProdutoSelecionado(null)}
            />
        </div>
    );
}