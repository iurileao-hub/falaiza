"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    // Verificar estado inicial
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      // Esconder mensagem de reconexão após 3 segundos
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Não mostrar nada se estiver online e não reconectou recentemente
  if (isOnline && !showReconnected) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50 transition-all duration-300",
        "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg",
        isOnline
          ? "bg-success text-white"
          : "bg-warning text-white"
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-5 w-5" />
          <span className="text-sm font-medium">
            Conexão restabelecida! Sincronizando dados...
          </span>
        </>
      ) : (
        <>
          <WifiOff className="h-5 w-5" />
          <div>
            <p className="text-sm font-medium">Você está offline</p>
            <p className="text-xs opacity-90">
              Seus dados serão salvos e enviados quando voltar online.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
