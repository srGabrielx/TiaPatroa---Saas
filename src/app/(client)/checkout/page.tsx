"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { criarPedido } from "@/app/actions/checkout";
import Link from "next/link";
import { CircleCheck, ChevronRight, MapPin, CreditCard, User, ShoppingBag, Receipt, AlertCircle } from "lucide-react";

export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
    const router = useRouter();
    const [itens, setItens] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    const [formData, setFormData] = useState({
        clienteNome: "",
        clienteTelefone: "",
        endereco: "",
        bairro: "",
        numero: "",
        formaPagamento: "PIX",
        trocoPara: "",
        observacoes: "",
    });

    const TAXA_ENTREGA = 5.00;

    useEffect(() => {
        const salvo = localStorage.getItem("carrinho_tia_patroa") || localStorage.getItem("carrinho");
        if (salvo) {
            try {
                setItens(JSON.parse(salvo));
            } catch {
                setItens([]);
            }
        }
    }, []);

    const subtotal = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    const total = subtotal > 0 ? subtotal + TAXA_ENTREGA : 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErro("");

        try {
            const resposta = await criarPedido({
                ...formData,
                total,
                itens
            });

            if (resposta?.erro) {
                setErro(resposta.erro);
                setLoading(false);
                return;
            }

            if (resposta?.id) {
                // 1. Salva o pedido no histórico local do cliente ("Meus Pedidos")
                const historicoLocal = JSON.parse(localStorage.getItem("meus_pedidos_tia_patroa") || "[]");
                historicoLocal.unshift({
                    id: resposta.id,
                    data: new Date().toISOString(),
                    total,
                    clienteNome: formData.clienteNome,
                    clienteTelefone: formData.clienteTelefone
                });
                localStorage.setItem("meus_pedidos_tia_patroa", JSON.stringify(historicoLocal));

                // 2. Limpa o carrinho
                localStorage.removeItem("carrinho_tia_patroa");
                localStorage.removeItem("carrinho");
                window.dispatchEvent(new Event("carrinhoAtualizado"));

                // 3. Redireciona para o acompanhamento do pedido
                router.push(`/pedido/${resposta.id}`);
            } else {
                setLoading(false);
                setErro("Não foi possível obter o identificador do pedido.");
            }
        } catch (err) {
            setErro("Ocorreu um erro ao processar seu pedido. Tente novamente.");
            setLoading(false);
        }
    };

    if (itens.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <ShoppingBag className="w-16 h-16 text-gray-300" />
                <h1 className="text-2xl font-bold text-gray-900">Seu carrinho está vazio</h1>
                <Link href="/" className="text-red-600 font-semibold hover:underline">
                    Escolher produtos
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">

            {/* Cabeçalho do Checkout */}
            <div className="flex items-center gap-3 mb-8">
                <Link href="/" className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition">
                    <ChevronRight className="w-6 h-6 rotate-180" />
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Finalizar Pedido</h1>
            </div>

            {/* Alertas de Erro */}
            {erro && (
                <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-medium text-sm">{erro}</span>
                </div>
            )}

            {/* Layout Dividido */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                {/* Coluna Esquerda: Dados de Entrega */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Bloco 1: Dados Pessoais */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-red-600" />
                                <h2 className="text-lg font-bold text-gray-900">Dados Pessoais</h2>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
                                <input required type="text" name="clienteNome" value={formData.clienteNome} onChange={handleChange} placeholder="Como quer ser chamado?" className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-xl p-3 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone (WhatsApp)</label>
                                <input required type="tel" name="clienteTelefone" value={formData.clienteTelefone} onChange={handleChange} placeholder="(11) 90000-0000" className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-xl p-3 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition" />
                            </div>
                        </div>
                    </div>

                    {/* Bloco 2: Endereço de Entrega */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-red-600" />
                                <h2 className="text-lg font-bold text-gray-900">Endereço de Entrega</h2>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Rua / Avenida</label>
                                    <input required type="text" name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Ex: Av. Brasil" className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-xl p-3 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Número</label>
                                    <input required type="text" name="numero" value={formData.numero} onChange={handleChange} placeholder="1000" className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-xl p-3 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Bairro & Ponto de Referência</label>
                                <input required type="text" name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Ex: Centro - Próximo à praça" className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-xl p-3 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition" />
                            </div>
                        </div>
                    </div>

                    {/* Bloco 3: Pagamento e Observações */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-red-600" />
                                <h2 className="text-lg font-bold text-gray-900">Forma de Pagamento</h2>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <select name="formaPagamento" value={formData.formaPagamento} onChange={handleChange} className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl p-3 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition font-medium">
                                    <option value="PIX">Pix (Chave exibida no final)</option>
                                    <option value="CARTAO_ENTREGA">Cartão na Entrega (Maquininha)</option>
                                    <option value="DINHEIRO">Dinheiro (Pagamento na Entrega)</option>
                                </select>
                            </div>

                            {formData.formaPagamento === "DINHEIRO" && (
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Troco para quanto?</label>
                                    <input type="text" name="trocoPara" value={formData.trocoPara} onChange={handleChange} placeholder="Ex: 50 reais" className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-xl p-3 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition" />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1 mt-4">Observações do Pedido</label>
                                <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Ex: Campainha quebrada, tocar interfone..." rows={3} className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-xl p-3 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition resize-none"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna Direita: Resumo Fixo (Com Alinhamento Ajustado) */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <Receipt className="w-5 h-5 text-gray-500" />
                            <h2 className="text-lg font-bold text-gray-900">Resumo do Pedido</h2>
                        </div>

                        {/* Itens do Resumo com badge de quantidade corrigido */}
                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                            {itens.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start gap-3">
                                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                        <span className="shrink-0 font-bold text-gray-900 text-xs bg-gray-100 px-2 py-1 rounded-md h-fit leading-none mt-0.5">
                                            {item.quantidade}x
                                        </span>
                                        <span className="text-sm font-medium text-gray-700 leading-snug break-words min-w-0">
                                            {item.nome}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 shrink-0 ml-2">
                                        R$ {(item.preco * item.quantidade).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Fechamento com Entrega */}
                        <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="text-gray-900 font-medium">R$ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Taxa de Entrega</span>
                                <span className="text-gray-900 font-medium">R$ {TAXA_ENTREGA.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
                            <span className="text-lg font-bold text-gray-900">Total a pagar</span>
                            <span className="text-2xl font-black text-red-600">R$ {total.toFixed(2)}</span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Processando..." : (
                                <>
                                    <CircleCheck className="w-5 h-5" />
                                    Confirmar Pedido 🚀
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
}