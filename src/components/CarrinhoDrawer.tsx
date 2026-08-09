"use client";
import { useEffect, useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingCart} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CarrinhoDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [itens, setItens] = useState<any[]>([]);
    const router = useRouter();

    const TAXA_ENTREGA = 5.00;
    // A CHAVE MÁGICA: Tem que ser exatamente a mesma do Modal
    const STORAGE_KEY = "carrinho_tia_patroa";

    useEffect(() => {
        const carregarCarrinho = () => {
            const salvo = localStorage.getItem(STORAGE_KEY);
            if (salvo) {
                try {
                    setItens(JSON.parse(salvo));
                } catch {
                    setItens([]);
                }
            } else {
                setItens([]);
            }
        };

        carregarCarrinho();
        window.addEventListener("carrinhoAtualizado", carregarCarrinho);
        return () => window.removeEventListener("carrinhoAtualizado", carregarCarrinho);
    }, []);

    const removerItem = (id: string) => {
        const novo = itens.filter(item => item.id !== id);
        setItens(novo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(novo));
        window.dispatchEvent(new Event("carrinhoAtualizado"));
    };

    const alterarQuantidade = (id: string, delta: number) => {
        const novo = itens.map(item => {
            if (item.id === id) {
                const novaQtd = item.quantidade + delta;
                return novaQtd > 0 ? { ...item, quantidade: novaQtd } : item;
            }
            return item;
        });
        setItens(novo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(novo));
        window.dispatchEvent(new Event("carrinhoAtualizado"));
    };

    const subtotal = itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const total = itens.length > 0 ? subtotal + TAXA_ENTREGA : 0;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 sm:px-4 sm:py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full sm:rounded-lg transition flex items-center gap-2"
            >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:block text-sm font-semibold">Carrinho</span>
                {itens.length > 0 && (
                    <span className="absolute top-0 right-0 sm:-top-1 sm:-right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full animate-bounce">
                        {itens.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Seu Pedido</h2>
                            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {itens.length === 0 ? (
                                <div className="text-center text-gray-500 mt-10">Seu carrinho está vazio.</div>
                            ) : (
                                itens.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <img src={item.imagemUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} alt={item.nome} className="w-20 h-20 object-cover rounded-xl border border-gray-100 shrink-0" />
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-sm text-gray-900 leading-tight">{item.nome}</h3>
                                                    {item.observacao && (
                                                        <p className="text-xs text-red-500 mt-1 font-medium italic line-clamp-2">Nota: {item.observacao}</p>
                                                    )}
                                                </div>
                                                <button onClick={() => removerItem(item.id)} className="text-gray-400 hover:text-red-500 transition ml-2 shrink-0">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="font-bold text-gray-900">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                                    <button onClick={() => alterarQuantidade(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-600"><Minus className="w-3 h-3" /></button>
                                                    <span className="text-sm font-semibold w-4 text-center text-gray-900">{item.quantidade}</span>
                                                    <button onClick={() => alterarQuantidade(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-600"><Plus className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {itens.length > 0 && (
                            <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
                                <div className="space-y-2 text-sm text-gray-500">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">R$ {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Taxa de entrega</span>
                                        <span className="font-medium text-gray-900">R$ {TAXA_ENTREGA.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-xl font-bold text-red-600">R$ {total.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={() => { setIsOpen(false); router.push("/checkout"); }}
                                    className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200"
                                >
                                    Finalizar Pedido
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}