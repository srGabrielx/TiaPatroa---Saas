"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ops! A chapa esfriou.</h2>
            <p className="text-gray-500 mb-6 max-w-md">Não conseguimos carregar essa página no momento. Pode ser cache antigo do navegador ou conexão.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    onClick={() => reset()}
                    className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                >
                    Tentar novamente
                </button>
                <a
                    href="/"
                    className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                    Voltar ao Cardápio
                </a>
            </div>
        </div>
    );
}