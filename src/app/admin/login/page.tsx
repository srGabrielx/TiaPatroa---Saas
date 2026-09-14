"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleButton from "@/components/GoogleButton";

export default function AdminLoginPage() {

    const router = useRouter();
    // 🚨 CORREÇÃO: E-mail não está mais exposto para qualquer visitante
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Credenciais inválidas. Tente novamente.");
            setLoading(false);
        } else {
            router.push("/admin");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Acesso Restrito</h1>
                    <p className="text-sm text-gray-500 mt-2">Painel Administrativo - Tia Patroa</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <GoogleButton variant="card" />
                </div>

                <div className="relative flex items-center justify-center my-6">
                    <div className="border-t border-gray-200 w-full"></div>
                    <span className="bg-white px-3 text-xs uppercase tracking-wider text-gray-400 font-semibold absolute">
                        Ou com senha
                    </span>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Seu e-mail de administrador"
                            className="w-full border p-3 rounded-lg outline-none focus:border-red-600 transition-colors bg-white text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full border p-3 rounded-lg outline-none focus:border-red-600 transition-colors bg-white text-gray-900"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 mt-4"
                    >
                        {loading ? "Entrando..." : "Acessar Painel"}
                    </button>
                </form>
            </div>
        </div>
    );
}