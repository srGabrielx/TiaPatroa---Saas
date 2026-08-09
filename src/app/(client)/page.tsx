import { prisma } from "@/lib/prisma";
import CardapioVitrine from "@/components/CardapioVitrine";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    // Busca direta no banco de dados via Prisma ORM
    const produtos = await prisma.produto.findMany({
        where: { disponivel: true },
        orderBy: { categoria: 'asc' }
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Banner da Cantina */}
            <div className="bg-red-600 text-white py-12 px-4 shadow-inner">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-3 text-center md:text-left">
                        <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Abertos para pedidos
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            Cantina Tia Patroa
                        </h1>
                        <p className="text-red-100 max-w-lg text-sm md:text-base">
                            Comida caseira com sabor de família. Peça seu prato favorito e receba quentinho na sua casa.
                        </p>
                    </div>
                </div>
            </div>

            {/* Vitrine alimentada pelo Banco */}
            <CardapioVitrine produtos={produtos} />
        </div>
    );
}