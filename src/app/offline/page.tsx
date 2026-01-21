"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-warning/20 mb-6">
          <WifiOff className="h-10 w-10 text-warning" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Você está offline</h1>

        <p className="text-muted mb-6">
          Parece que você está sem conexão com a internet. Não se preocupe, sua
          manifestação está salva localmente e será enviada automaticamente quando
          você voltar online.
        </p>

        <div className="space-y-3">
          <Button onClick={handleRefresh} className="w-full">
            <RefreshCw className="h-5 w-5 mr-2" />
            Tentar novamente
          </Button>

          <p className="text-xs text-muted">
            Você pode continuar preenchendo sua manifestação offline. Os dados
            serão sincronizados automaticamente.
          </p>
        </div>
      </div>
    </div>
  );
}
