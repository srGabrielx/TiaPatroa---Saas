"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Clock,
    CircleCheck,
    Bike,
    PackageCheck,
    ChevronLeft,
    MapPin,
    CreditCard,
    Receipt,
    Copy,
    Check,
    ChevronRight,
    RefreshCw,
    XCircle
} from "lucide-react";

interface ItemPedido {
    id: string;
    produtoNome: string;
    quantidade: number;
    precoUnit: number;
}

interface Pedido {
    id: string;
    clienteNome: string;
    clienteTelefone: string;
    endereco: string;
    formaPagamento: string;
    observacoes: string | null;
    total: number;
    status: string;
    createdAt: string;
    itens: ItemPedido[];
}

const STEPS = [
    { status: "RECEBIDO", label: "Pedido Recebido", icon: Clock, desc: "Aguardando confirmação da cozinha" },
    { status: "PREPARANDO", label: "Em Preparo", icon: PackageCheck, desc: "Seu lanche está no capricho" },
    { status: "SAIU_PARA_ENTREGA", label: "Saiu para Entrega", icon: Bike, desc: "O entregador já está a caminho" },
    { status: "ENTREGUE", label: "Entregue", icon: CircleCheck, desc: "Seu pedido foi entregue. Bom apetite!" }
];

export default function AcompanharPedidoPage({ params }: { params: { id: string } }) {
    const pedidoId = params.id;

    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const [copiado, setCopiado] = useState(false);
    const [mostrarItens, setMostrarItens] = useState(true);

    const buscarPedido = async () => {
        try {
            const res = await fetch(`/api/pedidos/${pedidoId}`);
            if (!res.ok) throw new Error("Pedido não encontrado");
            const data = await res.json();
            setPedido(data);
            setErro("");
        } catch (err: any) {
            setErro("Não foi possível carregar os detalhes do pedido.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarPedido();
        const interval = setInterval(buscarPedido, 5000);
        return () => clearInterval(interval);
    }, [pedidoId]);

    // Mapeamento resiliente de status para evitar fallback incorreto para o passo 0
    const getStepIndex = (status?: string) => {
        if (!status) return 0;
        const st = status.toUpperCase().trim().replace(/\s+/g, "_");
        switch (st) {
            case "RECEBIDO":
            case "PENDENTE":
            case "AGUARDANDO":
                return 0;
            case "PREPARANDO":
            case "EM_PREPARO":
            case "ACEITO":
            case "CONFIRMADO":
                return 1;
            case "SAIU_PARA_ENTREGA":
            case "SAIU_ENTREGA":
            case "A_CAMINHO":
            case "EM_TRANSITO":
                return 2;
            case "ENTREGUE":
            case "CONCLUIDO":
            case "FINALIZADO":
            case "COMPLETO":
                return 3;
            default:
                return 0;
        }
    };

    const isCancelado = (status?: string) => {
        if (!status) return false;
        const st = status.toUpperCase().trim();
        return st === "CANCELADO" || st === "RECUSADO";
    };

    const copiarPix = () => {
        // Tenta copiar o Pix real, se não tiver, copia o de teste
        const chave = (pedido as any)?.codigoPix || "00020126580014br.gov.bcb.pix0136...";
        navigator.clipboard.writeText(chave);
        alert("Código Pix copiado!"); // Aqui você pode usar o toast se preferir
    };
    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
                <p className="text-gray-500 font-medium">Buscando seu pedido na cozinha...</p>
            </div>
        );
    }

    if (erro || !pedido) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">!</div>
                <h1 className="text-2xl font-bold text-gray-900">Pedido não localizado</h1>
                <p className="text-gray-500">{erro || "Verifique o código informado."}</p>
                <Link href="/" className="inline-block bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition">
                    Voltar ao Cardápio
                </Link>
            </div>
        );
    }

    const cancelado = isCancelado(pedido.status);
    const currentStep = getStepIndex(pedido.status);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

            {/* Topo com Voltar */}
            <div className="flex items-center justify-between">
                <Link href="/pedidos" className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold text-sm transition">
                    <ChevronLeft className="w-5 h-5" />
                    Meus Pedidos
                </Link>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    ID: #{pedido.id.slice(-6)}
                </span>
            </div>

            {/* Card Principal - Linha do Tempo */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-black text-gray-900">Acompanhar Pedido</h1>
                    <p className="text-sm text-gray-500">
                        {cancelado
                            ? "Este pedido foi cancelado"
                            : currentStep === 3
                                ? "Pedido entregue com sucesso!"
                                : "Acompanhe o progresso em tempo real"}
                    </p>
                </div>

                {cancelado ? (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-2">
                        <XCircle className="w-12 h-12 text-red-600 mx-auto" />
                        <h2 className="text-lg font-bold text-red-900">Pedido Cancelado</h2>
                        <p className="text-sm text-red-700">Este pedido foi cancelado pela lanchonete ou pelo sistema.</p>
                    </div>
                ) : (
                    <>
                        {/* Stepper Progressivo */}
                        <div className="relative">
                            <div className="grid grid-cols-4 gap-2 relative z-10">
                                {STEPS.map((step, index) => {
                                    const Icon = step.icon;
                                    const isDone = index <= currentStep;
                                    const isCurrent = index === currentStep;

                                    return (
                                        <div key={step.status} className="flex flex-col items-center text-center space-y-2">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDone
                                                ? "bg-red-600 text-white shadow-md shadow-red-200"
                                                : "bg-gray-100 text-gray-400"
                                                } ${isCurrent ? "ring-4 ring-red-100 scale-110" : ""}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className={`text-xs font-bold ${isDone ? "text-gray-900" : "text-gray-400"}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Status Atual em Destaque */}
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center space-y-1">
                            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Status Atual</p>
                            <p className="text-lg font-bold text-red-900">{STEPS[currentStep]?.desc}</p>
                        </div>
                    </>
                )}
            </div>

            {/* Bloco PIX (Apenas se pagamento for PIX e status ainda não entregue/cancelado) */}
            {pedido.formaPagamento === "PIX" && currentStep < 3 && !cancelado && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-red-600" />
                        <h2 className="font-bold text-gray-900">Pagamento via PIX</h2>
                    </div>
                    <p className="text-xs text-gray-500">Copie a chave abaixo para realizar o pagamento no aplicativo do seu banco:</p>

                    <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-gray-100 rounded-xl w-full border border-gray-200">
                        <p className="text-xs sm:text-sm font-mono text-gray-600 break-all text-center sm:text-left w-full sm:flex-1">
                         
                            {/* Adicionei o ? logo depois de pedido para ele não quebrar se estiver vazio */}
                            {(pedido as any)?.codigoPix || "00020126580014br.gov.bcb.pix0136..."}
                        </p>

                        <button
                            onClick={copiarPix}
                            className="w-full sm:w-auto flex-shrink-0 px-6 py-3 sm:py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        >
                            Copiar Pix
                        </button>
                    </div>
                </div>
            )}

            {/* Detalhes do Pedido - Expansível com o Ícone > */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                    onClick={() => setMostrarItens(!mostrarItens)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50/50 transition text-left"
                >
                    <div className="flex items-center gap-3">
                        <Receipt className="w-5 h-5 text-red-600" />
                        <div>
                            <h2 className="font-bold text-gray-900">Itens do Pedido</h2>
                            <p className="text-xs text-gray-500">{pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}</p>
                        </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${mostrarItens ? 'rotate-90' : ''}`} />
                </button>

                {mostrarItens && (
                    <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
                        <div className="space-y-3">
                            {pedido.itens.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700 font-medium">
                                        <strong className="text-gray-900 font-bold mr-2">{item.quantidade}x</strong>
                                        {item.produtoNome}
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        R$ {(item.precoUnit * item.quantidade).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {pedido.observacoes && (
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-600">
                                <strong className="text-gray-900 block mb-0.5">Observações:</strong>
                                {pedido.observacoes}
                            </div>
                        )}

                        <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Forma de Pagamento</span>
                                <span className="font-semibold text-gray-900 uppercase">{pedido.formaPagamento}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                                <span className="text-gray-900">Total</span>
                                <span className="text-red-600">R$ {pedido.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Endereço de Entrega */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <h2 className="font-bold text-gray-900">Endereço de Entrega</h2>
                </div>
                <p className="text-sm text-gray-600 pl-8">{pedido.endereco}</p>
                <p className="text-xs text-gray-400 pl-8">Cliente: {pedido.clienteNome} ({pedido.clienteTelefone})</p>
            </div>

        </div>
    );
}