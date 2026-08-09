"use client";
import { useEffect, useState } from "react";
import { UtensilsCrossed, X } from "lucide-react"; // Substituímos o ChefHat aqui

export function WelcomeToast() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const jaMostrou = sessionStorage.getItem("boasVindasMostrada");
    if (!jaMostrou) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem("boasVindasMostrada", "true");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 p-4 z-[60] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="flex items-start gap-4">
        
        {/* Ícone atualizado para UtensilsCrossed */}
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0 border border-red-100">
          <UtensilsCrossed className="w-6 h-6" />
        </div>
        
        <div className="flex-1 pt-1">
          <h3 className="text-sm font-bold text-gray-900 leading-none mb-1.5">
            Olá, Bem-vindo(a)! 👨‍🍳
          </h3>
          <p className="text-xs text-gray-500 leading-snug">
            Fome de quê hoje? Confira nossos pratos fresquinhos preparados pela Tia Patroa.
          </p>
        </div>
        
        <button 
          onClick={() => setIsVisible(false)} 
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}