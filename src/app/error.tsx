"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ops! A chapa esfriou.</h2>
            <p className="text-gray-500 mb-6">Não conseguimos carregar essa página no momento.</p>
            <button
                onClick={() => reset()}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
                Tentar novamente
            </button>
        </div>
    );
}