import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

// 1. Configuração da cor da barra de status no telemóvel
export const viewport: Viewport = {
  themeColor: "#dc2626",
};

// 2. Metadados atualizados com as configurações PWA
export const metadata: Metadata = {
  title: "Cantina Tia Patroa",
  description: "A melhor comida da região, entregue quentinha na tua casa!",
  manifest: "/manifest.json", // O ficheiro que criámos na pasta public
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "Tia Patroa",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
