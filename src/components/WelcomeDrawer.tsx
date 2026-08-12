"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

export default function WelcomeDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Verifica se já mostramos a mensagem nesta sessão para não encher o saco do usuário
    const hasSeen = sessionStorage.getItem("hasSeenWelcome");
    
    if (!hasSeen) {
      // Pequeno delay para a animação rodar suave assim que a página carregar
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("hasSeenWelcome", "true");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Fundo escuro (Overlay) */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/60 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`} 
        onClick={() => setIsOpen(false)} 
      />
      
      {/* Drawer vindo da ESQUERDA */}
      <div 
        className={`fixed inset-y-0 left-0 z-[70] w-full sm:w-[50vw] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Botão de Fechar */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors z-10"
        >
          <X size={28} />
        </button>

        {/* Conteúdo Centralizado */}
        <div className="flex flex-col items-center justify-center h-full p-8 text-center overflow-y-auto">
          {/* Imagem da Cozinheira - Substitua a URL por uma imagem real sua se quiser */}
          <div className="w-48 h-48 sm:w-64 sm:h-64 relative mb-6 rounded-full overflow-hidden shadow-xl border-4 border-red-500">
            <img 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=600" 
              alt="Cozinheira Tia Patroa"
              className="object-cover w-full h-full"
            />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo à Cantina Tia Patroa!
          </h2>
          
          <p className="text-gray-600 text-lg mb-8 max-w-md">
            A melhor comida caseira da região. Preparamos tudo com muito amor e ingredientes frescos. Faça seu pedido e entregamos quentinho para você!
          </p>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full max-w-sm h-14 bg-red-600 text-white font-bold text-lg rounded-xl hover:bg-red-700 hover:scale-[1.02] transition-all shadow-lg shadow-red-200"
          >
            Fazer meu pedido
          </button>
        </div>
      </div>
    </>
  );
}