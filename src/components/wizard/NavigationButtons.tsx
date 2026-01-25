"use client";

import { ChevronLeft, ChevronRight, Send, Loader2, RotateCcw } from "lucide-react";
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
  onRecomecar?: () => void;
  textoAvancar?: string;
  textoVoltar?: string;
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
  onRecomecar,
  textoAvancar = "Avançar",
  textoVoltar = "Voltar",
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
      {/* Botões do lado esquerdo */}
      <div className="flex items-center gap-2">
        {/* Botão Voltar - Estilo Participa DF */}
        <Button
          type="button"
          variant="outline"
          onClick={onVoltar}
          disabled={!podeVoltar || isSubmitting}
          className={cn(
            "bg-[#28477D] text-white border-[#28477D] hover:bg-[#1E3A5F] hover:border-[#1E3A5F] hover:text-white",
            !podeVoltar && "invisible"
          )}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {textoVoltar}
        </Button>

        {/* Botão Recomeçar (opcional) */}
        {onRecomecar && (
          <Button
            type="button"
            variant="ghost"
            onClick={onRecomecar}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title="Limpar e recomeçar"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Recomeçar
          </Button>
        )}
      </div>

      {/* Botão Avançar ou Enviar - Estilo Participa DF (Verde) */}
      {isUltimaEtapa ? (
        <Button
          type="button"
          onClick={onEnviar}
          disabled={!podeAvancar || isSubmitting}
          className="bg-[#549250] hover:bg-[#3d7039] text-white"
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
          className="bg-[#549250] hover:bg-[#3d7039] text-white disabled:bg-gray-300 disabled:text-gray-500"
        >
          {textoAvancar}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
