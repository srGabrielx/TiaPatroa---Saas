"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";

// Definição dos tipos válidos com base no schema.prisma
type StatusPedido = "RECEBIDO" | "PREPARANDO" | "SAIU_PARA_ENTREGA" | "FINALIZADO" | "CANCELADO";

export async function atualizarStatusPedido(id: string, novoStatus: StatusPedido) {
    try {
        await requireAdmin();
        await prisma.pedido.update({
            where: { id },
            data: { status: novoStatus }
        });

        // Revalida as páginas para atualizar os dados em tempo real
        revalidatePath("/admin");
        revalidatePath("/admin/pedidos");
        revalidatePath(`/pedido/${id}`);

        // Removemos o "return { sucesso: true }" para satisfazer o TypeScript no Next.js 14
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
    }
}
