"use client";

export default function ProdutoCard({ produto, onClick }: { produto: any, onClick: () => void }) {
    const imagemExibicao = produto.imagemUrl || produto.imagem || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

    return (
        <div 
            onClick={onClick}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all cursor-pointer group"
        >
            <div className="flex-1 min-w-0 py-1">
                <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                    {produto.nome}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1 leading-snug">
                    {produto.descricao || "Preparado com ingredientes frescos e selecionados."}
                </p>
                <div className="mt-3 font-bold text-gray-900">
                    R$ {produto.preco.toFixed(2)}
                </div>
            </div>

            <div className="relative w-28 h-28 shrink-0">
                <img 
                    src={imagemExibicao} 
                    alt={produto.nome} 
                    className="w-full h-full object-cover rounded-xl"
                />
            </div>
        </div>
    );
}