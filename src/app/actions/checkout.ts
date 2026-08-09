"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ItemCarrinho {
    id: string;
    produtoId?: string;
    nome: string;
    preco: number;
    quantidade: number;
    observacao?: string;
}

interface DadosPedido {
    clienteNome: string;
    clienteTelefone: string;
    clienteEmail?: string;
    userId?: string;
    endereco: string;
    numero: string;
    bairro: string;
    formaPagamento: string;
    trocoPara?: string;
    observacoes?: string;
    total: number;
    itens: ItemCarrinho[];
}

export async function criarPedido(dados: DadosPedido) {
    try {
        const enderecoCompleto = `${dados.endereco}, ${dados.numero} - ${dados.bairro}`;

        let obsFinal = dados.observacoes || "";

        if (dados.formaPagamento === "DINHEIRO" && dados.trocoPara) {
            obsFinal = `Troco para: ${dados.trocoPara} | ${obsFinal}`;
        }

        const obsItens = dados.itens
            .filter(item => item.observacao && item.observacao.trim() !== "")
            .map(item => `${item.quantidade}x ${item.nome} (${item.observacao})`)
            .join(" \n");

        if (obsItens.length > 0) {
            obsFinal = `${obsFinal}\n\nDetalhes dos itens:\n${obsItens}`.trim();
        }

        const pedido = await prisma.pedido.create({
            data: {
                clienteNome: dados.clienteNome,
                clienteTelefone: dados.clienteTelefone,
                endereco: enderecoCompleto,
                formaPagamento: dados.formaPagamento,
                observacoes: obsFinal !== "" ? obsFinal : null,
                total: dados.total,
                status: "RECEBIDO",
                itens: {
                    create: dados.itens.map((item) => ({
                        produtoNome: item.nome,
                        quantidade: item.quantidade,
                        precoUnit: item.preco,
                    }))
                }
            }
        });

        revalidatePath("/admin/pedidos");
        revalidatePath("/admin");

        return { sucesso: true, id: pedido.id };
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return { erro: "Falha ao processar o pedido. Tente novamente." };
    }
}