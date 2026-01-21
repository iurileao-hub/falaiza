"use client";

import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationButtonsProps {
  etapaAtual: number;
  totalEtapas: number;
  podeAvancar: boolean;
  podeVoltar: boolean;
  isSubmitting?: boolean;
  onVoltar: () => void;
  onAvancar: () => void;
  onEnviar?: () => void;
  className?: string;
}

export function NavigationButtons({
  etapaAtual,
  totalEtapas,
  podeAvancar,
  podeVoltar,
  isSubmitting = false,
  onVoltar,
  onAvancar,
  onEnviar,
  className,
}: NavigationButtonsProps) {
  const isUltimaEtapa = etapaAtual === totalEtapas;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 pt-6 border-t border-border",
        className
      )}
    >
      {/* Botão Voltar */}
      <Button
        type="button"
        variant="outline"
        onClick={onVoltar}
        disabled={!podeVoltar || isSubmitting}
        className={cn(!podeVoltar && "invisible")}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      {/* Botão Avançar ou Enviar */}
      {isUltimaEtapa ? (
        <Button
          type="button"
          onClick={onEnviar}
          disabled={!podeAvancar || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Enviar Manifestação
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onAvancar}
          disabled={!podeAvancar || isSubmitting}
        >
          Avançar
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
