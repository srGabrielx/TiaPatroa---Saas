import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
      await requireAdmin();
    } catch {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const pedidos = await prisma.pedido.findMany({
        include: { itens: true },
        orderBy: { createdAt: "desc" },
    });

    let csv = "ID Pedido,Data,Cliente,Telefone,Forma Pagamento,Status,Total,Itens\n";
    pedidos.forEach((p) => {
        const itensStr = p.itens.map((i) => `${i.quantidade}x ${i.produtoNome}`).join(" | ");
        const dataFormatada = new Date(p.createdAt).toLocaleString("pt-BR");
        csv += `"${p.id}","${dataFormatada}","${p.clienteNome}","${p.clienteTelefone}","${p.formaPagamento}","${p.status}","R$ ${p.total.toFixed(2)}","${itensStr}"\n`;
    });

    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename=pedidos_cantina_${Date.now()}.csv`,
        },
    });
}
