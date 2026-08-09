declare module "prisma" {
  type PrismaConfig = any;
  export function defineConfig(config: PrismaConfig): PrismaConfig;
}
