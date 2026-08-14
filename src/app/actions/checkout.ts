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
        const clienteNome = dados.clienteNome?.trim();
        const clienteTelefone = dados.clienteTelefone?.trim();
        const endereco = dados.endereco?.trim();
        const numero = dados.numero?.trim();
        const bairro = dados.bairro?.trim();
        const formasPagamento = ["PIX", "CARTAO_ENTREGA", "DINHEIRO"] as const;

        if (
            !clienteNome || clienteNome.length > 100 ||
            !clienteTelefone || clienteTelefone.length > 30 ||
            !endereco || endereco.length > 160 ||
            !numero || numero.length > 20 ||
            !bairro || bairro.length > 120 ||
            !formasPagamento.includes(dados.formaPagamento as (typeof formasPagamento)[number]) ||
            !Array.isArray(dados.itens) || dados.itens.length === 0 || dados.itens.length > 20
        ) {
            return { erro: "Confira os dados do pedido e tente novamente." };
        }

        const itensComQuantidadeValida = dados.itens.every((item) =>
            typeof item.produtoId === "string" &&
            item.produtoId.length > 0 &&
            Number.isInteger(item.quantidade) &&
            item.quantidade >= 1 &&
            item.quantidade <= 20
        );

        if (!itensComQuantidadeValida) {
            return { erro: "Há um item inválido no carrinho." };
        }

        const idsProdutos = [...new Set(dados.itens.map((item) => item.produtoId!))];
        const produtos = await prisma.produto.findMany({
            where: { id: { in: idsProdutos }, disponivel: true },
            select: { id: true, nome: true, preco: true },
        });
        const produtosPorId = new Map(produtos.map((produto) => [produto.id, produto]));

        if (produtosPorId.size !== idsProdutos.length) {
            return { erro: "Um ou mais produtos não estão mais disponíveis." };
        }

        const itensSeguros = dados.itens.map((item) => {
            const produto = produtosPorId.get(item.produtoId!);
            if (!produto) throw new Error("PRODUCT_NOT_FOUND");

            return {
                produtoNome: produto.nome,
                quantidade: item.quantidade,
                precoUnit: produto.preco,
                observacao: typeof item.observacao === "string" ? item.observacao.trim().slice(0, 300) : "",
            };
        });
        const subtotal = itensSeguros.reduce((acumulado, item) => acumulado + item.precoUnit * item.quantidade, 0);
        const totalCalculado = subtotal + 5;
        const enderecoCompleto = `${endereco}, ${numero} - ${bairro}`;

        let obsFinal = typeof dados.observacoes === "string" ? dados.observacoes.trim().slice(0, 800) : "";

        if (dados.formaPagamento === "DINHEIRO" && dados.trocoPara) {
            obsFinal = `Troco para: ${dados.trocoPara.trim().slice(0, 50)} | ${obsFinal}`;
        }

        const obsItens = itensSeguros
            .filter(item => item.observacao !== "")
            .map(item => `${item.quantidade}x ${item.produtoNome} (${item.observacao})`)
            .join(" \n");

        if (obsItens.length > 0) {
            obsFinal = `${obsFinal}\n\nDetalhes dos itens:\n${obsItens}`.trim();
        }

        const pedido = await prisma.pedido.create({
            data: {
                clienteNome,
                clienteTelefone,
                endereco: enderecoCompleto,
                formaPagamento: dados.formaPagamento,
                observacoes: obsFinal !== "" ? obsFinal : null,
                total: totalCalculado,
                status: "RECEBIDO",
                itens: {
                    create: itensSeguros.map((item) => ({
                        produtoNome: item.produtoNome,
                        quantidade: item.quantidade,
                        precoUnit: item.precoUnit,
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
