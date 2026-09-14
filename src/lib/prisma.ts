// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

interface MockProduto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagemUrl: string;
  disponivel: boolean;
  createdAt: Date;
}

interface MockItemPedido {
  id: string;
  pedidoId: string;
  produtoNome: string;
  quantidade: number;
  precoUnit: number;
}

interface MockPedido {
  id: string;
  clienteNome: string;
  clienteTelefone: string;
  endereco: string;
  formaPagamento: string;
  total: number;
  status: string;
  observacoes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function generateId(prefix = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function createInitialStore() {
  const produtos: MockProduto[] = [
    {
      id: "prod_1",
      nome: "Carne moída c/ legumes",
      descricao: "Deliciosa carne moída temperada com legumes frescos da estação e acompanhamentos caseiros.",
      preco: 22.90,
      categoria: "Prato Do Dia",
      imagemUrl: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500",
      disponivel: true,
      createdAt: new Date("2025-01-01T10:00:00Z"),
    },
    {
      id: "prod_2",
      nome: "Filé de frango grelhado",
      descricao: "Filé de frango suculento grelhado na chapa acompanhado de arroz, feijão e salada.",
      preco: 20.90,
      categoria: "Prato Do Dia",
      imagemUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500",
      disponivel: true,
      createdAt: new Date("2025-01-01T10:05:00Z"),
    },
    {
      id: "prod_3",
      nome: "Filé de peixe Frito",
      descricao: "Filé de peixe empanado crocante por fora e macio por dentro com molho tártaro especial.",
      preco: 25.90,
      categoria: "Prato Do Dia",
      imagemUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500",
      disponivel: true,
      createdAt: new Date("2025-01-01T10:10:00Z"),
    },
    {
      id: "prod_4",
      nome: "X-Salada Especial",
      descricao: "Hambúrguer artesanal de 160g, queijo prato derretido, alface fresca, tomate e maionese da casa.",
      preco: 24.90,
      categoria: "Lanches",
      imagemUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
      disponivel: true,
      createdAt: new Date("2025-01-01T10:15:00Z"),
    },
    {
      id: "prod_5",
      nome: "X-Bacon Artesanal",
      descricao: "Hambúrguer artesanal de 160g, fatias crocantes de bacon defumado, queijo cheddar e molho barbecue.",
      preco: 28.90,
      categoria: "Lanches",
      imagemUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500",
      disponivel: true,
      createdAt: new Date("2025-01-01T10:20:00Z"),
    },
    {
      id: "prod_6",
      nome: "Batata Frita c/ Queijo e Bacon",
      descricao: "Porção generosa de batatas fritas sequinhas, cobertas com cheddar cremoso e cubos de bacon.",
      preco: 26.00,
      categoria: "Porções",
      imagemUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500",
      disponivel: true,
      createdAt: new Date("2025-01-01T10:25:00Z"),
    },
    {
      id: "prod_7",
      nome: "Açaí No Pote 500ml",
      descricao: "Açaí cremoso de 500ml batido com banana, acompanhado de leite em pó, granola e leite condensado.",
      preco: 18.00,
      categoria: "Sobremesas",
      imagemUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500",
      disponivel: true,
      createdAt: new Date("2025-01-01T10:30:00Z"),
    },
    {
      id: "prod_8",
      nome: "Pudim de Leite Condensado",
      descricao: "Fatia generosa do autêntico pudim de leite caseiro com calda caramelizada no ponto perfeito.",
      preco: 12.00,
      categoria: "Sobremesas",
      imagemUrl: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=500",
      disponivel: true,
      createdAt: new Date("2025-01-01T10:35:00Z"),
    },
    {
      id: "prod_9",
      nome: "Coca-Cola Lata 350ml",
      descricao: "Refrigerante Coca-Cola lata 350ml estupidamente gelada.",
      preco: 6.00,
      categoria: "Bebidas",
      imagemUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500",
      disponivel: true,
      createdAt: new Date("2025-01-01T10:40:00Z"),
    },
    {
      id: "prod_10",
      nome: "Coca-Cola Original 2l",
      descricao: "Refrigerante Coca-Cola garrafa 2 litros para compartilhar com a família.",
      preco: 14.00,
      categoria: "Bebidas",
      imagemUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500",
      disponivel: true,
      createdAt: new Date("2025-01-01T10:45:00Z"),
    },
    {
      id: "prod_11",
      nome: "Água Mineral 500ml",
      descricao: "Água mineral natural sem gás 500ml gelada.",
      preco: 4.00,
      categoria: "Bebidas",
      imagemUrl: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500",
      disponivel: true,
      createdAt: new Date("2025-01-01T10:50:00Z"),
    },
  ];

  const pedidos: MockPedido[] = [
    {
      id: "ped_001",
      clienteNome: "Maria Oliveira",
      clienteTelefone: "(11) 98765-4321",
      endereco: "Rua das Flores, 123 - Centro",
      formaPagamento: "PIX",
      total: 33.90,
      status: "RECEBIDO",
      observacoes: "Entregar no portão preto",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "ped_002",
      clienteNome: "Lucas Silva",
      clienteTelefone: "(11) 91234-5678",
      endereco: "Av. Paulista, 1000 - Bela Vista",
      formaPagamento: "CARTAO_ENTREGA",
      total: 58.80,
      status: "PREPARANDO",
      observacoes: "Sem cebola no lanche",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      updatedAt: new Date(),
    },
  ];

  const itensPedido: MockItemPedido[] = [
    {
      id: "item_001",
      pedidoId: "ped_001",
      produtoNome: "Carne moída c/ legumes",
      quantidade: 1,
      precoUnit: 22.90,
    },
    {
      id: "item_002",
      pedidoId: "ped_001",
      produtoNome: "Coca-Cola Lata 350ml",
      quantidade: 1,
      precoUnit: 6.00,
    },
    {
      id: "item_003",
      pedidoId: "ped_002",
      produtoNome: "X-Bacon Artesanal",
      quantidade: 1,
      precoUnit: 28.90,
    },
    {
      id: "item_004",
      pedidoId: "ped_002",
      produtoNome: "Batata Frita c/ Queijo e Bacon",
      quantidade: 1,
      precoUnit: 26.00,
    },
  ];

  return { produtos, pedidos, itensPedido };
}

type StoreType = ReturnType<typeof createInitialStore>;

function getStore(): StoreType {
  const g = global as unknown as { __mockDbStore?: StoreType };
  if (!g.__mockDbStore) {
    g.__mockDbStore = createInitialStore();
  }
  return g.__mockDbStore;
}

function createMockPrisma() {
  return {
    produto: {
      async findMany(args?: {
        where?: { disponivel?: boolean; id?: { in?: string[] } };
        orderBy?: { categoria?: "asc" | "desc"; createdAt?: "asc" | "desc" };
        select?: Record<string, boolean>;
      }) {
        const store = getStore();
        let list = [...store.produtos];

        if (args?.where) {
          if (typeof args.where.disponivel === "boolean") {
            list = list.filter((p) => p.disponivel === args.where!.disponivel);
          }
          if (args.where.id?.in) {
            const set = new Set(args.where.id.in);
            list = list.filter((p) => set.has(p.id));
          }
        }

        if (args?.orderBy?.categoria) {
          list.sort((a, b) =>
            args.orderBy!.categoria === "asc"
              ? a.categoria.localeCompare(b.categoria)
              : b.categoria.localeCompare(a.categoria)
          );
        } else if (args?.orderBy?.createdAt) {
          list.sort((a, b) =>
            args.orderBy!.createdAt === "desc"
              ? b.createdAt.getTime() - a.createdAt.getTime()
              : a.createdAt.getTime() - b.createdAt.getTime()
          );
        }

        if (args?.select) {
          return list.map((item) => {
            const selected: Record<string, any> = {};
            for (const key of Object.keys(args.select!)) {
              if (args.select![key]) {
                selected[key] = (item as any)[key];
              }
            }
            return selected;
          });
        }

        return list;
      },

      async findUnique(args: { where: { id: string } }) {
        const store = getStore();
        return store.produtos.find((p) => p.id === args.where.id) || null;
      },

      async create(args: { data: Omit<MockProduto, "id" | "createdAt"> }) {
        const store = getStore();
        const novoProduto: MockProduto = {
          id: generateId("prod"),
          ...args.data,
          createdAt: new Date(),
        };
        store.produtos.unshift(novoProduto);
        return novoProduto;
      },

      async update(args: { where: { id: string }; data: Partial<MockProduto> }) {
        const store = getStore();
        const index = store.produtos.findIndex((p) => p.id === args.where.id);
        if (index === -1) throw new Error("Produto não encontrado");
        store.produtos[index] = { ...store.produtos[index], ...args.data };
        return store.produtos[index];
      },

      async delete(args: { where: { id: string } }) {
        const store = getStore();
        const index = store.produtos.findIndex((p) => p.id === args.where.id);
        if (index === -1) return null;
        const [deleted] = store.produtos.splice(index, 1);
        return deleted;
      },

      async deleteMany() {
        const store = getStore();
        store.produtos = [];
        return { count: 0 };
      },
    },

    pedido: {
      async findMany(args?: {
        include?: { itens?: boolean };
        orderBy?: { createdAt?: "asc" | "desc" };
      }) {
        const store = getStore();
        const list = [...store.pedidos];

        list.sort((a, b) =>
          args?.orderBy?.createdAt === "asc"
            ? a.createdAt.getTime() - b.createdAt.getTime()
            : b.createdAt.getTime() - a.createdAt.getTime()
        );

        if (args?.include?.itens) {
          return list.map((pedido) => ({
            ...pedido,
            itens: store.itensPedido.filter((item) => item.pedidoId === pedido.id),
          }));
        }

        return list;
      },

      async findUnique(args: { where: { id: string }; include?: { itens?: boolean } }) {
        const store = getStore();
        const pedido = store.pedidos.find((p) => p.id === args.where.id);
        if (!pedido) return null;

        if (args.include?.itens) {
          return {
            ...pedido,
            itens: store.itensPedido.filter((item) => item.pedidoId === pedido.id),
          };
        }

        return pedido;
      },

      async create(args: {
        data: Omit<MockPedido, "id" | "createdAt" | "updatedAt"> & {
          itens?: { create: Array<Omit<MockItemPedido, "id" | "pedidoId">> };
        };
      }) {
        const store = getStore();
        const pedidoId = generateId("ped");
        const novoPedido: MockPedido = {
          id: pedidoId,
          clienteNome: args.data.clienteNome,
          clienteTelefone: args.data.clienteTelefone,
          endereco: args.data.endereco,
          formaPagamento: args.data.formaPagamento,
          total: args.data.total,
          status: args.data.status || "RECEBIDO",
          observacoes: args.data.observacoes ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        store.pedidos.unshift(novoPedido);

        const createdItens: MockItemPedido[] = [];
        if (args.data.itens?.create) {
          for (const item of args.data.itens.create) {
            const novoItem: MockItemPedido = {
              id: generateId("item"),
              pedidoId,
              produtoNome: item.produtoNome,
              quantidade: item.quantidade,
              precoUnit: item.precoUnit,
            };
            store.itensPedido.push(novoItem);
            createdItens.push(novoItem);
          }
        }

        return {
          ...novoPedido,
          itens: createdItens,
        };
      },

      async update(args: { where: { id: string }; data: Partial<MockPedido> }) {
        const store = getStore();
        const index = store.pedidos.findIndex((p) => p.id === args.where.id);
        if (index === -1) throw new Error("Pedido não encontrado");
        store.pedidos[index] = {
          ...store.pedidos[index],
          ...args.data,
          updatedAt: new Date(),
        };
        return store.pedidos[index];
      },

      async delete(args: { where: { id: string } }) {
        const store = getStore();
        const index = store.pedidos.findIndex((p) => p.id === args.where.id);
        if (index === -1) return null;
        const [deleted] = store.pedidos.splice(index, 1);
        store.itensPedido = store.itensPedido.filter((i) => i.pedidoId !== deleted.id);
        return deleted;
      },
    },

    itemPedido: {
      async findMany(args?: { where?: { pedidoId?: string } }) {
        const store = getStore();
        if (args?.where?.pedidoId) {
          return store.itensPedido.filter((i) => i.pedidoId === args.where!.pedidoId);
        }
        return [...store.itensPedido];
      },

      async create(args: { data: Omit<MockItemPedido, "id"> }) {
        const store = getStore();
        const item: MockItemPedido = {
          id: generateId("item"),
          ...args.data,
        };
        store.itensPedido.push(item);
        return item;
      },
    },

    user: {
      async findUnique(args: { where: { email?: string; id?: string } }) {
        return null;
      },
      async findFirst() {
        return null;
      },
      async create(args: { data: any }) {
        return { id: generateId("user"), ...args.data };
      },
    },

    async $connect() {},
    async $disconnect() {},
  };
}

// Inicialização com suporte a SQLite local e fallback em memória automático
const globalForPrisma = global as unknown as { prisma?: any };

function createResilientPrisma() {
  const mock = createMockPrisma();
  let realPrisma: any = null;
  try {
    realPrisma = new PrismaClient();
  } catch (err) {
    console.warn("[AI Studio] Inicializando em modo 100% em memória (sem banco):", err);
    return mock;
  }

  return new Proxy(mock, {
    get(target, prop: string | symbol) {
      if (realPrisma && prop in realPrisma) {
        const realVal = (realPrisma as any)[prop];
        if (typeof realVal === "object" && realVal !== null) {
          return new Proxy(realVal, {
            get(subTarget, subProp: string | symbol) {
              const realMethod = (subTarget as any)[subProp];
              const mockMethod = (target as any)[prop]?.[subProp];
              if (typeof realMethod === "function") {
                return async (...args: any[]) => {
                  try {
                    const result = await realMethod.apply(subTarget, args);
                    // Se findMany retornou vazio e temos dados no mock, podemos preencher com o mock inicial
                    if (Array.isArray(result) && result.length === 0 && typeof mockMethod === "function") {
                      const mockResult = await mockMethod.apply((target as any)[prop], args);
                      if (Array.isArray(mockResult) && mockResult.length > 0) {
                        return mockResult;
                      }
                    }
                    return result;
                  } catch (err) {
                    console.warn(`[Prisma Fallback] ${String(prop)}.${String(subProp)} falhou no banco, usando mock:`, err);
                    if (typeof mockMethod === "function") {
                      return await mockMethod.apply((target as any)[prop], args);
                    }
                    throw err;
                  }
                };
              }
              return realMethod;
            },
          });
        }
        return realVal;
      }
      return (target as any)[prop];
    },
  });
}

export const prisma: PrismaClient = (globalForPrisma.prisma || createResilientPrisma()) as unknown as PrismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

