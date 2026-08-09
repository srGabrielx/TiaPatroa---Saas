import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Populando o banco de dados da Cantina Tia Patroa...');

    await prisma.produto.deleteMany();

    const baseProdutos = [
        {
            nome: 'Carne moída c/ legumes',
            descricao: 'Deliciosa carne moída temperada com legumes frescos da estação.',
            preco: 22.90,
            categoria: 'Prato Do Dia',
            imagemUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500',
            disponivel: true,
        },
        {
            nome: 'Filé de frango grelhado',
            descricao: 'Filé de frango suculento grelhado na chapa com acompanhamentos.',
            preco: 20.90,
            categoria: 'Prato Do Dia',
            imagemUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500',
            disponivel: true,
        },
        {
            nome: 'Filé de peixe Frito',
            descricao: 'Filé de peixe empanado crocante por fora e macio por dentro.',
            preco: 25.90,
            categoria: 'Prato Do Dia',
            imagemUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500',
            disponivel: true,
        },
        {
            nome: 'Açaí No Pote',
            descricao: 'Açaí cremoso de 500ml com leite em pó, granolas e leite condensado.',
            preco: 18.00,
            categoria: 'Açaí c/ Acompanhamento',
            imagemUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500',
            disponivel: true,
        },
        {
            nome: 'Água Mineral Nossa Água 500ml',
            descricao: 'Água mineral natural sem gás 500ml.',
            preco: 4.00,
            categoria: 'Bebidas',
            imagemUrl: 'https://images.pexels.com/photos/17399552/pexels-photo-17399552.jpeg',
            disponivel: true,
        },
        {
            nome: 'Coca-Cola Lata 350ml',
            descricao: 'Refrigerante Coca-Cola lata 350ml gelada.',
            preco: 6.00,
            categoria: 'Bebidas',
            imagemUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500',
            disponivel: true,
        },
        {
            nome: 'Coca-Cola Original 2l',
            descricao: 'Refrigerante Coca-Cola garrafa 2 litros.',
            preco: 14.00,
            categoria: 'Bebidas',
            imagemUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500',
            disponivel: true,
        }
    ];

    const produtosDinamicos = Array.from({ length: 20 }, (_, index) => {
        const base = baseProdutos[index % baseProdutos.length];
        return {
            nome: `${base.nome} #${index + 1}`,
            descricao: base.descricao,
            preco: Number((base.preco + (index * 0.5)).toFixed(2)),
            categoria: base.categoria,
            imagemUrl: base.imagemUrl,
            disponivel: true,
        };
    });

    for (const produto of produtosDinamicos) {
        await prisma.produto.create({ data: produto });
    }

    console.log(`✅ ${produtosDinamicos.length} produtos cadastrados com sucesso!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });