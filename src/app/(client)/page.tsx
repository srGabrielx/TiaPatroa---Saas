import { prisma } from "@/lib/prisma";
import CardapioVitrine from "@/components/CardapioVitrine";
import CadastrarProdutoModal from "@/components/CadastrarProdutoModal";
import GoogleButton from "@/components/GoogleButton";

export const dynamic = 'force-dynamic';

// Catálogo de produtos registrado diretamente no Index (funciona 100% sem banco de dados externo)
const PRODUTOS_INDEX_PADRAO = [
    {
        id: "prod_index_1",
        nome: "Carne moída c/ legumes",
        descricao: "Deliciosa carne moída temperada com legumes frescos da estação e acompanhamentos caseiros.",
        preco: 22.90,
        categoria: "Prato Do Dia",
        imagemUrl: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500",
        disponivel: true,
    },
    {
        id: "prod_index_2",
        nome: "Filé de frango grelhado",
        descricao: "Filé de frango suculento grelhado na chapa acompanhado de arroz, feijão e salada.",
        preco: 20.90,
        categoria: "Prato Do Dia",
        imagemUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500",
        disponivel: true,
    },
    {
        id: "prod_index_3",
        nome: "Filé de peixe Frito",
        descricao: "Filé de peixe empanado crocante por fora e macio por dentro com molho tártaro especial.",
        preco: 25.90,
        categoria: "Prato Do Dia",
        imagemUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500",
        disponivel: true,
    },
    {
        id: "prod_index_4",
        nome: "X-Salada Especial",
        descricao: "Hambúrguer artesanal de 160g, queijo prato derretido, alface fresca, tomate e maionese da casa.",
        preco: 24.90,
        categoria: "Lanches",
        imagemUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        disponivel: true,
    },
    {
        id: "prod_index_5",
        nome: "X-Bacon Artesanal",
        descricao: "Hambúrguer artesanal de 160g, fatias crocantes de bacon defumado, queijo cheddar e molho barbecue.",
        preco: 28.90,
        categoria: "Lanches",
        imagemUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500",
        disponivel: true,
    },
    {
        id: "prod_index_6",
        nome: "Batata Frita c/ Queijo e Bacon",
        descricao: "Porção generosa de batatas fritas sequinhas, cobertas com cheddar cremoso e cubos de bacon.",
        preco: 26.00,
        categoria: "Porções",
        imagemUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500",
        disponivel: true,
    },
    {
        id: "prod_index_7",
        nome: "Açaí No Pote 500ml",
        descricao: "Açaí cremoso de 500ml batido com banana, acompanhado de leite em pó, granola e leite condensado.",
        preco: 18.00,
        categoria: "Sobremesas",
        imagemUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500",
        disponivel: true,
    },
    {
        id: "prod_index_8",
        nome: "Pudim de Leite Condensado",
        descricao: "Fatia generosa do autêntico pudim de leite caseiro com calda caramelizada no ponto perfeito.",
        preco: 12.00,
        categoria: "Sobremesas",
        imagemUrl: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=500",
        disponivel: true,
    },
    {
        id: "prod_index_9",
        nome: "Coca-Cola Lata 350ml",
        descricao: "Refrigerante Coca-Cola lata 350ml estupidamente gelada.",
        preco: 6.00,
        categoria: "Bebidas",
        imagemUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500",
        disponivel: true,
    },
    {
        id: "prod_index_10",
        nome: "Água Mineral 500ml",
        descricao: "Água mineral natural sem gás 500ml gelada.",
        preco: 4.00,
        categoria: "Bebidas",
        imagemUrl: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500",
        disponivel: true,
    },
];

export default async function HomePage() {
    let produtos: any[] = [];

    try {
        produtos = await prisma.produto.findMany({
            where: { disponivel: true },
            orderBy: { categoria: 'asc' }
        });
    } catch (err) {
        console.warn("[Index] Consulta de produtos falhou, carregando catálogo do Index:", err);
    }

    // Se o banco local estiver vazio ou indisponível, usa os produtos cadastrados no Index
    if (!produtos || produtos.length === 0) {
        produtos = PRODUTOS_INDEX_PADRAO;
    }

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

                    {/* Botões de Ação Direta no Index: Cadastrar Produto e Botão Google */}
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 shrink-0">
                        <CadastrarProdutoModal />
                        <GoogleButton variant="hero" />
                    </div>
                </div>
            </div>

            {/* Vitrine do Cardápio */}
            <CardapioVitrine produtos={produtos} />
        </div>
    );
}
