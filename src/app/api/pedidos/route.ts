import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { clienteNome, clienteTelefone, endereco, formaPagamento, total, observacoes, itens } = body;

        // Validação básica
        if (!clienteNome || !clienteTelefone || !endereco || !itens || itens.length === 0) {
            return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
        }

        // Criação do pedido no Prisma
        const novoPedido = await prisma.pedido.create({
            data: {
                clienteNome,
                clienteTelefone,
                endereco,
                formaPagamento,
                total,
                observacoes,
                status: "RECEBIDO",
                itens: {
                    create: itens.map((item: any) => ({
                        produtoNome: item.nome,
                        quantidade: item.quantidade,
                        precoUnit: item.preco,
                    })),
                },
            },
        });

        return NextResponse.json({ sucesso: true, pedidoId: novoPedido.id }, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}