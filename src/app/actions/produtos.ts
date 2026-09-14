"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";

export async function cadastrarProdutoViaIndex(data: FormData) {
    const nome = data.get("nome") as string;
    const descricao = (data.get("descricao") as string) || "";
    const preco = parseFloat(data.get("preco") as string);
    const categoria = data.get("categoria") as string;
    const imagemUrl = (data.get("imagemUrl") as string) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";

    if (!nome || isNaN(preco) || !categoria) {
        return { success: false, error: "Nome, preço e categoria são obrigatórios." };
    }

    try {
        const novoProduto = await prisma.produto.create({
            data: {
                nome,
                descricao,
                preco,
                categoria,
                imagemUrl,
                disponivel: true,
            }
        });

        revalidatePath("/");
        revalidatePath("/admin/produtos");
        return { success: true, produto: novoProduto };
    } catch (error: any) {
        console.error("Erro ao cadastrar via index:", error);
        return { success: false, error: error?.message || "Falha ao salvar produto." };
    }
}

export async function criarProduto(data: FormData) {

    await requireAdmin();
    const nome = data.get("nome") as string;
    const descricao = data.get("descricao") as string;
    const preco = parseFloat(data.get("preco") as string);
    const categoria = data.get("categoria") as string;
    const imagemUrl = data.get("imagemUrl") as string;

    if (!nome || !preco || !categoria) return; // Retorna vazio (void) se falhar

    await prisma.produto.create({
        data: {
            nome,
            descricao,
            preco,
            categoria,
            imagemUrl,
            disponivel: true,
        }
    });

    revalidatePath("/");
    revalidatePath("/admin/produtos");
}

export async function excluirProduto(id: string) {
    try {
        await requireAdmin();
        await prisma.produto.delete({
            where: { id }
        });
        revalidatePath("/");
        revalidatePath("/admin/produtos");
    } catch (error) {
        console.error("Erro ao excluir o produto", error);
    }
}

export async function alterarDisponibilidade(id: string, disponivel: boolean) {
    try {
        await requireAdmin();
        await prisma.produto.update({
            where: { id },
            data: { disponivel }
        });

        revalidatePath("/");
        revalidatePath("/admin/produtos");
    } catch (error) {
        console.error("Erro ao alterar disponibilidade", error);
    }
}
