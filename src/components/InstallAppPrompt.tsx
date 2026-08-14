"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "avisoInstalarAppFechado";

export default function InstallAppPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone || sessionStorage.getItem(DISMISS_KEY)) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setIsVisible(false);
      sessionStorage.setItem(DISMISS_KEY, "true");
    };

    const showAfterWelcome = () => window.setTimeout(() => setIsVisible(true), 350);

    setIsIos(/iPad|iPhone|iPod/.test(window.navigator.userAgent));
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("welcomeDrawerClosed", showAfterWelcome);

    if (sessionStorage.getItem("welcomeDrawerClosed")) {
      showAfterWelcome();
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("welcomeDrawerClosed", showAfterWelcome);
    };
  }, []);

  const closePrompt = () => {
    setIsVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "true");
  };

  const installApp = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    closePrompt();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-gray-950/45 p-4" role="dialog" aria-modal="true" aria-labelledby="install-app-title">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Download className="h-6 w-6" />
          </div>
          <button onClick={closePrompt} className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600" aria-label="Fechar aviso de instalação">
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 id="install-app-title" className="mt-4 text-xl font-bold text-gray-900">Baixe nosso app</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Tenha a Cantina Tia Patroa na tela inicial e faça seus pedidos ainda mais rápido.
        </p>

        {deferredPrompt ? (
          <button onClick={installApp} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700">
            <Download className="h-4 w-4" />
            Baixar app
          </button>
        ) : isIos ? (
          <p className="mt-5 rounded-xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-600">
            No Safari, toque em <strong>Compartilhar</strong> e selecione <strong>Adicionar à Tela de Início</strong>.
          </p>
        ) : (
          <p className="mt-5 rounded-xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-600">
            Para instalar, abra o menu do navegador e escolha <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.
          </p>
        )}

        <button onClick={closePrompt} className="mt-3 w-full py-2 text-sm font-semibold text-gray-500 transition hover:text-gray-700">
          Agora não
        </button>
      </div>
    </div>
  );
}
