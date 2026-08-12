import withPWAInit from 'next-pwa';

// 1. Configuração do PWA
const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

// 2. Configurações Globais do Next.js (Imagens, StrictMode, etc)
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

// 3. Exportando o Next.js envelopado com o PWA
export default withPWA(nextConfig);